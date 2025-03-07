const { SlashCommandBuilder, EmbedBuilder, MessageFlags } = require('discord.js');
const { exec } = require('child_process');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('reiniciar')
    .setDescription('Reinicia el bot.')
    .setDefaultMemberPermissions(0)
    .setDMPermission(false),
  async execute(interaction, client) {
    if (interaction.user.id !== '980239390213292053' && interaction.user.id !== '557027841905000451' && interaction.user.id !== '473624881188306945' && interaction.user.id !== '524763523461677097') {
      return interaction.reply({
        content: 'No tienes permisos para usar este comando.',
        flags: MessageFlags.Ephemeral,
      });
    }

    const restartEmbed = new EmbedBuilder()
      .setTitle('🔄 Reiniciando el bot...')
      .setDescription('El bot se está reiniciando. Esto puede tomar unos segundos.')
      .setColor('#ffff00')
      .setTimestamp();

    await interaction.reply({ embeds: [restartEmbed], flags: MessageFlags.Ephemeral });

    exec('pm2 restart REPOBOT', (error, stdout, stderr) => {
      if (error) {
        console.error(`Error al reiniciar el bot: ${error.message}`);
        return;
      }
      if (stderr) {
        console.error(`Error en stderr: ${stderr}`);
        return;
      }
      console.log(`Reinicio exitoso: ${stdout}`);
    });
  },
};