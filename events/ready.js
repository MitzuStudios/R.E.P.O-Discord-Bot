const { Events } = require('discord.js');
require("../deploy-commands.js");

const statusMessages = [
    "¡Bienvenidos a R.E.P.O LATAM | Español!",
    "Administrando la comunidad...",
    "Somos la mejor comunidad",
    "¡Gracias por estar aquí!",
    "R.E.P.O"
];

let currentIndex = 0;

module.exports = {
	name: Events.ClientReady,
	once: true,
	execute(client) {
        console.log(`Agente ${client.user.username} esta listo para cumplir su misión.`)
            setInterval(() => {
                client.user.setPresence({
                activities: [{ name: statusMessages[currentIndex] }],
                status: 'online'
                });

        currentIndex = (currentIndex + 1) % statusMessages.length;
	})
}
};