/**
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */

const axios = require('axios');

module.exports = function(controller) {
  controller.on('message,direct_message', async (bot, message) => {
    const { data } = await axios({
      method: 'GET',
      url: 'https://developers.zomato.com/api/v2.1/cuisines?city_id=280',
      headers: {
        'user-key': process.env.ZOMATO_KEY,
        'content-type': 'application/json',
      },
    });
    let cuisines = data.cuisines;

    const findCuisineId = (cuisines, message) => {
      const cuisineObj = cuisines.find((item) => {
        return (
          item.cuisine['cuisine_name'].toLowerCase() ===
          message.text.toLowerCase()
        );
      });
      if (cuisineObj) return cuisineObj.cuisine['cuisine_id'];
      else return -1;
    };

    const cuisineId = findCuisineId(cuisines, message);

    if (cuisineId >= 0) {
      const { data } = await axios({
        method: 'GET',
        url: `https://developers.zomato.com/api/v2.1/search?entity_id=94741&entity_type=zone&cuisines=${cuisineId}`,
        headers: {
          'user-key': process.env.ZOMATO_KEY,
          'content-type': 'application/json',
        },
      });
      const restaurants = data.restaurants;
      const randRestaurant =
        restaurants[Math.floor(Math.random() * restaurants.length)].restaurant;
      await bot.reply(
        message,
        `I suggest checking out ${randRestaurant.name} located at ${randRestaurant.location.address}.
        For more information: <${randRestaurant.url}>
        Bon appetit!`
      );
    } else {
      await bot.reply(
        message,
        `Sorry, I don't understand that. What cuisine are you in the mood for? You can also type "help" for some options.`
      );
    }
  });
};
