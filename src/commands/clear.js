import { SlashCommandBuilder, PermissionFlagsBits, EmbedBuilder } from 'discord.js';

export default {
  data: new SlashCommandBuilder()
    .setName('clear')
    .setDescription('Belirtilen sayıda mesajı kanaldan siler.')
    .addIntegerOption(option =>
      option.setName('amount')
        .setDescription('Silinecek mesaj sayısı (1 - 100)')
        .setRequired(true)
        .setMinValue(1)
        .setMaxValue(100))
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageMessages),

  async execute(interaction) {
    const amount = interaction.options.getInteger('amount');

    const deleted = await interaction.channel.bulkDelete(amount, true).catch(err => {
      console.error(err);
      return null;
    });

    if (!deleted) {
      return interaction.reply({
        content: '❌ Mesajlar silinemedi. (14 günden eski mesajlar Discord API kısıtlaması nedeniyle toplu silinemez)',
        ephemeral: true
      });
    }

    const embed = new EmbedBuilder()
      .setColor(0x57F287)
      .setTitle('🧹 Mesajlar Temizlendi')
      .setDescription(`Başarıyla **${deleted.size}** adet mesaj silindi.`)
      .setFooter({ text: `Yetkili: ${interaction.user.tag}` })
      .setTimestamp();

    await interaction.reply({ embeds: [embed] });

    setTimeout(() => {
      interaction.deleteReply().catch(() => {});
    }, 5000);
  }
};
