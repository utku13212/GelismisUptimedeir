const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const { Command } = require("../functions/command");
const { MessageEmbed } = require("discord.js");
const fetch = require("node-fetch");

// CroxyDB'yi dahil et
const db = require("croxydb");

module.exports = new Command({
  slash: true,
  cooldown: 12 * 60 * 60, // 12 saat (saniye cinsinden)
  data: new SlashCommandBuilder()
    .setName("oy-kontrol")
    .setDescription("Belirli bir bota oy verip vermediğinizi kontrol eder."),
  async execute(client, interaction) {
    // Oy kontrolü için kullanıcının ID'sini al
    const userId = interaction.user.id;

    // Kullanıcının cooldown bitiş zamanını kontrol et
    const lastUsage = db.get(`cooldown_${userId}`) || 0;
    const cooldown = this.cooldown * 1000; // cooldown saniye cinsinden olduğu için milisaniyeye çevir

    if (Date.now() < lastUsage + cooldown) {
      // Kullanıcı hala cooldown süresinde ise
      const remainingTime = (lastUsage + cooldown - Date.now()) / 1000;
      return interaction.reply(`Bu komutu tekrar kullanabilmek için ${Math.ceil(remainingTime / 60)} dakika beklemelisin.`);
    }

    // Top.gg API'sine istek yaparak oy durumunu kontrol et
    const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjExMzI0MDkyMzI5MjMzMTIyMzgiLCJib3QiOnRydWUsImlhdCI6MTcxNTE3NzUyMH0.Yz2exJz6sQcWpJT8i2eEFSxSvMx1bxuLqrBf0-rbe8Y"; // Top.gg API anahtarını buraya ekleyin
    const BOT_ID = "1132409232923312238"; // Sabit bot ID'si

    const response = await fetch(`https://top.gg/api/bots/${BOT_ID}/check?userId=${userId}`, {
      headers: {
        "Authorization": token
      }
    });

    const data = await response.json();

    if (data.voted) {
      // Kullanıcı oy verdiyse
      if (!db.has(userId)) {
        db.set(userId, 5); // Yeni kullanıcı için jetonları ayarla
      } else {
        db.add(userId, 5); // Zaten kayıtlı kullanıcı için jetonları ekle
      }

      // Kullanıcının bu komutu kullandığı zamanı kaydet
      db.set(`cooldown_${userId}`, Date.now());

      const embed = new EmbedBuilder()
        .setColor("#00FF00")
        .setTitle("Oy Kontrolü")
        .setDescription("Başarıyla oy verdiniz! 5 jeton kazandınız.");

      return interaction.reply({ embeds: [embed] });
    } else {
      // Kullanıcı oy vermediyse
      const embed = new EmbedBuilder()
        .setColor("#FF0000")
        .setTitle("Oy Kontrolü")
        .setDescription("Oy vermediniz. Lütfen oy vermek için [oylama bağlantısı].");

      return interaction.reply({ embeds: [embed] });
    }
  },
});
