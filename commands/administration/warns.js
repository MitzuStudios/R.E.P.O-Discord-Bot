const { SlashCommandBuilder, EmbedBuilder, MessageFlags } = require('discord.js');
const { getWarns } = require('./../../database');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('warns')
    .setDescription('Muestra las advertencias de un usuario.')
    .addUserOption(option =>
      option.setName('usuario')
        .setDescription('El usuario del que deseas ver las advertencias.')
        .setRequired(false)),
  async execute(interaction, client) {
    const targetUser = interaction.options.getUser('usuario') || interaction.user;

    const userWarns = getWarns(targetUser.id);

    const warnsEmbed = new EmbedBuilder()
      .setTitle(`⚠️ Advertencias de ${targetUser.username}`)
      .setTimestamp();

    if (userWarns.length === 0) {
      warnsEmbed.setDescription('Este usuario no tiene advertencias.');
      warnsEmbed.setColor('Green');
    } else {
      warnsEmbed.setDescription(`**Total de advertencias:** ${userWarns.length}`);
      warnsEmbed.setColor('Yellow');
      userWarns.forEach((warn, index) => {
        warnsEmbed.addFields(
          { 
            name: `Advertencia #${index + 1} (ID: ${warn.id})`, 
            value: `**Razón:** ${warn.reason}\n**Moderador:** <@${warn.moderatorId}>\n**Fecha:** <t:${Math.floor(warn.timestamp / 1000)}:f>` 
          },
        );
      });
    }

    await interaction.reply({ embeds: [warnsEmbed], flags: MessageFlags.Ephemeral });
  },
};