const { SlashCommandBuilder, EmbedBuilder, MessageFlags } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('report')
    .setDescription('Reporta a un usuario por un comportamiento inapropiado.')
    .addUserOption(option =>
      option.setName('usuario')
        .setDescription('El usuario que deseas reportar.')
        .setRequired(true))
    .addStringOption(option =>
      option.setName('motivo')
        .setDescription('El motivo del reporte.')
        .setRequired(true))
    .addAttachmentOption(option =>
      option.setName('evidencia')
        .setDescription('Adjunta una imagen o video como evidencia (opcional).')
        .setRequired(false)),
  async execute(interaction, client) {
    const user = interaction.options.getUser('usuario');
    const reason = interaction.options.getString('motivo');
    const evidence = interaction.options.getAttachment('evidencia');

    const reportEmbed = new EmbedBuilder()
      .setTitle('🚨 Nuevo Reporte')
      .setDescription(`Se ha reportado a **${user} (${user.id})**.`)
      .setThumbnail(user.displayAvatarURL())
      .addFields(
        { name: 'Reportado por', value: `<@${interaction.user.id}>` + ` (${interaction.user.id})` },
        { name: 'Motivo', value: reason },
      )
      .setColor('#ff0000')
      .setTimestamp();

    if (evidence) {
      if (evidence.contentType.startsWith('image/') || evidence.contentType.startsWith('video/')) {
        reportEmbed.setImage(evidence.url);
        reportEmbed.addFields({ name: 'Evidencia', value: `[Ver evidencia](${evidence.url})` });
      } else {
        reportEmbed.addFields({ name: 'Evidencia', value: 'Formato no válido. Solo se aceptan imágenes o videos.' });
      }
    }

    const logChannel = interaction.guild.channels.cache.get('1347380865893798018');
    if (logChannel) {
      await logChannel.send({ embeds: [reportEmbed] });
      await interaction.reply({
        content: 'Tu reporte ha sido enviado correctamente. ¡Gracias por tu colaboración!',
        flags: MessageFlags.Ephemeral,
      });
    } else {
      await interaction.reply({
        content: 'No se pudo enviar el reporte. Por favor, contacta a un administrador.',
        flags: MessageFlags.Ephemeral,
      });
      console.error('No se encontró el canal de registros.');
    }
  },
};