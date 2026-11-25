import { SlashCommandBuilder, PermissionFlagsBits, EmbedBuilder } from 'discord.js';

export default {
  data: new SlashCommandBuilder()
    .setName('timeout')
    .setDescription('Kullanıcıyı belirli bir süre susturur (Zaman aşımı).')
    .addUserOption(option =>
      option.setName('target')
        .setDescription('Susturulacak kullanıcı')
        .setRequired(true))
    .addIntegerOption(option =>
      option.setName('duration')
        .setDescription('Süre (dakika cinsinden)')
        .setRequired(true)
        .setMinValue(1)
        .setMaxValue(40320))
    .addStringOption(option =>
      option.setName('reason')
        .setDescription('Susturma sebebi')
        .setRequired(false))
    .setDefaultMemberPermissions(PermissionFlagsBits.ModerateMembers),

  async execute(interaction) {
    const target = interaction.options.getUser('target');
    const minutes = interaction.options.getInteger('duration');
    const reason = interaction.options.getString('reason') || 'Sebep belirtilmedi.';
    const member = await interaction.guild.members.fetch(target.id).catch(() => null);

    if (!member) {
      return interaction.reply({ content: '❌ Kullanıcı bu sunucuda bulunamadı.', ephemeral: true });
    }

    if (!member.moderatable) {
      return interaction.reply({ content: '❌ Bu kullanıcıyı susturma yetkim yetmiyor.', ephemeral: true });
    }

    const durationMs = minutes * 60 * 1000;
    await member.timeout(durationMs, `${reason} - Yetkili: ${interaction.user.tag}`);

    const embed = new EmbedBuilder()
      .setColor(0x5865F2)
      .setTitle('⏳ Kullanıcı Susturuldu')
      .addFields(
        { name: 'Kullanıcı', value: `${target.tag} (${target.id})`, inline: true },
        { name: 'Süre', value: `${minutes} dakika`, inline: true },
        { name: 'Yetkili', value: interaction.user.tag, inline: true },
        { name: 'Sebep', value: reason }
      )
      .setTimestamp();

    return interaction.reply({ embeds: [embed] });
  }
};
