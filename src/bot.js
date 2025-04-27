require('dotenv').config();
const { Client, Events, GatewayIntentBits, blockQuote} = require('discord.js');
const { EmbedBuilder } = require('discord.js');

const client = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages] });

let announcementChannel = null
let logChannel = null

client.once(Events.ClientReady, readyClient => {
    announcementChannel = client.channels.cache.get(process.env.ANNOUNCEMENT_CHANNEL_ID)
    logBot('Logged in')
});

async function announceBot(data) {
    if(!announcementChannel) {
        console.log('No announcement channel set')
        return;
    }

    for (const d of data) {
        const embed = new EmbedBuilder()
            .setColor(0xFF0000)
            .setTitle(`${d.brojNaOglas}`)
            .setDescription(d.predmetNaDogovor)
            .addFields(
                { name: 'Договорен орган', value: d.dogovorenOrgan },
                { name: 'Носител на набавката', value: d.nositelNaNabavka },
                { name: 'Вид на договор', value: d.vidNaDogovor, inline: true },
                { name: 'Вид на постапка', value: d.vidNaPostapka, inline: true },
                { name: 'Вредност на склучениот договор со вклучен ДДВ', value: `${d.vrednostSklucenDogovor} ден.` },
                { name: 'Вредност на реализиран договор со ДДВ', value: `${d.vrednostRealiziranDogovor} ден.` },
                { name: 'Вредност на реализиран исплатен договор со ДДВ', value: `${d.vrednostRealiziranIsplatenDogovor} ден.` },
            )
            .setFooter({ text: `Датум на објава: ${d.datumNaObjava}` })

        await announcementChannel.send({ embeds: [embed] })
    }
}

async function logBot(data) {
    logChannel = client.channels.cache.get(process.env.LOG_CHANNEL_ID)

    if(!logChannel){
        console.log('No log channel set')
    }

    console.log(data)
    await logChannel.send(blockQuote(data))
}

async function loginBot() {
    await client.login(process.env.BOT_TOKEN)
}

module.exports = { announceBot, loginBot, logBot };