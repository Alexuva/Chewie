const play = require("play-dl");
const {
    createAudioPlayer, 
    createAudioResource, 
    joinVoiceChannel
} = require("@discordjs/voice");

module.exports = {
    name: "play",
    description: "Reproduce la canción indicada",
    options: [
        {
            name: "cancion",
            description: "Cancion / Autor / Cancion & Autor",
            type: "STRING",
            required: true,

        }
    ],
    run: async(client, interaction) => {
        const vc = interaction.member.voice.channel;
        if(!vc){
            return interaction.reply(
                {
                    content: "Tienes que estar en un canal de voz",
                    ephemeral: true
                }
            )
        };

        const videoAreproducir = await play.search(interaction.options.getString("cancion"));
        const info = await play.video_basic_info(videoAreproducir[0].url);

        const info_video = info.video_details;

        if(!videoAreproducir){
            interaction.reply(
                {
                    content: "No se han encontrado resultados",
                    ephemeral: true
                }
            );
        }

        const stream = await play.stream(videoAreproducir[0].url);

        const conection = joinVoiceChannel(
            {
                channelId: vc.id,
                guildId: interaction.guildId,
                adapterCreator: interaction.guild.voiceAdapterCreator
            }
        );

        const resource = createAudioResource(stream.stream, { inputType: stream.type });

        

        
        

        const player = createAudioPlayer();

        player.play(resource);
        conection.subscribe(player);

        console.log(`---------------------- \n ${info_video}`);


        interaction.reply(
            {
                content: `Reproduciendo: ${videoAreproducir.title}`
            }
        );

    }
};