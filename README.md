# Bloop

I'm just exploring a few ideas in this sketch of a site in vanilla Node and JS. I want force myself to make some decisions that frameworks and popular design patterns obviate. I also want to avoid dependencies and be as aware as possible of what is actually happening at each part of the build, serve, etc processes. It should also be super light.

For now, the site serves a few absurdly simple and (literally) static pages. There is no specific use-case but a general approach...

## Goals
* Play to the browser's and web's strengths (remember what playing field I am on). Avoid emulating the delivery mechanism(s) of mobile apps.
* Deliver initial page loads quickly but thereafter try and offer or at least allow, some of the "responsive feel" of a SPA. 
* Pass minimal JS and CSS to the browser and do so in as modular a manner as possible.
* Limit dependencies - No NodeJS framework (express etc), build tool (webpack etc) or templating library/language (JSX etc).
* When possible, all responses should be pre-rendered, minified and compressed markup.
* When updating _partial page content_, a _single_ response for that content should include the CSS, markup and JS. E.g. Loading a new piece of content or widget should not trigger calling multiple files.


## Content Delivery Approach

The browser receives markup. Avoid having the browser receiving data and rendering the markup dynamically.
* This markup may be delivered as a full HTML document or as part of a document which can be inserted into the DOM from a string. 
* Bindings to DOM elements should be attached to markup delivered as described above.
* Where it makes sense, the browser can of course render the DOM dynamically but in general that (meaning loops, filling in variables etc) is done server side.
* State should be defined in the URL as much as possible. So for example, after having _updated partial page content_ (via a fetch call) the user should be able to refresh and see what they last saw, after that update.
* It is better to have "things that need to happen" _not_ abstracted way but rather require said thing to be called explicitly. E.g.  "wouldn't it be nice if just by formatting it like..." winds up creating something like a framework.

The code is "pseudo isomorphic" in that JavaScript, markup and CSS, for a given page or component, is contained in one module/file. However, the module's default function is only ever run server-side. The JS for rendering the markup is generally not accessible in the browser (unless deliberately inserted into the module's result). The browser should not import the JS module file directly (to-do: need to restrict this). 

All of the above approach is, of course, going to be good for some things and not others.


## Data

For anything more complex, say a blog, a data source could be integrated. Repercussions of that, like generating static markup when relevant data changes, would be added in a way that stayed within the general approach and goals defined below.


## Implementation

### Server

There are four types of responses the server can give:
1. Files: If the requested path has an extension, of a few accepted types, then try to return a file (to-do: handle file 404 errors).
2. Full Pages: If the file does not have an extension and there is not an `is-fetch: "true"` in the request headers, it will pass the pathname to `moduleCompiler`. This will look for a module in `/pages` and if found, run the module (default). The result is passed into a `wrapper` module. All of this is added to the "hopper" (discussed below), that is used to produce the response markup and dependencies.
3. Partials: If the file does not have an extension and there is an `is-fetch: "true"` handle things the same as for a full page but do not return markup but rather a JSON version of the current hopper-object (discussed below), which includes nodes for CSS, Markup and JS.
4. 404: If the page-path (a path with no extension) was not found or a file was not found return a 404.

There's currently no handling for other types of errors, re-routing approach etc.

### Router

There is no formal routing declaration. The site just expects a URL for a page to be available as a path in `/pages` and a file to be available in `/dist`. If the path is not found it should just return a 404 page. As there is no data, there is currently no support for URL parameters (e.g. /shoe/a6s5d). It actually existed in the code but has been removed to keep things simple.

### The "Hopper"

Perhaps the core (and most unique) aspect of this wacky little site, is what I call the ["hopper"](https://en.wikipedia.org/wiki/Hopper_(particulate_collection_container)). For a request on any old site, it is fairly simple to have a request/route call one "top level" template which imports and embeds another, etc. One winds up with one or more a strings of markup and/or CSS. However, I found this hard to manage. I wanted more clarity per which CSS and JS belonged to which module (for reasons discussed below).

My solution is to:
Create a store on the server, which is instantiated on each page or page-partial request to have three nodes:
1. `css` as an empty object 
2. `markup` as a string
3. `script` as an empty object

When a "top level" module/template and its children are called for a given request, each module should call a function `addToHopper`, which will add its the output to the hopper. Its output should be an object with at least the `css` and `markup` keys of course.

For example, if the pathname "/" is requested: The hopper object's `css` node may wind up having child-keys for the templates "wrapper", "menu", "home", etc. The hopper's content is then used to return a result, generate files, etc.

_Note: There's redundancy in my current approach that I may want to address. It is useful and workable to load the CSS and JS for each module into the hopper, under a key for each module, as the order doesn't really matter and there should be no duplicate keys. Javascript for a component included five times should not (and does not need to be) be loaded five times. It may be instantiated many times, with different arguments, however. Markup is a different story. The final string depends on where child templates are inserted and how many times. For now the `markup` node in the hopper is simply a string that keeps getting overwritten until the top most template calls `addToHopper`. I've explored ASTs, creating a DOM server side and document fragments but they all seem unnecessary to date. There may be a away to only add the markup to the hopper when the template is the first template called (and hence the last template completed)._


### Modes

There is a dev mode and a prod mode. In prod mode the site should serve already rendered pages and files. In dev mode it should render, minimize (uglify) and compress (brotli) said files and then serve them.


### Build

The build script simply gathers an array of all the paths in `/pages`, then runs the default function in the module for each page. Essentially mimicking dev mode described above. This results in all the files needed for full page requests, singular dependency calls (say a CSS file) as well as the JSON response describe below, for a partial page update, being written to disk.


### Partial Page Updates

These are a discussed above but the current process is the below. 

1. There's a `link` module that should be used for any anchor tags with an `href`. On instantiation, each of these modules attaches an event listener to itself. When clicked the link should now just change the URL pathname to match it's `href` attribute. It also dispatches an event, saying that the pathname has changed. 
2. The `wrapper` template adds a listener for this event. When the event is "heard" there's a fetch call made to the server, requesting the pathname passed in.  
3. The browser receives a response of a JSON object with the three keys described above (CSS, markup and script). _Note: This comes as a stream, so it needs to be parsed_. 
4. The CSS string _for each module used_ is converted to a blob and stored in memory. A `<script>` tag is written into the head with a path to said blob but again this does not create another HTTP request as the path is to the blob in  memory (e.g. `blob:http://localhost:3000/41005629-b6c5-4d77-b31a-1f078b89c11a`).
5. The Markup string is inserted into a `div` with the ID "content".
6. The JavaScript is handled the same as the CSS but is inserted before the body close.

Note: In this "sketch" only the main content area can be updated. Loading other "widgets" is not there yet. How this could be handled and how complex UI state is maintained is "in process" but the likely solution is state for the main content area in the pathname and other UI states in search parameters or maybe a hash of a JSON object.


### Caveats

* Only a few tests as of writing. Adding them using node-tap. That said, this site is deliberately a "rabbit hole". So TDD was off the table.
* Because of wanting to keep the CSS modular, on full page load, the site may request more CSS files than seems optimal. However the goal is to (eventually) use HTTP2 to serve both the initial HTML and required CSS files in the same response.  
* There are several redundancies and known (major and minor) flaws in the code. 
