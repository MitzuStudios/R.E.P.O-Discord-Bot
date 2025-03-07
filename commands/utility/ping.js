const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('ping')
    .setDescription('Muestra la latencia del bot y la latencia de la API de Discord.'),
  async execute(interaction, client) {

    const startTime = Date.now();

    await interaction.deferReply();

    const endTime = Date.now();

    const apiLatency = endTime - startTime;

    const wsPing = client.ws.ping;

    const pingEmbed = new EmbedBuilder()
      .setTitle('🏓 Pong!')
      .setDescription('Aquí tienes las estadísticas de latencia:')
      .addFields(
        { name: 'Latencia del bot', value: `${wsPing}ms`, inline: true },
        { name: 'Latencia de la API', value: `${apiLatency}ms`, inline: true },
      )
      .setColor('#0099ff')
      .setFooter({ text: `Solicitado por ${interaction.user.tag}`, iconURL: interaction.user.displayAvatarURL() })
      .setTimestamp();

    await interaction.editReply({ embeds: [pingEmbed] });
  },
};