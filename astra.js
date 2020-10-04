const { Client, Util, MessageEmbed } = require("discord.js");
const YouTube = require("simple-youtube-api");
const fs = require("fs");
const colors = require("./colors.json");
const config = require("./config.json");
const youtube = new YouTube("AIzaSyAwDo46V-KXpBnBRheOBCZetq5FfugDgTg");
const express = require("express");
const queue = new Map();
const app = express();
const Discord = require("discord.js");
const ytdl = require("ytdl-core");
const randomPuppy = require("random-puppy");
const request = require("superagent");
const http = require("http");
require("dotenv").config();
require("./server.js");

const bot = new Client({
    disableMentions: "all"
});

bot.aliases = new Discord.Collection();
bot.commands = new Discord.Collection();

bot.login(process.env.DISCORD_TOKEN);
// NzIyMzkwNjU4OTU4MDk4NTM0.XuiYug.tc5uearsD7aopNVeyC4zJGdUO8s Mob Utilities
const PREFIX = "?";
const prefix = "?";

var version = "3.0.1";

bot.once("ready", () => {
  console.log(`Logged in as ${bot.user.tag}.`);
  bot.user.setActivity("?help | Astra", { type: "WATCHING" });
});

bot.once("reconnecting", () => {
  console.log("Reconnecting!");
});

bot.once("disconnect", () => {
  console.log("Disconnect!");
});

bot.on("guildCreate", guild => {
  console.log(
    `New guild added : ${guild.name}, owned by ${guild.owner.user.username}`
  );
});

