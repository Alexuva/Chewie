module.exports = {
    name: "mencion",
    description: "Menciona a alguien",
    options: [
        {
        name: "usuario", 
        description: "usuario a mencionar", 
        type: "USER"
        }
    ],

    run: async(client, interaction) => {
        try{
            interaction.reply( {content: "Usuario mencionado", ephemeral: false} );
        }catch(error){
            console.log("Error en el archivo de commando " + error);
        }
    }
}