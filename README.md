# Chat

This sample chat based on Socket.io and React, it uses oAuth authentication via social networks. 

* Four oAuth providers: Facebook, Twitter, Google, VKontakte.
* Chat automatically removes old messages from MongoDB by 'expires' schema property.
* It makes a sound on new incoming messages.
* It shows who are typing messages now.

# Demo

![Chat log](https://raw.githubusercontent.com/RobinTail/chat/master/images/demo/chatlog.png)

# Technologies

* NodeJS
* ES6
* Express
* Socket.io
* Passport
* React
* Flux (with Reflux)
* Babel
* SASS
* JSX
* MongoDB with Mongoose
* Webpack
* Mocha + Chai tests

# Requirements

* NPM
* MongoDB >= 2.2
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
   
   export const oAuth = {
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
           // jscs:disable maximumLineLength
           consumerSecret: '***',
           // jscs:enable maximumLineLength
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
   
   // MongoDB connection URL
   // jscs:disable maximumLineLength
   export const dbConnectionUrl = 'mongodb://***';
   // jscs:enable maximumLineLength
   
   // Server configuration options
   // Specify port or socket
   export const listenTo = 8080;
   
   // Integration test config
   export const testConfig = {
       sessionUnsigned: 'test_1234567',
       // jscs:disable maximumLineLength
       sessionEncoded: 's%3Atest_1234567.GZ%2Bk7mix0MT7PVRrPbH63AflxPR2EsWxVJmNS3F5KNc',
       // jscs:enable maximumLineLength
       sessionSecret: 'robintail/chat/session/secret',
       cookieName: 'connect.sid'
   };

   ```

* Follow URLs in this file to register your application. Fill your ClientID and ClientSecret. Don't forget to register callback url. Fill your MongoDB connection URL.
* Execute command (this will launch the webserver on port 8080 with Webpack Dev Middleware)

   ```
   npm start
   ```
  
   **or** this command for production mode (this will make a webpack minified build and launch PM2)

   ```
   npm run production
   ```

# Tests

* Execute this command for test:
 
   ```
   npm test
   ```