bot.on("message", async message => {
  if (message.author.bot) return;

  if (!message.guild) return;

  if (!message.content.startsWith(config.prefix)) return;

  const args = message.content
    .slice(config.prefix.length)
    .trim()
    .split(/ +/g);
  const command = args.shift().toLowerCase();

  if (command === "ping") {
    const m = await message.channel.send("Ping?");
    m.edit(
      `Pong! Latency is ${m.createdTimestamp -
        message.createdTimestamp}ms. API Latency is ${Math.round(
        bot.ws.ping
      )}ms`
    );
  }
  if (command === "ascii") {
    const Discord = require('discord.js');
    const figlet = require('figlet');
    
    if(!args[0]) return message.channel.send('Please provide some text');

       var msg = args.join(" ");

        figlet.text(msg, function (err, data){
            if(err){
                console.log('Something went wrong');
                console.dir(err);
            }
            if(data.length > 2000) return message.channel.send('Please provide text shorter than 2000 characters')

            message.channel.send('```' + data + '```')
        })
  }

  if (command === "warnings") {
    const Discord = require("discord.js");
    const fs = require("fs");
    const ms = require("ms");
    let warns = JSON.parse(fs.readFileSync("./warnings.json", "utf8"));
    
    let wUser = message.guild.member(message.mentions.users.first()) || message.guild.members.cache.get(args[0]); //This enables us to know what member we want to see the warns for.
  if (!wUser) return message.channel.send("Please mention a valid member in this server."); //This will make sure we mention a user.

  let warn1 = warns[wUser.id].warns; //This is just a shortcut to get the number of warns.

  let warnembed = new Discord.MessageEmbed() //This is our embed.
    .setTitle("Warnings")
    .addField("User", wUser)
    .addField("Total Warnings", warns[wUser.id].warns)
    .setColor("#7289DA");
  
  message.channel.send(warnembed); //This sends our embed.
  }

  if (command === "warn") {
    const Discord = require("discord.js");
    const fs = require("fs");
    const ms = require("ms");
    let warns = JSON.parse(fs.readFileSync("./warnings.json", "utf8"));
    
    if (!message.member.hasPermission("MANAGE_MESSAGES")) return message.channel.send("You are not allowed to run that command!"); //Checks to see if the user has permission to warn members.

  let wUser = message.guild.member(message.mentions.users.first()) || message.guild.members.cache.get(args[0]); //This enables us to know what member we want to warn.
  if (!wUser) return message.channel.send("Please mention a valid member in this server."); //This will make sure we mention a user.

  let reason = args.join(" ").slice(22);
  if (!reason) reason = "No reason specified."; //This sets the reason as no reason specified if we dont include a reason.

  if (!warns[wUser.id])warns[wUser.id] = {
    warns: 0
  }; //This sets the default number of warnings as 0.


  warns[wUser.id].warns++; //This will add 1 warning each time we use the command.

  fs.writeFile("./warnings.json", JSON.stringify(warns), err => {
    if (err) console.log(err);
  }); //This will edit the warnings.json file.

  let warnembed = new Discord.MessageEmbed() //This is our embed.
    .setTitle("Warning Logged")
    .addField("User Warned", wUser)
    .addField("Reason", reason)
    .addField("Current Warnings", warns[wUser.id].warns)
    .setColor("#7289DA");
  
  message.channel.send(warnembed); //This sends our embed.
  }

  

  if (command === "say") {
    if (!message.member.hasPermission("MANAGES_MESSAGES"))
      return message.reply("Sorry, you don't have permissions to use this!");

    const sayMessage = args.join(" ");
    message.delete().catch(O_o => {});
    message.channel.send(sayMessage);
  }



  if (command === "kick") {
    if(!message.member.hasPermission("KICK_MEMBERS")) return message.channel.send('You can\'t use that!')
        if(!message.guild.me.hasPermission("KICK_MEMBERS")) return message.channel.send('I don\'t have the right permissions.')

        const member = message.mentions.members.first() || message.guild.members.cache.get(args[0]);

        if(!args[0]) return message.channel.send('Please specify a user');

        if(!member) return message.channel.send('Can\'t seem to find this user. Sorry \'bout that :/');
        if(!member.kickable) return message.channel.send('This user can\'t be kicked. It is either because they are a mod/admin, or their highest role is higher than mine');

        if(member.id === message.author.id) return message.channel.send('Bruh, you can\'t kick yourself!');

        let reason = args.slice(1).join(" ");

        if(reason === undefined) reason = 'Unspecified';        

        let embed = new Discord.MessageEmbed();

        embed.setImage("https://media4.giphy.com/media/JuZCqD9wXvGAE/giphy.gif")
        embed.setTitle(`${message.author} just kicked ${member}.`)
        member.kick(reason);
        message.channel.send(embed);
  }

  if (command === "ban") {
    if(!message.member.hasPermission("BAN_MEMBERS")) return message.channel.send("You can/'t use that")
    if(!message.guild.me.hasPermission("BAN_MEMBERS")) return message.channel.send("I don/t have enough permissions to ban people!")

    const member = message.mentions.members.first() || message.guild.members.cache.get(args[0]);

    if(!args[0]) return message.channel.send('Please specify a user');

        if(!member) return message.channel.send('Can\'t seem to find this user. Sorry \'bout that :/');
        if(!member.bannable) return message.channel.send('This user can\'t be banned. It is either because they are a mod/admin, or their highest role is higher than mine');

        if(member.id === message.author.id) return message.channel.send('Bruh, you can\'t ban yourself!');

        let reason = args.slice(1).join(" ");

        if(reason === undefined) reason = 'Unspecified';

        member.ban(reason)
        .catch(err => {
            if(err) return message.channel.send('Something went wrong')
        })
        let embed = new Discord.MessageEmbed
        embed.setTitle(`${message.author} banned ${member}`)
        embed.setImage("https://media2.giphy.com/media/H99r2HtnYs492/200.gif")
        message.channel.send(embed)
  }

  if (command === "purge") {
    if (!message.member.roles.cache.some(r => r.name === "Moderator Perms"))
      return message.reply("Sorry, you don't have permissions to use this!");

    const deleteCount = parseInt(args[0], 10);

    if (!deleteCount || deleteCount < 2 || deleteCount > 100)
      return message.reply(
        "Please provide a number between 2 and 100 for the number of messages to delete"
      );

    const fetched = await message.channel.messages.fetch({
      limit: deleteCount
    });
    message.channel
      .bulkDelete(fetched)
      .catch(error =>
        message.reply(`Couldn't delete messages because of: ${error}`)
      );
  }

  if (command === "uptime") {
    const embed = new Discord.MessageEmbed()
      .setTitle("Astra's uptime:")
      .setColor(colors.blurple)
      .addField(
        `My uptime is:`,
        "» " +
          Math.round(bot.uptime / (1000 * 60 * 60)) +
          " hours, " +
          (Math.round(bot.uptime / (1000 * 60)) % 60) +
          " minutes, and " +
          (Math.round(bot.uptime / 1000) % 60) +
          " seconds."
      )
      .setFooter(`Astra#6861`)

      .setTimestamp();
    message.channel.send(embed);
  }

  if (message.content.startsWith(`${prefix}meme`)) {
    const subReddits = ["meme", "me_irl", "dankmeme"];
    const random = subReddits[Math.floor(Math.random() * subReddits.length)];
    const img = await randomPuppy(random);

    const embed = new Discord.MessageEmbed()
      .setImage(img)
      .setTitle(`From /r/${random}`)
      .setURL(`http://reddit.com/${random}`)
      .setFooter(`Astra#6861`)
      .setTimestamp()
      .setColor(colors.blurple);

    message.channel.send(embed);
  }

  if (message.content.startsWith(`${prefix}anime`)) {
    const subReddits = ["anime", "animemes", "animegifs"];
    const random = subReddits[Math.floor(Math.random() * subReddits.length)];
    const img = await randomPuppy(random);

    const embed = new Discord.MessageEmbed()
      .setImage(img)
      .setTitle(`From /r/${random}`)
      .setURL(`http://reddit.com/${random}`)
      .setFooter(`Astra#6861`)
      .setTimestamp()
      .setColor(colors.blurple);

    message.channel.send(embed);
  }

  if (message.content.startsWith(`${prefix}facts`)) {
    const subReddits = ["facts"];
    const random = subReddits[Math.floor(Math.random() * subReddits.length)];
    const img = await randomPuppy(random);

    const embed = new Discord.MessageEmbed()
      .setImage(img)
      .setTitle(`From /r/${random}`)
      .setURL(`http://reddit.com/${random}`)
      .setFooter(`Astra#6861`)
      .setTimestamp()
      .setColor(colors.blurple);

    message.channel.send(embed);
  }

  if (message.content.startsWith(`${prefix}amongus`)) {
    const subReddits = ["amongus"];
    const random = subReddits[Math.floor(Math.random() * subReddits.length)];
    const img = await randomPuppy(random);

    const embed = new Discord.MessageEmbed()
      .setImage(img)
      .setTitle(`From /r/${random}`)
      .setFooter(`Astra#6861`)
      .setURL(`http://reddit.com/${random}`)
      .setTimestamp()
      .setColor(colors.blurple);

    message.channel.send(embed);
  }
  if (message.content.startsWith(`${prefix}wholesome`)) {
    const subReddits = ["wholesomememes", "wholesome"];
    const random = subReddits[Math.floor(Math.random() * subReddits.length)];
    const img = await randomPuppy(random);

    const embed = new Discord.MessageEmbed()
      .setImage(img)
      .setTitle(`From /r/${random}`)
      .setURL(`http://reddit.com/${random}`)
      .setFooter(`Astra#6861`)
      .setTimestamp()
      .setColor(colors.blurple);

    message.channel.send(embed);
  }
});

