const { Client, Intents } = require('discord.js');

module.exports = {
    name: "clear",
    description: "Borra una cierta cantidad de mensajes",
    options: [
        {
            name: "cantidad",
            description: "numero de mensajes que quieres borrar",
            type: "NUMBER",
            required: true
        }
    ],
    run: async (client, interaction)=>{
        const cantidad = interaction.options.getNumber("cantidad");
        const canal = interaction.channel;
        const messages = canal.messages.fetch();
        const { _roles } = interaction.member;
        if( (_roles.includes("694242747481325659")) || (_roles.includes("694242801180999680")) ){
            canal.bulkDelete(cantidad, true);
            interaction.reply( {content: "Borrando mensajes...", ephemeral: false} );
        }else{
            interaction.reply( {content: "No tienes los permisos suficientes", ephemeral: false} );
        }
    }
};
