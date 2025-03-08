    const { SlashCommandBuilder, EmbedBuilder, PermissionFlagsBits, MessageFlags } = require('discord.js');
    const { addWarn, getWarns } = require('./../../database');

    module.exports = {
    data: new SlashCommandBuilder()
        .setName('warn')
        .setDescription('Advierte a un usuario por comportamiento inapropiado.')
        .addUserOption(option =>
        option.setName('usuario')
            .setDescription('El usuario que deseas advertir.')
            .setRequired(true))
        .addStringOption(option =>
        option.setName('razon')
            .setDescription('La razón de la advertencia.')
            .setRequired(true))
        .setDefaultMemberPermissions(PermissionFlagsBits.KickMembers),
    async execute(interaction, client) {
        const user = interaction.options.getUser('usuario');
        const reason = interaction.options.getString('razon');

        if (!interaction.member.permissions.has(PermissionFlagsBits.KickMembers)) {
        return interaction.reply({
            content: 'No tienes permisos para advertir a usuarios.',
            flags: MessageFlags.Ephemeral,
        });
        }

        const warnId = addWarn(user.id, interaction.user.id, reason);

        const userWarns = getWarns(user.id);

        const warnEmbed = new EmbedBuilder()
        .setTitle('⚠️ Advertencia')
        .setDescription(`Se ha advertido a **${user.tag}**.`)
        .addFields(
            { name: 'Razón', value: reason },
            { name: 'Moderador', value: interaction.user.tag },
            { name: 'ID de la advertencia', value: `\`${warnId}\`` },
            { name: 'Advertencias totales', value: `**${userWarns.length}**` },
        )
        .setColor('#ffcc00')
        .setTimestamp();

        await interaction.reply({ embeds: [warnEmbed] });

        if (userWarns.length >= 3) {
        const member = interaction.guild.members.cache.get(user.id);
        if (member) {
            try {
            await member.kick('Demasiadas advertencias.');
            await interaction.followUp({
                content: `**${user.tag}** ha sido expulsado por acumular demasiadas advertencias.`,
                flags: MessageFlags.Ephemeral,
            });
            } catch (error) {
            console.error('Error al expulsar al usuario:', error);
            await interaction.followUp({
                content: 'No se pudo expulsar al usuario. Por favor, contacta a un administrador.',
                flags: MessageFlags.Ephemeral,  
            });
            }
        }
        }
    },
    };