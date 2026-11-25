import { SlashCommandBuilder, PermissionFlagsBits, EmbedBuilder } from 'discord.js';

export default {
  data: new SlashCommandBuilder()
    .setName('ban')
    .setDescription('Belirtilen kullanıcıyı sunucudan yasaklar.')
    .addUserOption(option =>
      option.setName('target')
        .setDescription('Yasaklanacak kullanıcı')
        .setRequired(true))
    .addStringOption(option =>
      option.setName('reason')
        .setDescription('Yasaklama sebebi')
        .setRequired(false))
    .setDefaultMemberPermissions(PermissionFlagsBits.BanMembers),

  async execute(interaction) {
    const target = interaction.options.getUser('target');
    const reason = interaction.options.getString('reason') || 'Sebep belirtilmedi.';
    const member = await interaction.guild.members.fetch(target.id).catch(() => null);

    if (!member) {
      return interaction.reply({ content: '❌ Kullanıcı bu sunucuda bulunamadı.', ephemeral: true });
    }

    if (!member.bannable) {
      return interaction.reply({ content: '❌ Bu kullanıcıyı yasaklama yetkim yetmiyor (rol hiyerarşisini kontrol edin).', ephemeral: true });
    }

    await member.ban({ reason: `${reason} - Yetkili: ${interaction.user.tag}` });

    const embed = new EmbedBuilder()
      .setColor(0xED4245)
      .setTitle('🔨 Kullanıcı Yasaklandı')
      .addFields(
        { name: 'Kullanıcı', value: `${target.tag} (${target.id})`, inline: true },
        { name: 'Yetkili', value: interaction.user.tag, inline: true },
        { name: 'Sebep', value: reason }
      )
      .setTimestamp();

    return interaction.reply({ embeds: [embed] });
  }
};
