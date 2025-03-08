const {
  SlashCommandBuilder,
  PermissionFlagsBits,
  EmbedBuilder,
  MessageFlags,
} = require("discord.js");
const { client_ID, guild_ID, TOKEN, channels } = require("../../config.json");
const parseDuration = require("../../lib/parseDuration");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("timeout")
    .setDescription("Suspende a un usuario temporalmente.")
    .addUserOption((option) =>
      option
        .setName("usuario")
        .setDescription("El usuario que deseas suspender.")
        .setRequired(true)
    )
    .addStringOption((option) =>
      option
        .setName("duracion")
        .setDescription("Elige la duración de la suspensión.")
        .setRequired(true)
        .addChoices(
          { name: "60 segundos", value: "60" },
          { name: "5 minutos", value: "300" },
          { name: "10 minutos", value: "600" },
          { name: "30 minutos", value: "1800" },
          { name: "1 hora", value: "3600" },
          { name: "2 horas", value: "7200" },
          { name: "1 día", value: "86400" },
          { name: "1 semana", value: "604800" }
        )
    )
    .addStringOption((option) =>
      option
        .setName("razon")
        .setDescription("La razón de la suspensión (opcional).")
        .setRequired(false)
    )
    .setDefaultMemberPermissions(PermissionFlagsBits.MuteMembers)
    .setDMPermission(false),

  async execute(interaction) {
    const user = interaction.options.getUser("usuario");
    const duration = interaction.options.getString("duracion");
    const parsedDuration = parseDuration(parseInt(duration));
    const reason =
      interaction.options.getString("razon") || "No se proporcionó una razón.";
    const notificationChannelId = channels.sanctions;

    const member = interaction.guild.members.cache.get(user.id);
    if (!member) {
      return interaction.reply({
        content: "El usuario no se encuentra en el servidor.",
        flags: MessageFlags.Ephemeral,
      });
    }
    if (
      member.roles.highest.position >= interaction.member.roles.highest.position
    ) {
      return interaction.reply({
        content:
          "No puedes suspender a un usuario con un rol igual o superior al tuyo.",
        flags: MessageFlags.Ephemeral,
      });
    }

    try {
      await member.timeout(duration * 1000, reason);

      const completionEmbed = new EmbedBuilder()
        .setTitle("✅ Usuario Suspendido")
        .setDescription(
          `El usuario **<@${user.id}>** ha sido suspendido por ${parsedDuration}.`
        )
        .setThumbnail(user.avatarURL())
        .addFields(
          { name: "Razón", value: reason },
          { name: "Duración", value: parsedDuration },
          { name: "Moderador", value: interaction.user.tag }
        )
        .setColor("Grey")
        .setTimestamp();

      await interaction.reply({
        embeds: [completionEmbed],
        flags: MessageFlags.Ephemeral,
      });

      // Enviar notificación a otro canal
      const notificationChannel = interaction.guild.channels.cache.get(
        notificationChannelId
      );
      if (notificationChannel) {
        await notificationChannel.send({
          embeds: [completionEmbed],
        });
      }
    } catch (error) {
      console.error(`Error al suspender a ${user.tag}:`, error);

      const errorEmbed = new EmbedBuilder()
        .setTitle("❌ Error")
        .setDescription(`No se pudo suspender a **${user.tag}**.`)
        .setColor("#ff0000")
        .setTimestamp();

      await interaction.reply({
        embeds: [errorEmbed],
        flags: MessageFlags.Ephemeral,
      });
    }
  },
};
