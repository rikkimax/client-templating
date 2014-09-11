client-templating
=================

Client side web framework to load templates and fill them with data from the server side.<br/>
Based upon the concept of Facebook's Bigpipe (page lets).<br/>
Will Asynchonously load pages content and fill them with data.<br/>

Libraries to be used with
-----------------------
* [Prototype](http://prototypejs.org/)
* [Markdown](https://github.com/evilstreak/markdown-js)
* [Transparency](https://github.com/leonidas/transparency)
* [Headjs](http://headjs.com/)

JQuery is not supported. It would be possible to utilise it instead of prototype however if libs/core/index.js were to be modified for it.

If a template ends with .md the markdown library will automatically parse it.

Examples
--------
Because this framework is meant to be modified, the examples is essentially the entire repository.
