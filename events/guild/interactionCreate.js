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
        if(interaction.customId === 'resto'){
            let peliculas = client.peliculas;
            return interaction.reply({content:`${peliculas}`});
        }
    }
}