import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { Client, GatewayIntentBits, Collection, ActivityType } from 'discord.js';
import dotenv from 'dotenv';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.GuildMembers
  ]
});

client.commands = new Collection();

// Load Commands
const commandsPath = path.join(__dirname, 'commands');
const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
  const filePath = path.join(commandsPath, file);
  const command = (await import(`file://${filePath}`)).default;
  if ('data' in command && 'execute' in command) {
    client.commands.set(command.data.name, command);
  } else {
    console.warn(`[UYARI] ${file} dosyasında gerekli "data" veya "execute" özellikleri eksik.`);
  }
}

client.once('ready', () => {
  console.log(`🤖 Bot giriş yaptı: ${client.user.tag}`);
  client.user.setPresence({
    activities: [{ name: 'Sunucu Güvenliğini 🛡️', type: ActivityType.Watching }],
    status: 'online'
  });
});

client.on('interactionCreate', async interaction => {
  if (!interaction.isChatInputCommand()) return;

  const command = client.commands.get(interaction.commandName);
  if (!command) return;

  try {
    await command.execute(interaction);
  } catch (error) {
    console.error(`[HATA] ${interaction.commandName} çalıştırılırken hata:`, error);
    const replyContent = { content: '❌ Bu komut yürütülürken beklenmedik bir hata oluştu!', ephemeral: true };
    if (interaction.replied || interaction.deferred) {
      await interaction.followUp(replyContent).catch(() => {});
    } else {
      await interaction.reply(replyContent).catch(() => {});
    }
  }
});

const token = process.env.DISCORD_TOKEN;
if (!token || token === 'your_bot_token_here') {
  console.error('❌ Hata: .env dosyasında geçerli bir DISCORD_TOKEN tanımlanmamış!');
  process.exit(1);
}

client.login(token);
