'use strict'
var ManateeBot = require('../lib/manateebot.js');

var token = process.env.BOT_API_KEY;
var name = process.env.BOT_NAME;

var manateebot = new ManateeBot({
    token: token,
    name: name
});

manateebot.run();
