import { Client, ButtonBuilder, ButtonStyle, ActionRowBuilder } from "discord.js";
import "dotenv/config"

const BOT_TOKEN = process.env.BOT_TOKEN
const BAN_EGOR_CHANNEL = String(process.env.BAN_EGOR_CHANNEL)
const EGOR_ID = String(process.env.EGOR_ID)

async function main() {
    try {
        const client = new Client({
            intents: [
                "GuildMessages",
                "Guilds",
            ]
        })
        
        client.on('ready', async () => {
            const channel = client.channels.cache.get(BAN_EGOR_CHANNEL)
    
            if (channel?.isSendable()) {
                const confirm = new ButtonBuilder()
                    .setCustomId('confirm')
                    .setLabel('Замутить')
                    .setStyle(ButtonStyle.Primary)
                    .setEmoji("🔨")
    
                const cancel = new ButtonBuilder()
                    .setCustomId('cancel')
                    .setLabel('Вернуть из мута')
                    .setStyle(ButtonStyle.Danger)
                    .setEmoji("🧑‍🦽‍➡️")
    
                
                const row = new ActionRowBuilder<ButtonBuilder>()
                    .setComponents(cancel, confirm)
    
                await channel.send({
                    content: "Мутим Егора Лобачёва?",
                    components: [row],
                })
            }
    
            if (client.user) {
                console.log(`Logged in as ${client.user.tag}!`);
            } else {
                console.log("Что-то пошло не так")
            }
           });
        
        client.on("interactionCreate", async (interaction) => {
            try {
                if (!interaction.isButton()) return;
                if (interaction.user.id === EGOR_ID) {
                    return;
                }
                if (interaction.customId === "confirm") {
                    await interaction.guild?.members.edit(EGOR_ID, {
                        mute: true
                    })
                    await interaction.update({ withResponse: false })
                } else if (interaction.customId === "cancel") {
                    await interaction.guild?.members.edit(EGOR_ID, {
                        mute: false,
                    })
                    await interaction.update({ withResponse: false })
                }
            } catch (err) {
                console.log(err)
                console.log("...Ops")
            }

        })
    
        client.login(BOT_TOKEN)
    } catch (err) {
        console.log(err)
        console.log("...Ops")
    }
}

main()
