const { SlashCommandBuilder } = require('discord.js');
const { EmbedBuilder } = require('discord.js');
const db = require("croxydb");

module.exports = {
    slash: true,
    cooldown: 5,
    data: new SlashCommandBuilder()
        .setName('cüzdan')
        .setDescription('Coin miktarınızı görüntüleyin.')
        .addUserOption(option =>
            option.setName('kullanici')
                .setDescription('Coin miktarını görmek istediğiniz kullanıcı.')
                .setRequired(false)),

    async execute(client, interaction) {
        let user;
        if (interaction.options.getUser('kullanici')) {
            user = interaction.options.getUser('kullanici');
        } else {
            user = interaction.user;
        }

        const userCoin = db.get(`coins_${user.id}`) || 0;

        // Embed oluştur
        const embed = new EmbedBuilder()
            .setColor('#7289DA')
            .setTitle(`${user.username}'in Coin Miktarı`)
            .setDescription(`Coin Miktarı: ${userCoin}`)
            .setFooter({ text: interaction.user.username, iconURL: interaction.user.displayAvatarURL() });

        // Cevabı gönderme
        interaction.reply({ embeds: [embed], ephemeral: false });
    },
};
