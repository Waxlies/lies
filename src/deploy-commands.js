import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { REST, Routes } from 'discord.js';
import dotenv from 'dotenv';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const commands = [];
const commandsPath = path.join(__dirname, 'commands');
const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
  const filePath = path.join(commandsPath, file);
  const command = (await import(`file://${filePath}`)).default;
  if ('data' in command) {
    commands.push(command.data.toJSON());
  }
}

const rest = new REST({ version: '10' }).setToken(process.env.DISCORD_TOKEN);

(async () => {
  try {
    console.log(`🔄 ${commands.length} adet slash komutu Discord API'ye yükleniyor...`);

    const clientId = process.env.CLIENT_ID;
    const guildId = process.env.GUILD_ID;

    if (!clientId) {
      throw new Error('.env dosyasında CLIENT_ID belirtilmemiş.');
    }

    if (guildId) {
      // Belirli bir sunucuya hızlı yükleme (geliştirme ve anında güncelleme için)
      await rest.put(
        Routes.applicationGuildCommands(clientId, guildId),
        { body: commands }
      );
      console.log(`✅ Komutlar ${guildId} ID'li sunucuya başarıyla yüklendi!`);
    } else {
      // Global yükleme (tüm sunucular için)
      await rest.put(
        Routes.applicationCommands(clientId),
        { body: commands }
      );
      console.log('✅ Komutlar global olarak tüm sunuculara yüklendi!');
    }
  } catch (error) {
    console.error('❌ Komutlar yüklenirken bir hata oluştu:', error);
  }
})();