bot.on("guildMemberAdd", member => {
  const channel = member.guild.channels.cache.find(
    channel => channel.name === "main-chat"
  );

  if (!channel) return;

  const welcomeEmbed = new Discord.MessageEmbed()
    .setColor(colors.blurple)
    .setAuthor("Astra", bot.user.displayAvatarURL)
    .setTitle("Welcome!")
    .setThumbnail(member.avatarUrl)
    .setDescription(
      `${member} just joined the discord! Make sure to read #rules!`
    )
    .setFooter(`Astra#6861`)

    .setTimestamp();

  channel.send(welcomeEmbed);
});

bot.on("message", message => {
  let args = message.content.slice(PREFIX.length).split(" ");

  if (!message.guild) return;

  if (message.content === "?serverinfo") {
    let embed = new Discord.MessageEmbed()
      .setColor(colors.blurple)
      .setTitle("Server Info")
      .setDescription(`${message.guild}'s information`)
      .addField("Owner", `The owner of this server is ${message.guild.owner}`)
      .addField(
        "Member Count",
        `This server has ${message.guild.memberCount} members`
      )
      .addField(
        "Emoji Count",
        `This server has ${message.guild.emojis.cache.size} emojis`
      )
      .addField(
        "Roles Count",
        `This server has ${message.guild.roles.cache.size} roles`
      )
      .setTimestamp()
      .setFooter(`Astra#6861`);

    message.channel.send(embed);
  }
});
//"https://discord.com/oauth2/authorize?client_id=757684842954620969&scope=bot&permissions=2146958847&redirect_uri=https%3A%2F%2Fdiscord.gg%2FTYKSWRA"
//  ).then(message.react("ZenitsuSpazz:757605073302847498")

bot.on("message", message => {
  let args = message.content.slice(PREFIX.length).split(" ");

  if (message.content === "?invite") {
    let embed = new Discord.MessageEmbed()

      .setColor(colors.blurple)
      .setTitle("Astra Invite")
      .addField(
        "https://discord.com/oauth2/authorize?client_id=757684842954620969&scope=bot&permissions=2146958847",
        "Invite Me Now :smile:"
      )
      .setFooter(`Astra#6861`)

      .setTimestamp();
    message.author
      .send(embed)
      .then(message.react("BlobAstronautAnimated:760951845773901874"));
  }
});

const { get } = require("snekfetch");

bot.on("message", async message => {
  if (message.content.startsWith(prefix + "cat")) {
    try {
      get("https://aws.random.cat/meow").then(res => {
        const embed = new Discord.MessageEmbed()
          .setTitle(":cat: Cat Pictures, how cute! Meow")
          .setImage(res.body.file)
          .setColor(colors.blurple)
          .setFooter(`Astra#6861`)

          .setTimestamp();
        return message.channel.send({ embed });
      });
    } catch (err) {
      return message.channel.send(err.stack);
    }
  }
});

//https://hasteb.in/layotasi.json

bot.on("message", message => {
  let args = message.content.slice(PREFIX.length).split(" ");

  if (message.content.startsWith(prefix + "help")) {
    var botIcon = bot.user.displayAvatarURL();
    let embed = new Discord.MessageEmbed()

      .setTitle("Astra's bot help")
      .setThumbnail(botIcon)
      .addField("?help", "Brings you here.")
      .addField("?cat", "Gives you cute :cat: pictures.")
      .addField("?dog", "Gives you cute :dog: pictures.")
      .addField("?lizard", "Gives you cute :lizard: pictures.")

      .addField("?ban", "Will ban the mentioned person. ?ban [user] [reason]")

      .addField(
        "?kick",
        "Will kick the mentioned person. ?kick [user] [reason]"
      )
      .addField("?invite", "Will send an bot invite for Astra.")
      .addField(
        "?hentai",
        "Sends you a hentai picture, only works in nsfw channels."
      )
      .addField("?meme", "Shows you a funny meme.")
      .addField("?anime", "Shows you a anime picture.")
      .addField("?facts", "Shows you a intresting fact.")
      .addField("?facepalm", "Shows you a real facepalm. :man_facepalming:")
      .addField(
        "?serverinfo",
        "Shows you all the information about the server you're in."
      )
      .addField("?amongus", "Shows you something of Among Us.")
      .addField("?wholesome", "Shows you something wholesome.")
      .addField("?roast", "Roasts the mentioned person. ?roast [user]")
      .addField("?uptime", "Shows the uptime of Astra")
      .addField("?kill", "Kills the mentioned user. ?kill [user]")
      .addField("?donate", "Sends you donate link to support Astra!")
      .addField(
        "?partners",
        "Shows you an embed of all the discord server partners of Astra."
      )

      .setColor(colors.blurple)
      .setFooter(`Astra#6861`)

      .setTimestamp();

    message.author
      .send(embed)
      .then(message.react("BlobAstronautAnimated:760951845773901874"));
  }
});

