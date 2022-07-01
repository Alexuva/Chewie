const { request } = require ('undici');
const { MessageEmbed, MessageAttachment, MessageButton, MessageActionRow } = require ('discord.js');

const MDKEY = (process.env.MD);
const urlMD = "https://api.themoviedb.org/3/";

module.exports = {
    name: "buscarpelicula",
    description: "Busca una película y su información",
    options: [
        {
            name: "titulo", 
            description: "Indica el titulo de la pelicula", 
            type: "STRING",
            required: true,
            ephemeral: false
        }

    ],
    
    run: async(client, interaction) => {

        const titulo = await interaction.options.getString('titulo');
        const tituloProcesado = titulo.replace(" ","+");

        //REQUEST DEL TITULO Y LA CLAVE DE ERROR
        async function requestHandler(url, key, titulo){
            try{
                const { statusCode, body } = await request(`${url}search/movie?api_key=${key}&language=es-ES&query=${titulo}`)
                const resultado = [statusCode, body];
                return resultado;
            }
            catch(e){
                console.log(e);
            }
        };

        //REQUEST DE LOS WATCH PROVIDERS
        async function watchHandler(url, key, id){
            try{
                const { body } = await request(`${url}movie/${id}/watch/providers?api_key=${key}&language=es-ES`)
                const { results } = await body.json();
                const { ES } = results;
                return ES;
            }
            catch(e){
                console.log(e);
            }
        };

        //COMPROBAR CLAVE DE ERROR
        async function errorHandler(resultado){
            let errorMessage;
            let clave = resultado[0];
            if(clave !== 200){
      
                async function getErrorType(clave){
                    let error;
                    switch(clave){
                        case 404:
                            return error = 'Error 404: no se han encontrado resultados'
                        break;
    
                        case 401:
                            return error = 'Error 401: Api key incorrecta'
                    }
                    return error;
                }

                const errorType = await getErrorType(clave);

                errorMessage = interaction.reply(
                    {
                        content: `${errorType}`
                    }
                )

                return errorMessage;
            }

            return errorMessage;
        };

        //DESESTRUCTURAR RESULTADO DE LA CONSULTA (PELI)
        async function resultHandler(resultado){
            let info = resultado[1];
            let infoJSON = await info.json()
            
            let pelicula;
            if(infoJSON.results.length > 0){
                const { 
                    id,
                    title, 
                    release_date, 
                    overview,
                    poster_path
                } = infoJSON.results[0];

                const resultado = await watchHandler(urlMD, MDKEY, id);

                if(resultado){
                    const { link, flatrate } = resultado;
                    return pelicula = {"link":link, "flatrate":flatrate, "title":title, "release_date":release_date, "overview":overview, "poster_path":poster_path};
                }else{
                    return pelicula = {"title":title, "release_date":release_date, "overview":overview, "poster_path":poster_path};
                }

            }else if(infoJSON.results.length <= 0){
               return pelicula = "No se han obtenido resultados"
            };
            
            return pelicula;

        }

        //GUARDAR EL RESTO DE RESULTADOS
        async function resultadosHandler(resultado){
            let info = resultado[1];
            let infoJSON = await info.json()
          
            let peliculas='';
            if(infoJSON.results.length > 0){
                 infoJSON.results.forEach((element, index) => {
                    return peliculas += `*${index+1}.* ***${element.title}***\n`;
                 });

             }else if(infoJSON.results.length <= 0){
                 return peliculas = "No se han obtenido resultados"
            }

            return peliculas;
        }

        //IMPRIMIR RESULTADO DE PELICULA
        async function mensaje(pelicula){
            if(typeof (pelicula) === 'string' ){
                return interaction.reply(
                    {
                        content: `*${pelicula}*`
                    }
                );
            }else{
                const{ 
                    link,
                    flatrate,
                    title,
                    release_date,
                    overview,
                    poster_path
                } = pelicula;

                const img = `http://image.tmdb.org/t/p/w342${poster_path}`;
    
                if(link != undefined && flatrate != undefined){
                    // const { provider_name } = flatrate;

                    function getProviders(flatrate){
                        let providers = '';
                        flatrate.forEach((provider) =>{ providers += `${provider.provider_name}\n`});
                        return providers;
                    }
                    
                    let providers = getProviders(flatrate);

                    const btnLink = new MessageButton()
                        .setLabel(`Ver online`)
                        .setURL(link)
                        .setStyle("LINK")
                    
                    const btnRest = new MessageButton()
                        .setCustomId('restop')
                        .setLabel(`Ver resto Resultados`)
                        .setStyle("PRIMARY")
                    
                    const fila = new MessageActionRow().addComponents(btnLink, btnRest);

                    const mensaje = new MessageEmbed()
                        .setTitle(`**${title}**`)
                        .setImage(img)
                        .setDescription(`*${overview}*`)
                        .setFields(
                            {name: "Estreno: ", value: `${release_date}`, inline:true},
                            {
                                name: "Streaming: ", 
                                value: providers,
                                inline: true
                            }
                        )
                        .setFooter({text: "Powered By JustWatch", iconURL: 'https://www.justwatch.com/blog/images/icon.png'})
                        .setColor("#7807CB")

                    return await interaction.reply({ embeds: [mensaje], file:[img], components:[fila] });

                }else{

                    const btnRest = new MessageButton()
                        .setCustomId('restop')
                        .setLabel(`Ver resto Resultados`)
                        .setStyle("PRIMARY");

                    const fila = new MessageActionRow().addComponents(btnRest);

                    const mensaje = new MessageEmbed()
                    .setTitle(`***${title}***`)
                    .setImage(img)
                    .setDescription(`*${overview}*`)
                    .setFields(
                        {name: "Estreno: ", value: `${release_date}`, inline:true},
                        {name: "Streaming: ", value: "No disponible en España", inline: true}
                    )
                    .setFooter({text: "Powered By JustWatch", iconURL: 'https://www.justwatch.com/blog/images/icon.png'})
                    .setColor("#7807CB")

                return await interaction.reply({ embeds: [mensaje], file:[img], components: [fila]});
                }
            };
            
        }

//-----------------------------------------------------------------------------------//

        //Hacemos la request simple
        const resultado = await requestHandler(urlMD, MDKEY, tituloProcesado);
        //Hacemos la request del resto de resultados
        const resultados = await requestHandler(urlMD, MDKEY, tituloProcesado);
        //Comprobamos errores
        if(resultado[0] == 200){
            //Guardamos la info
            const info = await resultHandler(resultado);
            const infos = await resultadosHandler(resultados);
            client.peliculas = infos;
            //Imprimimos la info
            await mensaje(info);
        }else{
            await errorHandler(resultado);
        }
    },

}