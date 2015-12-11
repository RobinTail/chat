# Chat

This sample chat based on Socket.IO and React, it uses oAuth authentication via four social networks (Facebook, Twitter, Google, VKontakte).

# Demo

![Chat log](https://raw.githubusercontent.com/RobinTail/chat/master/images/demo/chatlog.png)

# Technologies

* NodeJS
* Express
* Socket.IO
* Passport
* React with React Router
* Flux (with Reflux)
* Babel
* SASS
* JSX
* MongoDB with Mongoose
* Material UI
* Webpack

# Requirements

* NPM
* MongoDB
* Due to security reasons this repository does not contain oAuth ID and Secret code, it does not contain MongoDB connection URL.

# Installation

* Clone this repository
* Run this command:

   ```
   npm install
   ```
   
* Create file **config.js** and fill it with the following:

  ```
  // all oAuth providers require callback url to be registred
  // in dev mode use:
  // http://localhost:8080/auth/[provider]/callback
  
  var config = {
      facebook: {
          // https://developers.facebook.com/apps/
          clientID: '***',
          clientSecret: '***',
          callbackURL: '/auth/facebook/callback'
      },
      twitter: {
          // https://apps.twitter.com/
          // WARNING: Required to set up your mobile phone number
          consumerKey: '***',
          consumerSecret: '***',
          callbackURL: '/auth/twitter/callback'
      },
      google: {
          // https://console.developers.google.com
          // WARNING: Required to enable Google+ API in developer console
          // jscs:disable maximumLineLength
          clientID: '***',
          // jscs:enable maximumLineLength
          clientSecret: '***',
          callbackURL: '/auth/google/callback'
      },
      vk: {
          // https://vk.com/editapp?act=create
          clientID: '***',
          clientSecret: '***',
          callbackURL: '/auth/vkontakte/callback'
      }
  };
  
  module.exports = config;
  
  ```

* Follow URLs in this file to register your application. Fill your ClientID and ClientSecret. Don't forget to register callback url.
* Create file **db.js** and fill it with the following:

  ```
  module.exports = '[your MongoDB connection URL]';
  
  ```
  
* Fill your MongoDB connection URL.
* Execute command (this will launch the webserver on port 8080 with Webpack Dev Middleware)

  ```
  npm start
  ```
  
  **or** (this will build webpack app and launch webserver)

  ```
  npm run build
  ```
