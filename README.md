# Bloop testbed site

A very sparse Node based site to explore few ideas. There is no specific use-case. It is far from complete and is deliberately not working towards being a framework but is merely (trying) to define a design pattern with a _very_ small footprint. For now, it is a "sketch" that serves a few absurdly simple (and literally static) pages. It can also request and serve and insert partial markup, via fetch. For example, it can update the main content area of a page, and load any needed CSS and JS, without overwriting the head, menus etc.

For anything more complex, say a blog, a data source could be integrated. Repercussions of that, like generating static markup when relevant data changes, would be added in a way that stayed within the goals defined below.

**Goals**
* Play to the web's strengths. Avoid the paradigm of web-apps emulating mobile apps but rather seek to deliver some of the "responsive feel" of a mobile app, without server side bloat, a large initial JS bundle, delays in hydrating markup etc.
* Use as few dependencies as possible; no NodeJS framework (express etc), no build tool (webpack etc), no templating library/language (JSX etc).
* Serve pre-rendered minified and compressed markup for _full page requests_ and minified and compressed CSS and JS for request made from said page.
* Serve and _update partial page content_ (e.g. load a new page into the content area or insert a widget/component) via one request/response, that includes all the CSS, markup and JS in one response/file.
* A page should be able to be refreshed, after having _updated partial page content_ and the page response, with any functionality should match what previously in the window. 
* Pass minimal JS and CSS to the browser and do so in as modular a manner as possible 

**Implementation**

_Server_
Uses plain http.createServer. As discussed, there is no NodeJS framework, like Express or Fastify.

There are four types of responses the server can give:
1. If the request path has an extension, of a few accepted types, return a file (todo: handle file 404 errors)
2. If the file does not have an extension and there is not an `is-fetch: "true"` in the header, pass the pathname to `moduleCompiler`. This will look for a module in `/pages` and if found, run the module (default). The result is passed into a `wrapper` module. All of this is added to the "hopper" (discussed below), that is used to produce the result markup and dependencies.

...

_The "Hopper"_
Perhaps the core (and most unique) aspect of this wacky little site, is the use of what I call the "hopper". For a given request, it is fairly simple to have one "top level" template or module call another, then another, and wind up with one or more a strings of markup and/or CSS. However, I found this hard to manage. I wanted more clarity per which CSS and JS belonged to which module (for reasons discussed below).

My solution is to:
Create a store, on the server, that is instantiated, on each page or page-partial request, with three nodes:
1. `css` as an empty object 
2. `markup` as a string
3. `script` as an empty object

When "top level" and it's child modules/templates are called for a given request, it should return an object with these keys and also call `addToHopper` which will add the out put to the hopper.

So for example, the `css` node in the hopper may wind up having keys for "wrapper", "menu", "contentArea", etc. In the case of CSS, each key will hold a string.

The hopper's content is then used to return a result, generate files, etc.





_Modes_
There is a dev mode and a prod mode. In prod mode the site should serve already rendered pages 
....


_Everything below here is a WIP_

Currently new "main" content is loaded by listening for changes to the URL/history and making a request to that URL/pathname. Loading "widgets" oustide of this model is not currently implemented. How this is handled and how state is maintained is "in process" but the likely solution is to merely maintain UI state for the main content area in the pathname and UI states (say a right hand context menu) in search parameters

However, when updating parts of a page, rather than passing a bundle of various modules or calling them via a dynamic import, each module, when run, returns an object with nodes for CSS, Markup and JS. That said, there are a few node and local utility modules imported in some cases. The goal is to only require these on the server 

The code is "pseudo isomorphic". In that the JS, markup and CSS, for a given page or widget, is contained in one file and is used for both SSR and updates in the browser. 

With the intent that only modules that have a page/route This result is added to a "hopper"

Typically however the server side code is not 

_Caveats_
* Because of wanting to keep the CSS modular, on full page load, the site may request more CSS files than seems optimal. However the goal is to eventually use HTTP2 to serve both the initial HTML and required CSS files in the same response. 
* Upon receiving a module reponse, the CSS and JS is converted to blobs and written in as tags with paths to said blobs; one tag for each module (e.g. widget, form field and button would each have their own CSS and JS)
* There is not yet any data connection or state management, server or client side. This is just to stay focused on the basics for now.
* There is currently no real production build process. In time, the idea is that the build process will just iterate through the available routes in /pages and write the needed files to /dist, with some minification and compression added.
* There is no formal routing declaration scheme. The site just expects a route and file to be available in /pages. If the path is not found it will just return a 404 page.
* As there is no data there is also no support for URL parameters (e.g. /shoe/a6s5d). It has been removed to, again, keep things simple. 
* There are several redundacies and known small flaws in the code. For example, if navigating and loading a module to replace a part of the page, the browser will pull modules it already has loaded before. There is also likely issues with using a global p_p variable and how sessions are handled etc.


* For partial updates of content, serve all the required text based content in one response ({ css: "", markup: "", script: ""}) and then handle each accordingly.
