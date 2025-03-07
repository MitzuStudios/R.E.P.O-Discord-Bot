const { SlashCommandBuilder, PermissionFlagsBits, ChannelType, ActionRowBuilder, ButtonBuilder, ButtonStyle, EmbedBuilder, MessageFlags } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('asistencia')
    .setDescription('Abre un canal de asistencia.')
    .addUserOption(option =>
      option.setName('usuario')
        .setDescription('El usuario al que deseas crearle un canal (solo para moderadores).')
        .setRequired(false)),
  async execute(interaction, client) {
    const guild = interaction.guild;
    const user = interaction.user;
    const targetUser = interaction.options.getUser('usuario');

    const isModerator = interaction.member.roles.cache.some(role =>
      role.id === '1291971011981611152' || role.id === '1291969663122538517'
    );

    const ticketUser = isModerator && targetUser ? targetUser : user;

    const categoryId = '1347402321470165093';

    const channelName = `asistencia-${ticketUser.username}`;

    const ticketChannel = await guild.channels.create({
      name: channelName,
      type: ChannelType.GuildText,
      parent: categoryId,
      permissionOverwrites: [
        {
          id: guild.id,
          deny: [PermissionFlagsBits.ViewChannel],
        },
        {
          id: ticketUser.id,
          allow: [PermissionFlagsBits.ViewChannel, PermissionFlagsBits.SendMessages],
        },
        {
          id: client.user.id,
          allow: [PermissionFlagsBits.ViewChannel, PermissionFlagsBits.SendMessages],
        },
      ],
    });

    const ticketEmbed = new EmbedBuilder()
      .setTitle('🎟️ Ticket de asistencia')
      .setDescription(`Hola ${ticketUser}, este es tu ticket de asistencia. Por favor, proporciona toda la información y evidencia necesaria.`)
      .setColor('#0099ff')
      .setTimestamp();

    const closeButton = new ButtonBuilder()
      .setCustomId('close_ticket')
      .setLabel('Cerrar canal')
      .setStyle(ButtonStyle.Danger);

    const row = new ActionRowBuilder().addComponents(closeButton);

    await ticketChannel.send({
      content: `${ticketUser}, los moderadores contactaran contigo pronto.`,
      embeds: [ticketEmbed],
      components: [row],
    });

    await interaction.reply({
      content: `Se ha creado el canal: ${ticketChannel}`,
      flags: MessageFlags.Ephemeral,
    });
  },
};
