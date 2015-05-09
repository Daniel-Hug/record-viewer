record viewer
=============

## File structure
 1. All the independant JS modules like [DDS](https://github.com/Daniel-Hug/DDS), [DOM-Builder](https://github.com/Daniel-Hug/DOM-Builder), and polyfills are loaded first.
 1. Next, the custom JS files are loaded, the first of which is helpers.js, which includes all the helper functions that perform tasks not specific to this web app.
 1. Next, app.js is loaded. This includes functions that perform tasks specific to this web app.
 1. Next, init.js is loaded. All the other files do is export functions. This file actually starts the app running by executing some of them.