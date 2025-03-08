const { Events, EmbedBuilder } = require("discord.js");

module.exports = {
  name: Events.GuildMemberUpdate,
  once: false,
  async execute(oldMember, newMember) {
    console.log(
      `Evento GuildMemberUpdate detectado para ${oldMember.user.tag}`
    );

        const boosterRole = newMember.guild.roles.cache.find(role => role.name === 'Nitro Booster');
    
        if (!boosterRole) {
          console.error('No se encontró el rol de Nitro Booster en el servidor.');
          return;
        }
    
        if (!oldMember.roles.cache.has(boosterRole.id) && newMember.roles.cache.has(boosterRole.id)) {
          console.log(`${newMember.user.tag} ha obtenido el rol de Nitro Booster.`);
    
          const boostEmbed = new EmbedBuilder()
            .setTitle('🎉 ¡Gracias por boostear el servidor! 🎉')
            .setDescription('¡Tu apoyo significa mucho para nosotros! Aquí tienes algunos beneficios que obtienes por boostear el servidor:')
            .addFields(
              { name: '🌟 Beneficios', value: '- Acceso a canales exclusivos.\n- 20% Descuento en [Zeew Space](https://zeew.space).\n- 20% Descuento en [Neenbyss](https://neenbyss.com) para los siguientes servicios:\n\n - Diseño UX/UI \n ➜ Páginas web sencillas (landings pages) \n ➜ Diseños para scrips y rediseños de FiveM \n\n - En Desarrollo:\n ➜ Landings Page\n ➜ Gestores Simples (Dashboards)\n ➜ Bots de Discord \n\n- Prioridad en soporte.' },
              { name: '📅 Duración', value: 'Tus beneficios estarán activos mientras sigas boosteando el servidor.' },
              { name: '💬 ¿Preguntas?', value: 'Si tienes alguna duda, no dudes en contactar a un moderador.' },
            )
            .setColor('#ff73fa')
            .setThumbnail(newMember.guild.iconURL())
            .setFooter({ text: '¡Gracias por ser parte de nuestra comunidad!' });
    
          try {
            await newMember.send({ embeds: [boostEmbed] });
            console.log(`Mensaje privado enviado a ${newMember.user.tag}.`);
          } catch (error) {
            console.error(`No se pudo enviar un mensaje privado a ${newMember.user.tag}:`, error);
          }
    
          const logChannel = newMember.guild.channels.cache.get('1347641267642957855');
          if (logChannel) {
            const thanksEmbed = new EmbedBuilder()
              .setTitle(`🎉 ¡Gracias por boostear el servidor, ${newMember.user.username}! 🎉`)
              .setDescription('¡Tu apoyo significa mucho para nosotros!\nRevisa tus mensajes privados para obtener más información sobre los beneficios que obtienes por boostear el servidor.')
              .setColor('#ff73fa')
              .setThumbnail(newMember.user.displayAvatarURL())
              .setFooter({ text: '¡Gracias por ser parte de nuestra comunidad!' });
    
            try {
              await logChannel.send({ embeds: [thanksEmbed] });
              console.log(`Mensaje de agradecimiento enviado al canal de registros para ${newMember.user.tag}.`);
            } catch (error) {
              console.error('No se pudo enviar el mensaje al canal de registros:', error);
            }
          } else {
            console.error('No se encontró el canal de registros.');
          }
        }
      },
    };