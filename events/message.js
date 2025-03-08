const { Events, EmbedBuilder } = require("discord.js");

module.exports = {
  name: Events.MessageCreate,
  on: true,
  async execute(message) {
    if (message.author.bot) {
      return;
    }

    if (message.content === "<@1341927174936072323>") {
      const prefixEmbed = new EmbedBuilder()
        .setAuthor({ name: "📋 | ¿Necesitas ayuda?" })
        .setDescription(
          `Si necesitas asistencia de parte de un moderador o administrador, puedes usar el comando \`/asistencia\` para abrir un canal de asistencia.`
        )
        .setColor("Blue");
      message.channel.send({ embeds: [prefixEmbed] });
    }
  },
};
