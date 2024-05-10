const { SlashCommandBuilder } = require('discord.js');
const { MessageActionRow, MessageButton, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');
const db = require("croxydb");

module.exports = {
    slash: true,
    cooldown: 5,
    data: new SlashCommandBuilder()
        .setName('slot')
        .setDescription('Slot oyunu oyna.')
        .addIntegerOption(option =>
            option.setName('miktar')
                .setDescription('Oynamak istediğin coin miktarı.')
                .setRequired(true)),

    async execute(client, interaction) {
        const coinMiktarı = interaction.options.getInteger('miktar');
        const userCoin = db.get(`coins_${interaction.user.id}`) || 0;

        // Kullanıcının yeterli coin miktarına sahip olup olmadığını kontrol et
        if (coinMiktarı > userCoin || coinMiktarı <= 0) {
            return interaction.reply({ content: 'Yetersiz coin miktarı veya geçersiz miktar girdiniz.', ephemeral: true });
        }

        // Slot oyununu oynayalım
        const kazanmaOlasılığı = Math.random() < 0.5; // 50% kazanma olasılığı
        let kazanılanMiktar = 0;

        // Slot emojileri
        const slotEmojiler = ['🍋', '🍊', '🍇', '🍒', '🔔', '💰'];

        // Rastgele üç emoji seçimi
        const slot1 = slotEmojiler[Math.floor(Math.random() * slotEmojiler.length)];
        const slot2 = slotEmojiler[Math.floor(Math.random() * slotEmojiler.length)];
        const slot3 = slotEmojiler[Math.floor(Math.random() * slotEmojiler.length)];

        // Kazanma durumunu kontrol et
        const kazandı = slot1 === slot2 && slot2 === slot3;

        // Embed oluştur
        const embed = new EmbedBuilder()
            .setColor(kazandı ? '#00ff00' : '#ff0000')
            .setTitle('Slot Oyunu')
            .setDescription(`
**SONUÇ:** ${slot1} ${slot2} ${slot3}

**DURUM:** ${kazandı ? 'Kazandınız!' : 'Kaybettiniz!'}

**KAZANILAN:** ${kazandı ? `${coinMiktarı * 2} coin` : '0 coin'}
`)

            //.addFields({ name: 'SONUÇ', value: `${slot1} ${slot2} ${slot3}` }, { name: 'DURUM', value: kazandı ? 'Kazandınız!' : 'Kaybettiniz!' }, { name: 'KAZANILAN', value: kazandı ? `${coinMiktarı * 2} coin` : '0 coin' })
            //.setFooter({ text: 'Some footer text here', iconURL: 'https://i.imgur.com/AfFp7pu.png' });
            .setFooter({ text: interaction.user.username, iconURL: interaction.user.displayAvatarURL() });

        // Kazanma durumuna göre coin güncelle
        if (kazandı) {
            kazanılanMiktar = coinMiktarı * 2;
            db.add(`coins_${interaction.user.id}`, kazanılanMiktar);
        } else {
            db.subtract(`coins_${interaction.user.id}`, coinMiktarı);
        }

        // Cevabı gönderme
        interaction.reply({ embeds: [embed], ephemeral: false });
    },
};
