import { SlashCommandBuilder, PermissionFlagsBits, EmbedBuilder } from 'discord.js';

export default {
  data: new SlashCommandBuilder()
    .setName('unban')
    .setDescription('Kullanıcının banını ID ile kaldırır.')
    .addStringOption(option =>
      option.setName('userid')
        .setDescription('Yasağı kaldırılacak kullanıcının ID numarası')
        .setRequired(true))
    .addStringOption(option =>
      option.setName('reason')
        .setDescription('Kaldırma sebebi')
        .setRequired(false))
    .setDefaultMemberPermissions(PermissionFlagsBits.BanMembers),

  async execute(interaction) {
    const userId = interaction.options.getString('userid');
    const reason = interaction.options.getString('reason') || 'Sebep belirtilmedi.';

    try {
      const banInfo = await interaction.guild.bans.fetch(userId);
      await interaction.guild.members.unban(userId, `${reason} - Yetkili: ${interaction.user.tag}`);

      const embed = new EmbedBuilder()
        .setColor(0x57F287)
        .setTitle('✅ Yasak Kaldırıldı')
        .addFields(
          { name: 'Kullanıcı', value: `${banInfo.user.tag} (${userId})`, inline: true },
          { name: 'Yetkili', value: interaction.user.tag, inline: true },
          { name: 'Sebep', value: reason }
        )
        .setTimestamp();

      return interaction.reply({ embeds: [embed] });
    } catch {
      return interaction.reply({ content: '❌ Bu ID ile yasaklanmış bir kullanıcı bulunamadı.', ephemeral: true });
    }
  }
};
