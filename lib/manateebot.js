'use strict'

var util = require('util');
var path = require('path');
var fs = require('fs');
var SQLite = require('sqlite3').verbose();
var Bot = require('slackbots');

var ManateeBot = function Constructor(settings) {
  this.settings = settings;
  this.settings.name = this.settings.name || 'manatee';

  this.user = null;
}

util.inherits(ManateeBot, Bot);

ManateeBot.prototype.run = function() {
  ManateeBot.super_.call(this, this.settings);

  this.on('start', this._onStart);
  this.on('message', this._onMessage);
}

ManateeBot.prototype._onStart = function () {
  this._loadBotUser();
  this._firstRunCheck();
};

ManateeBot.prototype._loadBotUser = function () {
  var self = this;
  this.user = this.users.filter(function (user) {
      return user.name === self.name;
  })[0];
};

ManateeBot.prototype._firstRunCheck = function () {
  var self = this;
  self._welcomeMessage();
};

ManateeBot.prototype._welcomeMessage = function () {
  var self = this;
  this.channels.map(function(channel) {
    self.postMessageToChannel(channel.name, 'Everything will be ok',
    {as_user: true});
  })
};

ManateeBot.prototype._onMessage = function (message) {
  if (this._isChatMessage(message) &&
      this._isChannelConversation(message) &&
      !this._isFromManateeBot(message) &&
      this._isMentioningManatee(message)
  ) {
      this._replyWithRandomManatee(message);
  }
};

ManateeBot.prototype._isChatMessage = function (message) {
  return message.type === 'message' && Boolean(message.text);
};

ManateeBot.prototype._isChannelConversation = function (message) {
  return typeof message.channel === 'string' &&
    message.channel[0] === 'C';
};

ManateeBot.prototype._isFromManateeBot = function (message) {
  return message.user === this.user.id;
};

ManateeBot.prototype._isMentioningManatee = function (message) {
  return message.text.toLowerCase().indexOf('manatee') > -1 ||
    message.text.toLowerCase().indexOf(this.name) > -1;
};

ManateeBot.prototype._replyWithRandomManatee = function(message) {
  var self = this;
  var channel = self._getChannelById(message.channel);
  var number = Math.floor((Math.random() * 34) + 1)
  var manatee = "http://calmingmanatee.com/img/manatee"+ number + ".jpg"
  self.postMessageToChannel(channel.name, manatee, {as_user: true});
}

ManateeBot.prototype._getChannelById = function (channelId) {
  return this.channels.filter(function (item) {
    return item.id === channelId;
  })[0];
};

module.exports = ManateeBot;
