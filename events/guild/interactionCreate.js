module.exports = (client, discord, interaction, infos) =>{
    //COMANDOS SLASH
    if(interaction.isCommand()){
        const command =  client.slash.get(interaction.commandName);
        try{
            command.run(client, interaction);
        }catch(error){
            console.log(`Error en la creacion de la interaccion`);
        }
    }else if(interaction.isButton()){
        switch(interaction.customId){
            case 'restop':
                let peliculas = client.peliculas;
                return interaction.reply({content:`${peliculas}`});
            break

            case 'restos':
                let series = client.series;
                return interaction.reply({content: `${series}`});
            break
        }

    }
}