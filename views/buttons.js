// @ts-check

const { ButtonBuilder, ButtonStyle } = require("discord.js");
const { Link, Davet, Çöp } = require("./emojis");
const { botId } = require("../functions/config").getConfig();

const EkleButon = new ButtonBuilder()
  .setEmoji("<a:yesil_nokta:1233870204883304509>")
  .setLabel("Link Ekle")
  .setStyle(ButtonStyle.Secondary)
  .setCustomId("eklebuton");
const SilButon = new ButtonBuilder()
  .setEmoji("<a:kirmizi_nokta:1233870434793947287>")
  .setLabel("Link Sil")
  .setStyle(ButtonStyle.Secondary)
  .setCustomId("silbuton");
const ListeButon = new ButtonBuilder()
  .setEmoji(Link)
  .setLabel("Link Liste")
  .setStyle(ButtonStyle.Secondary)
  .setCustomId("listebuton");
const DestekButon = new ButtonBuilder()
  .setURL(`https://discord.gg/ZHVdBx6atd`)
  .setLabel("Destek sunucusu")
  .setStyle(ButtonStyle.Link);
const OyButon = new ButtonBuilder()
  .setURL(`https://top.gg/bot/${botId}/vote`)
  .setLabel(`Oy ver`)
  .setStyle(ButtonStyle.Link);
const DavetButon = new ButtonBuilder()
  .setURL(
    `https://discord.com/api/oauth2/authorize?client_id=${botId}&permissions=8&scope=bot%20applications.commands`
  )
  .setLabel(`Sunucuna ekle`)
  .setStyle(ButtonStyle.Link);

module.exports = {
  EkleButon,
  SilButon,
  ListeButon,
  DestekButon,
  OyButon,
  DavetButon,
};
