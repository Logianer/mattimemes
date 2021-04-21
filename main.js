const Discord = require('discord.js');
const JSONdb = require('simple-json-db');
const path = require('path')
const jsdb = new JSONdb(__dirname + '/storage.json');
var client = new Discord.Client({
  partials: ['MESSAGE', 'CHANNEL', 'REACTION']
});
imageFormats = [
  "webp", "png", "jpg", "gif"
]
emojis = ["😂", "🤣", "perfection", "ehre", "mrtrixLul", "afefa", "mrtrixFool", "mrtrixPhilo", "mrtrixClean"]
client.login("HEHE_YOUR_TOKEN_HERE")
client.on("ready", () => {
  client.user.setActivity(' gute Memes an. somniumkino.de/memes!', {
    type: 'WATCHING'
  })
  console.log("READY!");
})
client.on('messageReactionAdd', async (reaction, user) => {
  if (reaction.partial) {
    try {
      await reaction.fetch();
    } catch (error) {
      console.error('Something went wrong when fetching the message: ', error);
      return;
    }
  }
  // is msg in channel with name "memes"?
  if (reaction.message.channel.name.indexOf("memes") == -1) return
  // get first attachment:
  var ersterAnhang = reaction.message.attachments.first()
  // if spoiler, return:
  if (!ersterAnhang || ersterAnhang.spoiler) return;
  // some complicated stuff going on here, basically, return if it doesn't match the conditions:
  if (!emojis.includes(reaction.emoji.name) || !imageFormats.includes(ersterAnhang.name.split(".")[ersterAnhang.name.split(".").length - 1]) || !(reaction.count >= 10 || user.id == "335402639611396098")) return;
  if (jsdb.JSON().data.filter(m => m.url == reaction.message.url).length != 0) return;
  reaction.message.react("✅")
  // prepare an object to save
  saveObject = {
    author: reaction.message.author.username,
    img_url: ersterAnhang.url,
    url: reaction.message.url,
    timestamp: reaction.message.createdTimestamp
  };

  //try to send a pm to the user:
  try {
    reaction.message.author.send(`Eins deiner Memes ist jetzt auf http://somniumkino.de/memes!\n${saveObject.img_url}`)
  } catch (e) {
    console.warn("Could not send notification to " + reaction.message.author.username);
  }
  // save the data
  dbdata = jsdb.get("data");
  dbdata.unshift(saveObject)
  jsdb.set("data", dbdata)
  //log it
  console.log(`Added Meme from ${saveObject.author} posted at ${new Date(saveObject.timestamp).toLocaleString()}`);
});
client.on("message", msg => {
  // reactions
  if (msg.channel.id == "834017187609182278") return msg.react("816055294035230751"); //randomness-chat-react-with :rndm:
  // "help"-cmd
  if (!msg.mentions.has(client.user)) return;
  msg.react("825471832600608798")
  msg.reply("Guck mal hier, hier ist alles erklärt!: http://somniumkino.de/memes").then(msg => {
    setTimeout(function(msg) {
      msg.delete()
    }, 5000, msg)
  })
})