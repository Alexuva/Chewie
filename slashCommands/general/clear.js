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

        canal.bulkDelete(cantidad, true);

        interaction.reply( {content: "Borrando mensajes...", ephemeral: false} );
    }
};
