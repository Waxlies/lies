import { SlashCommandBuilder, PermissionFlagsBits, EmbedBuilder } from 'discord.js';

export default {
  data: new SlashCommandBuilder()
    .setName('untimeout')
    .setDescription('Kullanıcının susturmasını (zaman aşımını) kaldırır.')
    .addUserOption(option =>
      option.setName('target')
        .setDescription('Susturması kaldırılacak kullanıcı')
        .setRequired(true))
    .setDefaultMemberPermissions(PermissionFlagsBits.ModerateMembers),

  async execute(interaction) {
    const target = interaction.options.getUser('target');
    const member = await interaction.guild.members.fetch(target.id).catch(() => null);

    if (!member) {
      return interaction.reply({ content: '❌ Kullanıcı bulunamadı.', ephemeral: true });
    }

    if (!member.isCommunicationDisabled()) {
      return interaction.reply({ content: 'ℹ️ Bu kullanıcı zaten susturulmuş durumda değil.', ephemeral: true });
    }

    await member.timeout(null, `Yetkili: ${interaction.user.tag}`);

    const embed = new EmbedBuilder()
      .setColor(0x57F287)
      .setTitle('🔊 Susturma Kaldırıldı')
      .setDescription(`${target.tag} kullanıcısının susturulması kaldırıldı.`)
      .setTimestamp();

    return interaction.reply({ embeds: [embed] });
  }
};
