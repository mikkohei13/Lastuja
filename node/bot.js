// Testing Telegram bot

console.log("Started up");

const Slimbot = require('slimbot');
const slimbot = new Slimbot('273015314:AAFBgYJZaoOpeuSt8oA2JqsDfxJkjkB5e9Y');

slimbot.sendMessage('@lajifi', 'Hoi taas, julkinen kanava!').then(message => {
  console.log(message);
});

