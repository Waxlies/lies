import { SlashCommandBuilder, PermissionFlagsBits, EmbedBuilder } from 'discord.js';

export default {
  data: new SlashCommandBuilder()
    .setName('kick')
    .setDescription('Belirtilen kullanıcıyı sunucudan atar.')
    .addUserOption(option =>
      option.setName('target')
        .setDescription('Atılacak kullanıcı')
        .setRequired(true))
    .addStringOption(option =>
      option.setName('reason')
        .setDescription('Atılma sebebi')
        .setRequired(false))
    .setDefaultMemberPermissions(PermissionFlagsBits.KickMembers),

  async execute(interaction) {
    const target = interaction.options.getUser('target');
    const reason = interaction.options.getString('reason') || 'Sebep belirtilmedi.';
    const member = await interaction.guild.members.fetch(target.id).catch(() => null);

    if (!member) {
      return interaction.reply({ content: '❌ Kullanıcı bu sunucuda bulunamadı.', ephemeral: true });
    }

    if (!member.kickable) {
      return interaction.reply({ content: '❌ Bu kullanıcıyı atma yetkim yetmiyor (rol hiyerarşisini kontrol edin).', ephemeral: true });
    }

    await member.kick(`${reason} - Yetkili: ${interaction.user.tag}`);

    const embed = new EmbedBuilder()
      .setColor(0xFEE75C)
      .setTitle('👢 Kullanıcı Atıldı')
      .addFields(
        { name: 'Kullanıcı', value: `${target.tag} (${target.id})`, inline: true },
        { name: 'Yetkili', value: interaction.user.tag, inline: true },
        { name: 'Sebep', value: reason }
      )
      .setTimestamp();

    return interaction.reply({ embeds: [embed] });
  }
};
