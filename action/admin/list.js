const { composer, middleware } = require("../../core/bot");

const consoles = require("../../layouts/consoles");
const security = require("../security");
const database = require("../../database/db");

composer.command(`list`, async (ctx) => {
  await security(ctx, async () => {
    const list = database.users["temporary"].toString();

    if (list === "") {
      await ctx.replyWithHTML(`<b>Temporary admin list is empty!</b>`, {
        parse_mode: "HTML",
      });
    } else {
      await ctx.replyWithHTML(
        `<b>Temporary admins:</b>\n<code>${list}</code>`,
        {
          parse_mode: "HTML",
        }
      );
    }
  });
});

middleware(composer);
consoles.module(__filename);
