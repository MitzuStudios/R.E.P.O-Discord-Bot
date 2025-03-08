const {
    SlashCommandBuilder,
    EmbedBuilder,
    PermissionFlagsBits,
    MessageFlags,
  } = require("discord.js");
  const { addWarn, getWarns } = require("./../../database");
  const { channels } = require("../../config.json");
  
  module.exports = {
    data: new SlashCommandBuilder()
      .setName("warn")
      .setDescription("Advierte a un usuario por comportamiento inapropiado.")
      .addUserOption((option) =>
        option
          .setName("usuario")
          .setDescription("El usuario que deseas advertir.")
          .setRequired(true)
      )
      .addStringOption((option) =>
        option
          .setName("razon")
          .setDescription("La razón de la advertencia.")
          .setRequired(true)
      )
      .setDefaultMemberPermissions(PermissionFlagsBits.KickMembers),
    async execute(interaction) {
      const user = interaction.options.getUser("usuario");
      const reason = interaction.options.getString("razon");
  
      if (!interaction.member.permissions.has(PermissionFlagsBits.KickMembers)) {
        return interaction.reply({
          content: "No tienes permisos para advertir a usuarios.",
          flags: MessageFlags.Ephemeral,
        });
      }
  
      const member = interaction.guild.members.cache.get(user.id);
      if (!member) {
        return interaction.reply({
          content: "El usuario no se encuentra en el servidor.",
          flags: MessageFlags.Ephemeral,
        });
      }
  
      const warnId = addWarn(user.id, interaction.user.id, reason);
      const userWarns = getWarns(user.id);
  
      const warnEmbed = new EmbedBuilder()
        .setTitle("⚠️ Advertencia")
        .setDescription(`Se ha advertido a **${user.tag}**.`)
        .addFields(
          { name: "Razón", value: reason },
          { name: "Moderador", value: interaction.user.tag },
          { name: "ID de la advertencia", value: `\`${warnId}\`` },
          { name: "Advertencias totales", value: `**${userWarns.length}**` }
        )
        .setColor("#ffcc00")
        .setTimestamp();
  
      await interaction.reply({ embeds: [warnEmbed] });
  
      // Envía notificación al canal de sanciones
      const logChannel = interaction.guild.channels.cache.get(channels.sanctionChannel);
      if (logChannel) {
        await logChannel.send({ embeds: [warnEmbed] });
      }
  
      // Lógica de sanción según número de advertencias
      try {
        if (userWarns.length === 2) {
          await member.timeout(1800000, 'Acumulación de 2 advertencias.');  // 30 minutos
          notifyChannel(logChannel, user, '30 minutos de suspensión', 'Acumulación de 2 advertencias.');
        } else if (userWarns.length === 3) {
          await member.timeout(10800000, 'Acumulación de 3 advertencias.');  // 3 horas
          notifyChannel(logChannel, user, '3 horas de suspensión', 'Acumulación de 3 advertencias.');
        } else if (userWarns.length === 4) {
          await member.kick('Acumulación de 4 advertencias.');
          notifyChannel(logChannel, user, 'expulsión', 'Acumulación de 4 advertencias.');
        } else if (userWarns.length === 5) {
          await member.ban({ reason: 'Acumulación de 5 advertencias.' });
          notifyChannel(logChannel, user, 'baneo', 'Acumulación de 5 advertencias.');
        }
      } catch (error) {
        console.error("Error al aplicar sanción al usuario:", error);
        await interaction.followUp({
          content: "No se pudo aplicar la sanción adecuada. Por favor, contacta a un administrador.",
          flags: MessageFlags.Ephemeral,
        });
      }
    },
  };
  
  async function notifyChannel(channel, user, action, reason) {
    if (channel) {
      const embed = new EmbedBuilder()
        .setTitle(`🚨 Acción de sanción aplicada`)
        .setDescription(`**${user.tag}** ha sido ${action} debido a la ${reason}.`)
        .setColor("#ff0000")
        .setTimestamp();
      await channel.send({ embeds: [embed] });
    }
  }
  