// @ts-check

const fetch = require("node-fetch");
const { Event } = require("../functions/event");
const { getAllLinks, removeEmptyData } = require("../functions/general");
const { botName } = require("../functions/config").getConfig();
const Discord = require('discord.js');
const db = require("croxydb");
const links = db.fetch("UptimeLink") || [];
const Linkler = db.fetch(`UptimeLink`) || []

module.exports = {
    name: 'ready',
      
    execute(client) {
        console.log(`Bot Aktif`);

        // Hedeflenen sunucunun ID'si ve ses kanalının ID'si
        const guildId = '1149364622806241421';
        const voiceChannelId = '1234139404285513818';

        // Oynuyor durumu güncelleme fonksiyonu
        function updateActivity() {
            const activities = [
                'Bütün komutlar - /yardım',
                'Yeni güncelleme!',
                'Bir sorun mu var? - https://discord.gg/ZHVdBx6atd',
                'youtube.com/@Mustifix'
                // Ek oynuyor durumları buraya eklenebilir
            ];

            const randomActivity = activities[Math.floor(Math.random() * activities.length)];
            client.user.setActivity(randomActivity);
        }

        // Ses kanalına bağlanma fonksiyonu
        function connectToVoiceChannel(guildId, voiceChannelId) {
            const guild = client.guilds.cache.get(guildId);
            if (!guild) {
                console.error(`Belirtilen sunucu bulunamadı.`);
                return;
            }

            const voiceChannel = guild.channels.cache.get(voiceChannelId);
            if (!voiceChannel || voiceChannel.type !== 'GUILD_VOICE') {
                console.error(`Belirtilen ses kanalı bulunamadı veya geçerli bir ses kanalı değil.`);
                return;
            }

            voiceChannel.join()
                .then(connection => {
                    console.log(`Başarıyla ses kanalına katıldı: ${voiceChannel.name}`);
                })
                .catch(error => {
                    console.error(`Ses kanalına katılma hatası: ${error}`);
                });
        }

        // İlk oynuyor durumu ayarlama ve ses kanalına bağlanma işlemini gerçekleştirme
        updateActivity();
        connectToVoiceChannel(guildId, voiceChannelId);

        // Oynuyor durumunu her 30 saniyede bir güncelleme
        setInterval(updateActivity, 30000); // 30 saniye = 30000 milisaniye
    }
};