bot.on("message", async message => {
  if (message.content.startsWith(`${prefix}hentai`)) {
    if (!message.channel.nsfw)
      return message.channel.send(
        ":underage: NSFW Command. Please switch to NSFW channel in order to use this command."
      );
    request.get("https://nekos.life/api/v2/img/hentai").end((err, response) => {
      const akami = new Discord.MessageEmbed()
        .setAuthor(`Hentai!`)
        .setTitle("Click to Go to the Picture")
        .setImage(response.body.url)
        .setColor(colors.blurple)
        .setTimestamp()
        .setFooter(`Astra#6861`)

        .setURL(response.body.url);
      message.channel.send(akami);

      console.log(`${message.member.user.tag} used the hentai command!`);
    });
  }
});

bot.on("message", async message => {
  if (message.content.startsWith(`${prefix}dog`)) {
    const subReddits = ["dogs", "dogmemes"];
    const random = subReddits[Math.floor(Math.random() * subReddits.length)];
    const img = await randomPuppy(random);

    const embed = new Discord.MessageEmbed()
      .setImage(img)
      .setTitle(`From /r/${random}`)
      .setURL(`http://reddit.com/${random}`)
      .setTimestamp()
      .setFooter(`Astra#6861`)

      .setColor(colors.blurple);

    message.channel.send(embed);
  }

  if (message.content.startsWith(`${prefix}lizard`)) {
    const subReddits = ["lizards", "lizard", "beardeddragons"];
    const random = subReddits[Math.floor(Math.random() * subReddits.length)];
    const img = await randomPuppy(random);

    const embed = new Discord.MessageEmbed()
      .setImage(img)
      .setTitle(`From /r/${random}`)
      .setURL(`http://reddit.com/${random}`)
      .setTimestamp()
      .setFooter(`Astra#6861`)

      .setColor(colors.blurple);

    message.channel.send(embed);
  }

  if (message.content.startsWith(`${prefix}facepalm`)) {
    const subReddits = ["facepalm", "thathappened"];
    const random = subReddits[Math.floor(Math.random() * subReddits.length)];
    const img = await randomPuppy(random);

    const embed = new Discord.MessageEmbed()
      .setImage(img)
      .setTitle(`From /r/${random}`)
      .setURL(`http://reddit.com/${random}`)
      .setTimestamp()
      .setFooter(`Astra#6861`)

      .setColor(colors.blurple);

    message.channel.send(embed);
  }
});

