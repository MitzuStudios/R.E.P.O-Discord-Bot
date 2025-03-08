const { SlashCommandBuilder, PermissionFlagsBits, EmbedBuilder, MessageFlags } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('ban')
    .setDescription('Banea a un usuario del servidor.')
    .addUserOption(option =>
      option.setName('usuario')
        .setDescription('El usuario que quieres banear.')
        .setRequired(true))
    .addStringOption(option =>
      option.setName('razon')
        .setDescription('La razón del ban.')
        .setRequired(false))
    .addAttachmentOption(option =>
      option.setName('evidencia')
        .setDescription('Adjunta una imagen como evidencia (opcional).')
        .setRequired(false))
    .setDefaultMemberPermissions(PermissionFlagsBits.BanMembers)
    .setDMPermission(false),
  async execute(interaction, client) {
    const user = interaction.options.getUser('usuario');
    const reason = interaction.options.getString('razon') || 'No se proporcionó una razón.';
    const evidence = interaction.options.getAttachment('evidencia');

    if (!interaction.guild.members.me.permissions.has(PermissionFlagsBits.BanMembers)) {
      return interaction.reply({
        content: 'No tengo permisos para banear usuarios.',
        flags: MessageFlags.Ephemeral,
      });
    }

    try {
      const dmEmbed = new EmbedBuilder()
        .setTitle('🔨 Has sido baneado')
        .setDescription(`Has sido baneado del servidor **${interaction.guild.name}**.`)
        .addFields(
          { name: 'Razón', value: reason },
          { name: 'Moderador', value: interaction.user.tag },
        )
        .setColor('#ff0000')
        .setTimestamp();

        if (evidence) {
            dmEmbed.setImage(evidence.url);
            dmEmbed.addFields({ name: 'Evidencia', value: `[Ver evidencia](${evidence.url})` });
          }

          dmEmbed.addFields({ name:"Si deseas apelar el ban, puedes hacerlo en el siguiente enlace:", value:"[Apelar]()"});

      await user.send({ embeds: [dmEmbed] });
    } catch (error) {
      console.error(`No se pudo enviar un mensaje privado a ${user.tag}:`, error);
    }

    try {
       await interaction.guild.members.ban(user, { reason });

      const banEmbed = new EmbedBuilder()
        .setTitle('✅ Usuario baneado')
        .setDescription(`El usuario **${user.tag}** ha sido baneado correctamente.`)
        .addFields(
          { name: 'Razón', value: reason },
          { name: 'Moderador', value: interaction.user.tag },
        )
        .setColor('#00ff00')
        .setTimestamp();

      await interaction.reply({ embeds: [banEmbed], flags: MessageFlags.Ephemeral });

      const logChannel = interaction.guild.channels.cache.get('1347641267642957855');
      if (logChannel) {
        const logEmbed = new EmbedBuilder()
          .setTitle('🔨 Usuario baneado')
          .setDescription(`El usuario **${user.tag}** ha sido baneado.`)
          .addFields(
            { name: 'Razón', value: reason },
            { name: 'Moderador', value: interaction.user.tag },
          )
          .setColor('#ff0000')
          .setTimestamp();

        if (evidence) {
          logEmbed.setImage(evidence.url);
          logEmbed.addFields({ name: 'Evidencia', value: `[Ver evidencia](${evidence.url})` });
        }

        await logChannel.send({ embeds: [logEmbed] });
      } else {
        console.error('No se encontró el canal de registros.');
      }
    } catch (error) {
      console.error(`Error al banear a ${user.tag}:`, error);

      const errorEmbed = new EmbedBuilder()
        .setTitle('❌ Error')
        .setDescription(`No se pudo banear a **${user.tag}**.`)
        .setColor('#ff0000')
        .setTimestamp();

      await interaction.reply({ embeds: [errorEmbed], flags: MessageFlags.Ephemeral });
    }
  },
};