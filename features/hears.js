/**
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */

const axios = require('axios');

module.exports = function(controller) {
  controller.hears(
    [new RegExp(/^hi/i), 'hello', 'howdy', 'hey'],
    'message,direct_message',
    async (bot, message) => {
      await bot.reply(
        message,
        'Hi there! Are you hungry? You can also type "help" for some options.'
      );
    }
  );

  // use a function to match a condition in the message
  controller.hears(
    async (message) => message.text && message.text.toLowerCase() === 'help',
    ['message'],
    async (bot, message) => {
      const { data } = await axios({
        method: 'GET',
        url: 'https://developers.zomato.com/api/v2.1/cuisines?city_id=280',
        headers: {
          'user-key': process.env.ZOMATO_KEY,
          'content-type': 'application/json',
        },
      });
      let cuisines = data.cuisines;
      let cuisineOptions = [];
      for (let i = 0; i < 5; i++) {
        let randIdx = Math.floor(Math.random() * cuisines.length);
        cuisineOptions.push(cuisines[randIdx].cuisine);
      }

      await bot.reply(message, {
        text: `Here's some ideas! Listen to your stomach 🤤`,
        quick_replies: cuisineOptions.map((cuisine) => {
          return {
            title: cuisine.cuisine_name,
            payload: cuisine.cuisine_name,
          };
        }),
      });
    }
  );
};
