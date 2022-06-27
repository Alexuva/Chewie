const fs = require('fs');
let slash = [];

module.exports = (client, discord) =>{
    
    fs.readdirSync("./slashCommands/").forEach((dir) => { 
        const commands = fs
            .readdirSync(`./slashCommands/${dir}/`)
            .filter(file => file.endsWith(".js"));

        for (const file of commands){
            try{
                let scmd = require(`../slashCommands/${dir}/${file}`);
                
                if(scmd.name){
                    client.slash.set(scmd.name, scmd);
                    slash.push(scmd);
                    console.log(`Commando: ${scmd.name} cargado`);
                }else{
                    console.log(`Error, no se encuentra nombre en el commando ${file}`);
                };

            }catch(error){
                console.log(`Error al cargar el archivo: ${file}`);
            };
        };
    });

    client.on("ready", async() =>{
        await client.application.commands.set(slash);
    });
};