bot.on("message", async message => {
  if (message.content.startsWith(`${prefix}roast`)) {
    let user = message.mentions.users.first();
    if (message.mentions.users.size < 1)
      return message
        .reply("You must mention someone to roast them.")
        .catch(console.error);
    var roast = [
      "Were you born on the highway? That is where most accidents happen.",
      "I was going to give you a nasty look... but I see you already have one.",
      "Remember when I asked for your opinion? Me neither.",
      "Everyone’s entitled to act stupid once in awhile, but you really abuse the privilege.",
      "I'm trying to see things from your point of view, but I can't get my head that far up my ass.",
      "I haven't seen a fatty like you run that fast since twinkies went on sale for the first time.",
      "Two wrongs don't make a right, take your parents as an example.",
      "Just looking at you, I now understand why some animals eat their young offspring.",
      "Does time actually fly when you're having sex, or was it just one minute after all?",
      "You should go do that tomorrow. Oh wait, nevermind, you've made enough mistakes already for today.",
      "This is why you dont have nice things",
      "My teacher told me to erase mistakes, i'm going to need a bigger eraser.",
      "You're IQ's lower than your dick size.",
      "Are you always such an idiot, or do you just show off when I’m around?",
      "There are some remarkably dumb people in this world. Thanks for helping me understand that.",
      "I could eat a bowl of alphabet soup and shit out a smarter statement than whatever you just said.",
      "You’re about as useful as a screen door on a submarine.",
      "You always bring me so much joy—as soon as you leave the room.",
      "Stupidity’s not a crime, so feel free to go.",
      "If laughter is the best medicine, your face must be curing the world.",
      "The only way you'll ever get laid is if you crawl up a chicken's ass and wait.",
      "It looks like your face caught fire and someone tried to put it out with a hammer.",
      "Scientists say the universe is made up of neutrons, protons and electrons. They forgot to mention morons like you.",
      "Why is it acceptable for you to be an idiot but not for me to point it out?",
      "You're so fat you could sell shade.",
      "Your family tree must be a cactus because everyone on it is a prick.",
      "You'll never be the man your mother is.",
      "Just because you have an ass doesn't mean you need to act like one.",
      "Which sexual position produces the ugliest children? Ask your mother she knows.",
      "If I had a face like yours I'd sue my parents.",
      "The zoo called. They're wondering how you got out of your cage?",
      "Hey, you have something on your chin... no, the 3rd one down.",
      "Aww, it's so cute when you try to talk about things you don't understand.",
      "You are proof that evolution can go in reverse.",
      "Brains aren't everything. In your case they're nothing.",
      "You're so ugly when you look in the mirror, your reflection looks away.",
      "I'm sorry I didn't get that - I don't speak idiot.",
      "It's better to let someone think you're stupid than open your mouth and prove it.",
      "Were you born this stupid or did you take lessons?",
      "You're such a beautiful, intelligent, wonderful person. Oh I'm sorry, I thought we were having a lying competition.",
      "Don't you get tired of putting make up on two faces every morning?",
      "Hey, I'm straighter than the pole your mom dances on.",
      "If ugliness were measured in bricks, you would be the Great Wall of China.",
      "I thought I said goodbye to you this morning when I flushed the toilet",
      "If you're trying to improve the world, you should start with yourself. Nothing needs more help than you do",
      "Zombies are looking for brains. Don't worry. You're safe.",
      "spreading rumors? At least you found a hobby spreading something other than your legs.",
      "i would tell you to eat trash but that’s cannibalism",
      "If you spoke your mind, you would be speechless",
      "I can fix my ugliness with plastic surgery but you on the other hand will stay stupid forever",
      "Acting like a dick won't make yours any bigger",
      "If I wanted to hear from an asshole, I would have farted",
      "Roses are red. Violets are blue. God made us beautiful. What the hell happened to you?",
      "You remind me of a penny, two faced and worthless!",
      "I've met some pricks in my time but you my friend, are the f*cking cactus",
      "I'd slap you, but that would be animal abuse",
      "If you're gonna be a smartass, first you have to be smart. Otherwise you're just an ass. ",
      "I know I’m talking like an idiot. I have to, other wise you wouldn't understand me.",
      "You're so dumb, your brain cell died of loneliness",
      "You shouldn't let your mind wander..its way to small to be out on its own",
      "I don't know what makes you so dumb, but its working",
      "You should put the diaper on your mouth, that's where the craps comin' out.",
      "You would be much more likable if it wasn’t for that hole in your mouth that stupid stuff comes out of. ",
      "Could you go away please, I'm allergic to douchebags",
      "If you had any intelligence to question I would have questioned it already.",
      "I wish I had a lower I.Q,  maybe then I could enjoy your company.",
      "I would answer you back but life is too short, just like your d*ck",
      "Mirrors don't lie. Lucky for you, they can't laugh either.",
      "I was right there are no humans in this channel",
      "You have a face not even a mother could love....",
      "You know what I would find if I looked up idiot in the dictionary a picture of you?",
      "You make the guys on Jackass look like Einstein.....",
      "I would slap you but I don't want to make your face look any better",
      "Sorry, I can't put small objects in my mouth or Ill choke",
      "You should wear a condom on your head, if you're going to be a dick you might as well dress like one",
      "Have you been shopping lately? They're selling lives at the mall, you should get one"
    ];
    var roasts = roast[Math.floor(Math.random() * roast.length)];
    message.channel.send(user.username + " " + roasts);
  }

  if (message.content.startsWith(`${prefix}kill`)) {
    let user = message.mentions.users.first();
    if (message.mentions.users.size < 1)
      return message
        .reply("You must mention someone to kill.")
        .catch(console.error);
    message.channel.send(`:knife: I have successfully killed ${user}. :knife:`);
  }

  if (message.content.startsWith(prefix + "donate")) {
    if (message.author.bot) return;
    var botIcon = bot.user.displayAvatarURL();

    const embed = new Discord.MessageEmbed()
      .setThumbnail(botIcon)
      .setTitle(`Donate my creator!`)
      .setURL(`https://streamlabs.com/gentleeuropean`)
      .addField(
        `Donate to me to keep the bot online!`,
        `Also follow me on twitch.tv : gentleeuropean`
      )
      .setColor(colors.blurple)
      .setFooter(`Astra#6861`)
      .setTimestamp();

    message.channel.send(embed).then(function(message) {
      message.react("BlobAstronautAnimated:760951845773901874");
    });
  }

  if (message.content.startsWith(prefix + "partners")) {
    if (message.author.bot) return;
    var botIcon = bot.user.displayAvatarURL();

    const embed = new Discord.MessageEmbed()
      .setThumbnail(botIcon)
      .setTitle(`Discord Server Partners of Astra!`)
      .setURL(`https://streamlabs.com/gentleeuropean`)
      .addField(`Dream Space`, `https://discord.io/astra`)
      .addField(`Elite Hangout`, `https://discord.gg/yJQqQxG`)
      .addField(`Vibrant Server`, `http://discord.io/vibrant/`)
      .addField(`Fort Carson`, `https://discord.gg/9wZejA`)
      .addField(`Emtpy`, `Your server could be next!`)
      .setColor(colors.blurple)
      .setFooter(`Astra#6861`)
      .setTimestamp();





    message.channel.send(embed).then(function(message) {
      message.react("BlobAstronautAnimated:760951845773901874");
    });
  }
});





