/**
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */

module.exports = function(controller) {
  controller.hears(
    ['hi', 'hello', 'howdy', 'hey', 'aloha', 'hola', 'bonjour', 'oi'],
    'message,direct_message',
    async (bot, message) => {
      await bot.reply(
        message,
        'Hi there! What kind of cuisine are you in the mood for? You can also type "help" for some options.'
      );
    }
  );
};
