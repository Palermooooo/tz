const { readFile, writeFile } = require("fs").promises;
const { Client } = require("fnbr");
const Invite = require("./user.js");
const mongoose = require('mongoose')
mongoose.Promise = global.Promise;

mongoose.connect('mongodb://admin:admin@cluster0-shard-00-00.sr4um.mongodb.net:27017,cluster0-shard-00-01.sr4um.mongodb.net:27017,cluster0-shard-00-02.sr4um.mongodb.net:27017/test?replicaSet=atlas-40jvlr-shard-0&ssl=true&authSource=admin', {
	useNewUrlParser: true,
	useUnifiedTopology: true,
	useFindAndModify: false,
	autoIndex: false,
})
	.catch((e) => console.log('[index.js] ' + e));
function makeCode(length) {
  var result = [];
  var characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789#$%_";
  var charactersLength = characters.length;
  for (var i = 0; i < length; i++) {
    result.push(
      characters.charAt(Math.floor(Math.random() * charactersLength))
    );
  }
  return result.join("");
}

(async () => {
  let auth;
  try {
    auth = { deviceAuth: JSON.parse(await readFile("./deviceAuth.json")) };
  } catch (e) {
    auth = {
      authorizationCode: async () => Client.consoleQuestion("Введи токен: "),
    };
  }

  const client = new Client({ auth });

  client.on("deviceauth:created", (da) =>
    writeFile("./deviceAuth.json", JSON.stringify(da, null, 2))
  );

  client.on("friend:request", async (pendingFriend) => {
    console.log(`Добавление от ${pendingFriend.displayName}`); //pendingFriend.id - айди человека, лучше по нему чекать
    let current = await Invite.findOne({ id: pendingFriend.id });
    let friend = await pendingFriend.accept();
    if (current && current.userID)
      return friend.sendMessage("У тебя уже привязан аккаунт");

    let code = makeCode(10);
    await friend.sendMessage("Твой код: " + makeCode(15));

    let newInvite = new Invite({
      username: pendingFriend.displayName,
      code: code,
      id: pendingFriend.id,
    });
  });

  await client.login();
  console.log(`Вошел с помощью ${client.user.displayName}`);
  client.setStatus("Бот для Yalexer");
})();