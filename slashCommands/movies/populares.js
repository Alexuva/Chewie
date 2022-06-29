const { request } = require ('undici');

const MDKEY = (process.env.MD);
const urlMD = "https://api.themoviedb.org/3/";

module.exports = {
    name: "populares",
    description: "Muestra las 20 películas o series más populares ahora mismo",
    options: [
        {
            name: "tipo", 
            description: "indica si quieres encontrar pelicula o serie", 
            type: "STRING",
            required: true,
            ephemeral: false
        }

    ],

    run: async(client, interaction) => {

        const tipo = await interaction.options.getString('tipo');

        //MANEJAR EL TIPO DE MEDIO
        async function getType(tipo){
            try{
                if(tipo){
                    switch(tipo){
                        case 'pelicula':
                            return tipo = "movie";
                        break;

                        case 'peliculas':
                            return tipo = "movie";
                        break;

                        case 'película':
                            return tipo = "movie";
                        break;

                        case 'películas':
                            return tipo = "movie";
                        break;

                        case 'pelis':
                            return tipo = "movie";
                        break;

                        case 'serie':
                            return tipo = "tv";
                        break;

                        case 'series':
                            return tipo = "tv";
                        break;

                        default:
                            return tipo = "movie";
                        break;
                    }

                    return tipo;
                }
            }
            catch(e){
                console.log(e);
            }
        }

        //REQUEST A TMDB
        async function requestHandler(tipo, url, key){
            try{
                const { statusCode, body } = await request(`${url}${tipo}/popular?api_key=${key}&language=es&page=1`)
                const resultado = [statusCode, body];
                return resultado;
            }
            catch(e){
                console.log(e);
            }
        }

        //MANEJADOR DE ERRORES
        async function errorHandler(arg){
            let errorMessage;
            if(arg !== 200){
                async function getErrorType(arg){
                    let error;
                    switch(arg){
                        case 404:
                            return error = 'Error 404: no se han encontrado resultados'
                        break;
    
                        case 401:
                            return error = 'Error 401: Api key incorrecta'
                    }
                    return error;
                }

                const errorType = await getErrorType(arg);

                errorMessage = interaction.reply(
                    {
                        content: `${errorType}`
                    }
                )

                return errorMessage;     
            }

            return errorMessage;
        };

        //IMPRIMIR TITULOS
        function getTitles(medio, populares){
            let title= "";
            if(medio === 'movie'){
                populares.results.forEach((element, index) => {
                    title += `*Top ${index+1}.* ***${element.title}***\n`
                });
            }else if( medio === 'tv'){
                populares.results.forEach((element, index) => {
                    title += `*Top ${index+1}.* ***${element.name}***\n`
                });
            }

            return title;

        }

        //Obtenemos el tipo de medio
        const medio = await getType(tipo);

        //Hacemos la peticion según el tipo de medio
        const respuesta = await requestHandler(medio, urlMD, MDKEY);

        //Guardamos las claves en una variable
        const { 0:clave, 1:resultados } = respuesta;

        //Manejamos los error si hubiese
        errorHandler(clave);

        //Manejamos los resultados de la consulta
        const populares = await resultados.json();
        const titles = await getTitles(medio, populares);

        interaction.reply(
            {
                content: `${titles}`,
                ephemeral: false
            }
        )

    }

};