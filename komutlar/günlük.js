const { SlashCommandBuilder } = require('@discordjs/builders');
const { Permissions } = require('discord.js');
const db = require('croxydb');

module.exports = {
    slash: true,
    testOnly: true, // Bu satırı prodüksiyona geçmeden önce kaldırın
    cooldown: 86400, // 24 saat cooldown (saniye cinsinden)

    data: new SlashCommandBuilder()
        .setName('günlük')
        .setDescription('Her gün bir kere kullanılabilen günlük ödül'),

    async execute(client, interaction) {
        // Kullanıcının CroxyDB'deki coin miktarını al
        let coins = db.get(`coins_${interaction.user.id}`) || 0;

        // Kullanıcının daha önce günlük ödül alıp almadığını kontrol et
        const lastDaily = db.get(`lastDaily_${interaction.user.id}`);
        if (lastDaily && Date.now() - lastDaily < 86400000) { // 24 saatlik cooldown kontrolü
            const remainingTime = (86400000 - (Date.now() - lastDaily)) / 1000; // Saniye cinsinden kalan süre
            return interaction.reply(`Günlük ödülünü zaten aldın. Bir sonraki alım için ${Math.floor(remainingTime / 3600)} saat ${Math.floor((remainingTime % 3600) / 60)} dakika beklemelisin.`);
        }

        // 10 ile 20 arasında rastgele bir coin miktarı oluştur
        const coinAmount = Math.floor(Math.random() * (20 - 10 + 1)) + 10;

        // Kullanıcının coin miktarını güncelle
        db.add(`coins_${interaction.user.id}`, coinAmount);

        // Kullanıcının günlük ödül alma zamanını güncelle
        db.set(`lastDaily_${interaction.user.id}`, Date.now());

        interaction.reply(`Günlük ödülünü aldın! ${coinAmount} coin kazandın.`);
    },
};