//  __  __           _        ____        _   
// |  \/  |_   _ ___(_) ___  | __ )  ___ | |_ 
// | |\/| | | | / __| |/ __| |  _ \ / _ \| __|
// | |  | | |_| \__ \ | (__  | |_) | (_) | |_ 
// |_|  |_|\__,_|___/_|\___| |____/ \___/ \__|


bot.on("warn", console.warn);
bot.on("error", console.error);
bot.on("ready", () => console.log(`[READY] ${bot.user.tag} has been successfully booted up!`));
bot.on("shardDisconnect", (event, id) => console.log(`[SHARD] Shard ${id} disconnected (${event.code}) ${event}, trying to reconnect...`));
bot.on("shardReconnecting", (id) => console.log(`[SHARD] Shard ${id} reconnecting...`));

bot.on("message", async (message) => { // eslint-disable-line
    if (message.author.bot) return;
    if (!message.content.startsWith(PREFIX)) return;

    const args = message.content.split(" ");
    const searchString = args.slice(1).join(" ");
    const url = args[1] ? args[1].replace(/<(.+)>/g, "$1") : "";
    const serverQueue = queue.get(message.guild.id);

    let command = message.content.toLowerCase().split(" ")[0];
    command = command.slice(PREFIX.length);

    if (command === "help" || command === "cmd") {
        const helpembed = new MessageEmbed()
            .setColor("BLUE")
            .setAuthor(bot.user.tag, bot.user.displayAvatarURL())
            .setDescription(`
__**Command list**__
> \`play\` > **\`play [title/url]\`**
> \`search\` > **\`search [title]\`**
> \`skip\`, \`stop\`,  \`pause\`, \`resume\`
> \`nowplaying\`, \`queue\`, \`volume\``)
            .setFooter("Milanotje#1072");
        message.channel.send(helpembed);
    }
    if (command === "play" || command === "p") {
        const voiceChannel = message.member.voice.channel;
        if (!voiceChannel) return message.channel.send({
            embed: {
                color: "RED",
                description: "I'm sorry, but you need to be in a voice channel to play a music!"
            }
        });
        const permissions = voiceChannel.permissionsFor(message.client.user);
        if (!permissions.has("CONNECT")) {
            return message.channel.send({
                embed: {
                    color: "RED",
                    description: "Sorry, but I need a **`CONNECT`** permission to proceed!"
                }
            });
        }
        if (!permissions.has("SPEAK")) {
            return message.channel.send({
                embed: {
                    color: "RED",
                    description: "Sorry, but I need a **`SPEAK`** permission to proceed!"
                }
            });
        }
        if (!url || !searchString) return message.channel.send({
            embed: {
                color: "RED",
                description: "Please input link/title to play music"
            }
        });
        if (url.match(/^https?:\/\/(www.youtube.com|youtube.com)\/playlist(.*)$/)) {
            const playlist = await youtube.getPlaylist(url);
            const videos = await playlist.getVideos();
            for (const video of Object.values(videos)) {
                const video2 = await youtube.getVideoByID(video.id); // eslint-disable-line no-await-in-loop
                await handleVideo(video2, message, voiceChannel, true); // eslint-disable-line no-await-in-loop
            }
            return message.channel.send({
                embed: {
                    color: "GREEN",
                    description: `✅  **|**  Playlist: **\`${playlist.title}\`** has been added to the queue`
                }
            });
        } else {
            try {
                var video = await youtube.getVideo(url);
            } catch (error) {
                try {
                    var videos = await youtube.searchVideos(searchString, 10);
                    var video = await youtube.getVideoByID(videos[0].id);
                    if (!video) return message.channel.send({
                        embed: {
                            color: "RED",
                            description: "🆘  **|**  I could not obtain any search results"
                        }
                    });
                } catch (err) {
                    console.error(err);
                    return message.channel.send({
                        embed: {
                            color: "RED",
                            description: "🆘  **|**  I could not obtain any search results"
                        }
                    });
                }
            }
            return handleVideo(video, message, voiceChannel);
        }
    }
    if (command === "search" || command === "sc") {
        const voiceChannel = message.member.voice.channel;
        if (!voiceChannel) return message.channel.send({
            embed: {
                color: "RED",
                description: "I'm sorry, but you need to be in a voice channel to play a music!"
            }
        });
        const permissions = voiceChannel.permissionsFor(message.client.user);
        if (!permissions.has("CONNECT")) {
            return message.channel.send({
                embed: {
                    color: "RED",
                    description: "Sorry, but I need a **`CONNECT`** permission to proceed!"
                }
            });
        }
        if (!permissions.has("SPEAK")) {
            return message.channel.send({
                embed: {
                    color: "RED",
                    description: "Sorry, but I need a **`SPEAK`** permission to proceed!"
                }
            });
        }
        if (!url || !searchString) return message.channel.send({
            embed: {
                color: "RED",
                description: "Please input link/title to search music"
            }
        });
        if (url.match(/^https?:\/\/(www.youtube.com|youtube.com)\/playlist(.*)$/)) {
            const playlist = await youtube.getPlaylist(url);
            const videos = await playlist.getVideos();
            for (const video of Object.values(videos)) {
                const video2 = await youtube.getVideoByID(video.id); // eslint-disable-line no-await-in-loop
                await handleVideo(video2, message, voiceChannel, true); // eslint-disable-line no-await-in-loop
            }
            return message.channel.send({
                embed: {
                    color: "GREEN",
                    description: `✅  **|**  Playlist: **\`${playlist.title}\`** has been added to the queue`
                }
            });
        } else {
            try {
                var video = await youtube.getVideo(url);
            } catch (error) {
                try {
                    var videos = await youtube.searchVideos(searchString, 10);
                    let index = 0;
                    let embedPlay = new MessageEmbed()
                        .setColor("BLUE")
                        .setAuthor("Search results", message.author.displayAvatarURL())
                        .setDescription(`${videos.map(video2 => `**\`${++index}\`  |**  ${video2.title}`).join("\n")}`)
                        .setFooter("Please choose one of the following 10 results, this embed will auto-deleted in 15 seconds");
                    // eslint-disable-next-line max-depth
                    message.channel.send(embedPlay).then(m => m.delete({
                        timeout: 15000
                    }))
                    try {
                        var response = await message.channel.awaitMessages(message2 => message2.content > 0 && message2.content < 11, {
                            max: 1,
                            time: 15000,
                            errors: ["time"]
                        });
                    } catch (err) {
                        console.error(err);
                        return message.channel.send({
                            embed: {
                                color: "RED",
                                description: "The song selection time has expired in 15 seconds, the request has been canceled."
                            }
                        });
                    }
                    const videoIndex = parseInt(response.first().content);
                    var video = await youtube.getVideoByID(videos[videoIndex - 1].id);
                } catch (err) {
                    console.error(err);
                    return message.channel.send({
                        embed: {
                            color: "RED",
                            description: "🆘  **|**  I could not obtain any search results"
                        }
                    });
                }
            }
            response.delete();
            return handleVideo(video, message, voiceChannel);
        }

    } else if (command === "skip") {
        if (!message.member.voice.channel) return message.channel.send({
            embed: {
                color: "RED",
                description: "I'm sorry, but you need to be in a voice channel to skip a music!"
            }
        });
        if (!serverQueue) return message.channel.send({
            embed: {
                color: "RED",
                description: "There is nothing playing that I could skip for you"
            }
        });
        serverQueue.connection.dispatcher.end("[runCmd] Skip command has been used");
        return message.channel.send({
            embed: {
                color: "GREEN",
                description: "⏭️  **|**  I skipped the song for you"
            }
        });

    } else if (command === "stop") {
        if (!message.member.voice.channel) return message.channel.send({
            embed: {
                color: "RED",
                description: "I'm sorry but you need to be in a voice channel to play music!"
            }
        });
        if (!serverQueue) return message.channel.send({
            embed: {
                color: "RED",
                description: "There is nothing playing that I could stop for you"
            }
        });
        serverQueue.songs = [];
        serverQueue.connection.dispatcher.end("[runCmd] Stop command has been used");
        return message.channel.send({
            embed: {
                color: "GREEN",
                description: "⏹️  **|**  Deleting queues and leaving voice channel..."
            }
        });

    } else if (command === "volume" || command === "vol") {
        if (!message.member.voice.channel) return message.channel.send({
            embed: {
                color: "RED",
                description: "I'm sorry, but you need to be in a voice channel to set a volume!"
            }
        });
        if (!serverQueue) return message.channel.send({
            embed: {
                color: "RED",
                description: "There is nothing playing"
            }
        });
        if (!args[1]) return message.channel.send({
            embed: {
                color: "BLUE",
                description: `The current volume is: **\`${serverQueue.volume}%\`**`
            }
        });
        if (isNaN(args[1]) || args[1] > 100) return message.channel.send({
            embed: {
                color: "RED",
                description: "Volume only can be set in a range of **\`1\`** - **\`100\`**"
            }
        });
        serverQueue.volume = args[1];
        serverQueue.connection.dispatcher.setVolume(args[1] / 100);
        return message.channel.send({
            embed: {
                color: "GREEN",
                description: `I set the volume to: **\`${args[1]}%\`**`
            }
        });

    } else if (command === "nowplaying" || command === "np") {
        if (!serverQueue) return message.channel.send({
            embed: {
                color: "RED",
                description: "There is nothing playing"
            }
        });
        return message.channel.send({
            embed: {
                color: "BLUE",
                description: `🎶  **|**  Now Playing: **\`${serverQueue.songs[0].title}\`**`
            }
        });

    } else if (command === "queue" || command === "q") {

        let number = message.guild.musicData.queue.map(
            (x, i) => `${i + 1} - ${x.title}\nRquested By: **${x.author.tag}**`
        );
        number = chunk(number, 5);

        let index = 0;
        if (!serverQueue) return message.channel.send({
            embed: {
                color: "RED",
                description: "There is nothing playing"
            }
        });
        let embedQueue = new MessageEmbed()
            .setColor("BLUE")
            .setAuthor("Song queue", message.author.displayAvatarURL())
            .setDescription(`${serverQueue.songs.map(song => `**-** ${song.title}`).join("\n")}`)
            .setFooter(`• Now Playing: ${serverQueue.songs[0].title}`);
        const m = await message.channel.send(embedQueue);

        if (number.length !== 1) {
            await m.react("⬅");
            await m.react("🛑");
            await m.react("➡");
            async function awaitReaction() {
                const filter = (rect, usr) => ["⬅", "🛑", "➡"].includes(rect.emoji.name) &&
                    usr.id === message.author.id;
                const response = await m.awaitReactions(filter, {
                    max: 1,
                    time: 30000
                });
                if (!response.size) {
                    return undefined;
                }
                const emoji = response.first().emoji.name;
                if (emoji === "⬅") index--;
                if (emoji === "🛑") m.delete();
                if (emoji === "➡") index++;

                if (emoji !== "🛑") {
                    index = ((index % number.length) + number.length) % number.length;
                    embedQueue.setDescription(number[index].join("\n"));
                    embedQueue.setFooter(`Page ${index + 1} of ${number.length}`);
                    await m.edit(embedQueue);
                    return awaitReaction();
                }
            }
            return awaitReaction();
        }

    } else if (command === "pause") {
        if (serverQueue && serverQueue.playing) {
            serverQueue.playing = false;
            serverQueue.connection.dispatcher.pause();
            return message.channel.send({
                embed: {
                    color: "GREEN",
                    description: "⏸  **|**  Paused the music for you"
                }
            });
        }
        return message.channel.send({
            embed: {
                color: "RED",
                description: "There is nothing playing"
            }
        });

    } else if (command === "resume") {
        if (serverQueue && !serverQueue.playing) {
            serverQueue.playing = true;
            serverQueue.connection.dispatcher.resume();
            return message.channel.send({
                embed: {
                    color: "GREEN",
                    description: "▶  **|**  Resumed the music for you"
                }
            });
        }
        return message.channel.send({
            embed: {
                color: "RED",
                description: "There is nothing playing"
            }
        });
    } else if (command === "loop") {
        if (serverQueue) {
            serverQueue.loop = !serverQueue.loop;
            return message.channel.send({
                embed: {
                    color: "GREEN",
                    description: `🔁  **|**  Loop is **\`${serverQueue.loop === true ? "enabled" : "disabled"}\`**`
                }
            });
        };
        return message.channel.send({
            embed: {
                color: "RED",
                description: "There is nothing playing"
            }
        });
    }
});

