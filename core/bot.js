const { Telegraf, Composer } = require("telegraf");
const Filter = require("bad-words");

const env = require("./env");
const filter = new Filter({
  placeHolder: "*",
  replaceRegex: /[A-Za-z0-9가-힣_]/g,
});
const consoles = require("../layouts/consoles");

const bot = new Telegraf(env.BOT_TOKEN);
const composer = new Composer();
const middleware = (composer) => {
  bot.use(composer.middleware());
};

bot.telegram.getMe().then((botInfo) => {
  bot.options.username = botInfo.username;
});

if (env.ENVIRONMENT === "heroku") {
  bot
    .launch({
      webhook: {
        domain: env.DOMAIN,
        hookPath: "/bot",
        port: env.PORT,
      },
    })
    .then(async () => {
      consoles.launch(env.ENVIRONMENT);
      await bot.telegram.sendMessage(
        env.CONTROLLER,
        `<a href="https://github.com/chiseldevs/westman"><b>⛓ GitHub Update Notification ⛓</b></a>` +
          `\n` +
          `\n` +
          `<i>The telegram bot has just finished checking health status and has been restarted successfully</i>` +
          `\n` +
          `\n` +
          `<b>For more information, visit:</b>` +
          `\n` +
          `<a href="https://t.me/westmans_bot"><u>https://t.me/westmans_bot</u></a>`,
        {
          parse_mode: "HTML",
          disable_notification: true,
        }
      );
    })
    .catch((error) => consoles.errors(error));
} else if (env.ENVIRONMENT === "local") {
  bot
    .launch()
    .then(() => consoles.launch(env.ENVIRONMENT))
    .catch((error) => consoles.errors(error));
} else {
  consoles.wrongEnv();
}

module.exports = {
  bot,
  filter,
  composer,
  middleware,
};
