# Demo chat for `zod-sockets`

[![CI](https://github.com/RobinTail/chat/actions/workflows/ci.yml/badge.svg)](https://github.com/RobinTail/chat/actions/workflows/ci.yml)

The demonstration of [zod-sockets](https://github.com/RobinTail/zod-sockets) and [express-zod-api](https://github.com/RobinTail/express-zod-api)
working together as the Socket.IO and Express based chat core using oAuth authentication via social networks.

* Three oAuth providers: Facebook, Twitter, Google (handled by `express-zod-api`);
* The application is aware of the events I/O types (handled by `zod-sockets`):
  * See [Generated client](app/client.ts),
  * See [the generator](core/generate-client.ts)
* It makes a sound on new incoming messages;
* It shows who are typing messages now;
* Converts URLs to anchors and fetch webpage's previews, photos and videos from Embedly API.

![Meme](https://github.com/RobinTail/chat/assets/13189514/754ba9cf-86db-4f83-8800-dd30f4883dbf)

# Screenshots

Responsive design by @DERZELLE (clickable previews for 'lg', 'sm' and 'xs' screens). 

[![Chat log](https://raw.githubusercontent.com/RobinTail/chat/master/images/demo/chatlog-lg-preview.png)](https://raw.githubusercontent.com/RobinTail/chat/master/images/demo/chatlog-lg.png)
[![Chat log](https://raw.githubusercontent.com/RobinTail/chat/master/images/demo/chatlog-sm-preview.png)](https://raw.githubusercontent.com/RobinTail/chat/master/images/demo/chatlog-sm.png)
[![Chat log](https://raw.githubusercontent.com/RobinTail/chat/master/images/demo/chatlog-xs-preview.png)](https://raw.githubusercontent.com/RobinTail/chat/master/images/demo/chatlog-xs.png)

Embedly API sample fetch. 

![Emdebly API](https://raw.githubusercontent.com/RobinTail/chat/master/images/demo/embedly.png)

# Technologies

* NodeJS
* Typescript
* `express-zod-api` (Express based)
* `zod-sockets` (Socket.io based)
* Passport
* React
* Vite
