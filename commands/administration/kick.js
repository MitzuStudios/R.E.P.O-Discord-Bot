const { SlashCommandBuilder, PermissionFlagsBits, EmbedBuilder, MessageFlags } = require('discord.js');
const { channels } = require('../../config.json'); // Asegúrate de tener un objeto channels en tu config con sanctionChannel definido.

module.exports = {
  data: new SlashCommandBuilder()
    .setName('kick')
    .setDescription('Expulsa a un usuario del servidor.')
    .addUserOption(option =>
      option.setName('usuario')
        .setDescription('El usuario que deseas expulsar.')
        .setRequired(true))
    .addStringOption(option =>
      option.setName('razon')
        .setDescription('La razón de la expulsión (opcional).')
        .setRequired(false))
    .setDefaultMemberPermissions(PermissionFlagsBits.KickMembers)
    .setDMPermission(false),
  async execute(interaction, client) {
    const user = interaction.options.getUser('usuario');
    const reason = interaction.options.getString('razon') || 'No se proporcionó una razón.';

    if (!interaction.guild.members.me.permissions.has(PermissionFlagsBits.KickMembers)) {
      return interaction.reply({
        content: 'No tengo permisos para expulsar usuarios.',
        flags: MessageFlags.Ephemeral,
      });
    }

    const member = interaction.guild.members.cache.get(user.id);
    if (member && member.roles.highest.position >= interaction.member.roles.highest.position) {
      return interaction.reply({
        content: 'No puedes expulsar a un usuario con un rol igual o superior al tuyo.',
        flags: MessageFlags.Ephemeral,
      });
    }

    try {
      await member.kick(reason);

      const kickEmbed = new EmbedBuilder()
        .setTitle('✅ Usuario expulsado')
        .setDescription(`El usuario **${user.tag}** ha sido expulsado correctamente.`)
        .addFields(
          { name: 'Razón', value: reason },
          { name: 'Moderador', value: interaction.user.tag },
        )
        .setColor('#00ff00')
        .setTimestamp();

      await interaction.reply({ embeds: [kickEmbed], flags: MessageFlags.Ephemeral });

      // Enviar notificación a otro canal
      const logChannel = interaction.guild.channels.cache.get(channels.sanctionChannel);
      if (logChannel) {
        await logChannel.send({ embeds: [kickEmbed] });
      } else {
        console.error('No se encontró el canal de registros.');
      }
    } catch (error) {
      console.error(`Error al expulsar a ${user.tag}:`, error);

      const errorEmbed = new EmbedBuilder()
        .setTitle('❌ Error')
        .setDescription(`No se pudo expulsar a **${user.tag}**.`)
        .setColor('#ff0000')
        .setTimestamp();

      await interaction.reply({ embeds: [errorEmbed], flags: MessageFlags.Ephemeral });
    }
  },
};
