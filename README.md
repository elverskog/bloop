# Bloop testbed site

A sketch of a site in vanilla Node and JS, that I created just to explore a few ideas and make decisions that frameworks obviate. I'm not building a framework but may use this as a base for some personal projects. The code is far from production ready. For now, the site serves a few absurdly simple and (literally) static pages. There is no specific use-case but a general approach...

**General Approach**
* Rather than have the browser receive data and render markup dynamically, the browser receives markup. 
* The markup may be a full HTML document or it may be a string that is a part of a document. 
* Where it makes sense, the browser can of course update the DOM but in general dynamic rendering is done server side.
* State should be defined in the URL/pathname as much as possible. After having _updated partial page content_ (via a fetch call) the user should be able to refresh and see what they last saw.

This approach is of course going to be good for some things and not others. I'm merely (trying) to define a design pattern with a _very_ small footprint. 

The code is "pseudo isomorphic". In that the JS, markup and CSS, for a given page or component, is contained in one module. However, the server-side JS for rendering the markup is generally not accessible in the browser (unless deliberately included the the module's result). The browser cannot import the JS module file directly. 

For anything more complex, say a blog, a data source could be integrated. Repercussions of that, like generating static markup when relevant data changes, would be added in a way that stayed within the goals defined below.

**Other Goals**
* Avoid emulating mobile apps that can cause server side (dependency) bloat, a large initial JS bundle, delays in "hydrating" etc.
* Play to the web's strengths. Seek to deliver _some_ of the "responsive feel" of a mobile app but remember what playing field I am on. 
* Use as few dependencies as possible; no NodeJS framework (express etc), no build tool (webpack etc), no templating library/language (JSX etc).
* Serve pre-rendered minified and compressed markup for _full page requests_ and minified and compressed CSS and JS for request made from said page.
* When updating _partial page content_, the response for that content should include the CSS, markup and JS in _one_ response.
* Pass minimal JS and CSS to the browser and do so in as modular a manner as possible

**Implementation**

_Server_
Uses plain http.createServer. As discussed, there is no NodeJS framework, like Express or Fastify.

There are four types of responses the server can give:
1. Files: If the request path has an extension, of a few accepted types, return a file, if found (to-do: handle file 404 errors).
2. Full Pages: If the file does not have an extension and there is not an `is-fetch: "true"` in the request headers, it will pass the pathname to `moduleCompiler`. This will look for a module in `/pages` and if found, run the module (default). The result is passed into a `wrapper` module. All of this is added to the "hopper" (discussed below), that is used to produce the response markup and dependencies.
3. Partials: If the file does not have an extension and there is an `is-fetch: "true"` handle things the same as in point two but in this case the site does not return a markup but rather a JSON version of the current hopper (discussed below), which includes nodes for CSS, Markup and JS.

_The "Hopper"_
Perhaps the core (and most unique) aspect of this wacky little site, is the use of what I call the "hopper". For a given request, it is fairly simple to have one "top level" template or module call another, then another, and wind up with one or more a strings of markup and/or CSS. However, I found this hard to manage. I wanted more clarity per which CSS and JS belonged to which module (for reasons discussed below).

My solution is to:
Create a store, on the server, that is instantiated, on each page or page-partial request, with three nodes:
1. `css` as an empty object 
2. `markup` as a string
3. `script` as an empty object

When a "top level" modules/templates, and it's children, are called for a given request, it should both return an object with these keys and also call `addToHopper` which will add the out put to the hopper.

For example, the `css` node in the hopper may wind up having keys for "wrapper", "menu", "contentArea", etc. In the case of CSS, each key will hold a string. The hopper's content is then used to return a result, generate files, etc.

There's some redundancy in this approach however, that I may want to address. This is that it is useful and workable to load the CSS and JS into the hopper and the order doesn't really matter. Markup however is a different story, in that the resulting string depends on where shild modules are inserted etc. For now the `markup` node in the hopper is simply a string that keeps getting overwritten until the top most module calls `addToHopper`.

_Modes_
There is a dev mode and a prod mode. In prod mode the site should serve already rendered pages 
....


_Everything below here is a WIP_

Currently new "main" content is loaded by listening for changes to the URL/history and making a request to that URL/pathname. Loading "widgets" outside of this model is not currently implemented. How this is handled and how state is maintained is "in process" but the likely solution is to merely maintain UI state for the main content area in the pathname and UI states (say a right hand context menu) in search parameters

However, when updating parts of a page, rather than passing a bundle of various modules or calling them via a dynamic import, each module, when run, returns an object with nodes for CSS, Markup and JS. That said, there are a few node and local utility modules imported in some cases. The goal is to only require these on the server 

With the intent that only modules that have a page/route This result is added to a "hopper"

Typically however the server side code is not 

_Caveats_
* Because of wanting to keep the CSS modular, on full page load, the site may request more CSS files than seems optimal. However the goal is to (eventually) use HTTP2 to serve both the initial HTML and required CSS files in the same response. 
* Upon receiving a module response, the CSS and JS is converted to blobs and written in as tags with paths to said blobs; one tag for each module (e.g. widget, form field and button would each have their own CSS and JS)
* There is not yet any data connection or state management, server or client side. This is just to stay focused on the basics for now.
* There is currently no real production build process. In time, the idea is that the build process will just iterate through the available routes in /pages and write the needed files to /dist, with some minification and compression added.
* There is no formal routing declaration scheme. The site just expects a route and file to be available in /pages. If the path is not found it will just return a 404 page.
* As there is no data there is also no support for URL parameters (e.g. /shoe/a6s5d). It has been removed to, again, keep things simple. 
* There are several redundancies and known small flaws in the code. For example, if navigating and loading a module to replace a part of the page, the browser will pull modules it already has loaded before. There is also likely issues with using a global p_p variable and how sessions are handled etc.


* For partial updates of content, serve all the required text based content in one response ({ css: "", markup: "", script: ""}) and then handle each accordingly.
