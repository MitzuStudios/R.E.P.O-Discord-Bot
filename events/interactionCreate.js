const { Events, EmbedBuilder, MessageFlags, PermissionFlagsBits } = require('discord.js');

const failedInteraction = new EmbedBuilder()
  .setAuthor({ name: '❌ Error' })
  .setDescription('Hubo un error al ejecutar este comando. Por favor, inténtalo de nuevo más tarde.')
  .setColor('Red');

module.exports = {
  name: Events.InteractionCreate,
  async execute(interaction, client) {
    if (interaction.isChatInputCommand()) {
      const command = interaction.client.commands.get(interaction.commandName);

      if (!command) {
        console.error(`No se encontró ningún comando que coincida con ${interaction.commandName}.`);
        return;
      }

      try {
        await command.execute(interaction, client);
      } catch (error) {
        console.error(error);

        if (interaction.replied || interaction.deferred) {
          await interaction.followUp({ embeds: [failedInteraction], flags: MessageFlags.Ephemeral });
        } else {
          await interaction.reply({ embeds: [failedInteraction], flags: MessageFlags.Ephemeral });
        }
      }
    }

    if (interaction.isButton()) {
      if (interaction.customId === 'close_ticket') {
        if (!interaction.channel.name.startsWith('asistencia-')) {
          return interaction.reply({
            content: 'Este comando solo puede usarse en canales de asistencia.',
            flags: MessageFlags.Ephemeral,
          });
        }

        try {
          await interaction.channel.delete();
        } catch (error) {
          console.error('Error al eliminar el canal de tickets:', error);
          await interaction.reply({
            content: 'Hubo un error al cerrar el ticket. Por favor, contacta a un moderador.',
            flags: MessageFlags.Ephemeral,
          });
        }
      }
    }
  },
};