async function handleVideo(video, message, voiceChannel, playlist = false) {
    const serverQueue = queue.get(message.guild.id);
    const song = {
        id: video.id,
        title: Util.escapeMarkdown(video.title),
        url: `https://www.youtube.com/watch?v=${video.id}`
    };
    if (!serverQueue) {
        const queueConstruct = {
            textChannel: message.channel,
            voiceChannel: voiceChannel,
            connection: null,
            songs: [],
            volume: 100,
            playing: true,
            loop: false
        };
        queue.set(message.guild.id, queueConstruct);
        queueConstruct.songs.push(song);

        try {
            var connection = await voiceChannel.join();
            queueConstruct.connection = connection;
            play(message.guild, queueConstruct.songs[0]);
        } catch (error) {
            console.error(`[ERROR] I could not join the voice channel, because: ${error}`);
            queue.delete(message.guild.id);
            return message.channel.send({
                embed: {
                    color: "RED",
                    description: `I could not join the voice channel, because: **\`${error}\`**`
                }
            });
        }
    } else {
        serverQueue.songs.push(song);
        if (playlist) return;
        else return message.channel.send({
            embed: {
                color: "GREEN",
                description: `✅  **|**  **\`${song.title}\`** has been added to the queue`
            }
        });
    }
    return;
}

function chunk(array, chunkSize) {
    const temp = [];
    for (let i = 0; i < array.length; i += chunkSize) {
        temp.push(array.slice(i, i + chunkSize));
    }
    return temp;
}

function play(guild, song) {
    const serverQueue = queue.get(guild.id);

    if (!song) {
        serverQueue.voiceChannel.leave();
        return queue.delete(guild.id);
    }

    const dispatcher = serverQueue.connection.play(ytdl(song.url))
        .on("finish", () => {
            const shiffed = serverQueue.songs.shift();
            if (serverQueue.loop === true) {
                serverQueue.songs.push(shiffed);
            };
            play(guild, serverQueue.songs[0]);
        })
        .on("error", error => console.error(error));
    dispatcher.setVolume(serverQueue.volume / 100);

    serverQueue.textChannel.send({
        embed: {
            color: "BLUE",
            description: `🎶  **|**  Start Playing: **\`${song.title}\`**`
        }
    });
}

bot.login(process.env.BOT_TOKEN);

process.on("unhandledRejection", (reason, promise) => {
    try {
        console.error("Unhandled Rejection at: ", promise, "reason: ", reason.stack || reason);
    } catch {
        console.error(reason);
    }
});