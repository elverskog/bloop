# Bloop testbed site

This is just a very sparse Node based site to explore few goals and ideas. It is far from complete.

_Goals_
* Use as few dependencies as possible; no Node framework, templating language, etc.
* Serve static markup for full page requests
* Allow for partial updates of content. In particular to be able to load independent modules (perhaps from other code-bases) into the main content area.
* For partial updates of content, serve all the required text based content in one response ({ css: "", markup: "", script: ""}) and then handle each accordingly.
* Pass only minimal JS and CSS to the browser and do so in as modular a manner as possible 


_Notes_
* Because of wanting to keep the CSS modular, on full page load, the site may request more CSS files than seems optimal. However the goal is to eventually use HTTP2 to serve both the initial HTML and required CSS files in the same response. 
* Upon receiving a module reponse (see bullet 3 above) the CSS and JS is converted to blobs and written in as tags with paths to said blobs; one tag for each module (e.g. widget, form field and button would each have their own CSS and JS)
* There is not yet any data connection or state management, server or client side. This is just to stay focused on the basics for now.
* There is currently no real production build process. In time, the idea is that the build process will just iterate through the available routes in /pages and write the needed files to /dist, with some minification and compression added.
* There is no formal routing declaration scheme. The site just expects a route and file to be available in /pages. If the path is not found it will just return a 404 page.
* As there is no data there is also no support for URL parameters (e.g. /shoe/a6s5d). It has been removed to, again, keep things simple. 
* There are several redundacies and known small flaws in the code. For example, if navigating and loading a module to replace a part of the page, the browser will pull modules it already has loaded before. There is also likely issues with using a global p_p variable and how sessions are handled etc.