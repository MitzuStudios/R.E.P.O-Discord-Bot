const { SlashCommandBuilder, EmbedBuilder, PermissionFlagsBits, MessageFlags } = require('discord.js');
const { getWarns, removeWarn } = require('./../../database');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('removewarn')
    .setDescription('Elimina una advertencia específica de un usuario.')
    .addUserOption(option =>
      option.setName('usuario')
        .setDescription('El usuario del que deseas eliminar una advertencia.')
        .setRequired(true))
    .addIntegerOption(option =>
      option.setName('id')
        .setDescription('El ID de la advertencia que deseas eliminar.')
        .setRequired(true))
    .setDefaultMemberPermissions(PermissionFlagsBits.KickMembers),
  async execute(interaction, client) {
    const user = interaction.options.getUser('usuario');
    const warnId = interaction.options.getInteger('id');

    if (!interaction.member.permissions.has(PermissionFlagsBits.KickMembers)) {
      return interaction.reply({
        content: 'No tienes permisos para eliminar advertencias.',
        flags: MessageFlags.Ephemeral,
      });
    }

    const userWarns = getWarns(user.id);

    const warnToRemove = userWarns.find(warn => warn.id === warnId);
    if (!warnToRemove) {
      return interaction.reply({
        content: `No se encontró una advertencia con el ID **${warnId}** para el usuario **${user.tag}**.`,
        flags: MessageFlags.Ephemeral,
      });
    }

    removeWarn(warnId);

    const successEmbed = new EmbedBuilder()
      .setTitle('✅ Advertencia eliminada')
      .setDescription(`Se ha eliminado la advertencia con ID **${warnId}** de **${user.tag}**.`)
      .addFields(
        { name: 'Razón original', value: warnToRemove.reason },
        { name: 'Moderador original', value: `<@${warnToRemove.moderatorId}>` },
        { name: 'Fecha', value: `<t:${Math.floor(warnToRemove.timestamp / 1000)}:f>` },
      )
      .setColor('#00ff00')
      .setTimestamp();

    await interaction.reply({ embeds: [successEmbed], flags: MessageFlags.Ephemeral });
  },
};