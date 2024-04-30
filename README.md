# Bloop

A sketch of a site in vanilla Node and JS. Want to make decisions that frameworks obviate, avoid dependencies, keep it light, pure etc.

The approach might, of course, be good for some things and not others...or maybe nothing, we'll see.

## Goals
* Deliver initial page loads quickly
* Allow partial page updates
* Pass minimal JS and CSS and do so in a modular manner
* Limit dependencies - No routing module (express etc), no build tool (webpack etc), no templating library/language
* All responses be pre-rendered, minified and compressed.
* Development and production modes share as much code/process as possible.

## Approach
* First site visits and page refreshes load a standard HTML page, with tags for only the CSS and JS needed for that page.
* Navigating within the site only loads content and updates section(s), that should change (e.g. the main content area). 
* A response for such a partial content change should include only the CSS, markup and JS needed, _in one file_. 
* The browser receives content as pre-rendered markup. This markup may be delivered as a full HTML document or as part of a JSON document as a string. 
* Event listeners are attached to new DOM elements before they are inserted into document.
* State and data retrieval should be defined in _and controlled by_ the URL as much as possible. 
* The code is modular but not isomorphic. Back end code for a module/component is rarely passed to the browser.

## Data

For anything more complex, say a blog, a data source could be integrated. Repercussions of that, like generating static markup when relevant data changes, should be added in a way that stayed within the general approach and goals defined.


## Implementation

### Server

There are four types of server responses:
1. Files: When the URL has a filename and extension (e.g. "page-a.css"), try to return a file (_to-do: handle file 404 errors for files_).
2. Full Pages: If the URL does not have an extension and there is not an `is-fetch: "true"` in the request headers (e.g. "/shoes/red"), it will look for rendered HTML file. If the file doesn't exist (which is an error) the server will try to build it. 
3. Partials: If the URL does not have an extension and there is an `is-fetch: "true"` in the request headers, return a JSON file with CSS, Markup and JS sections. This JSON is then un-packed and handled on the client.
4. 404: If the page-path (a path with no extension) was not found or a file was not found return a 404 page, similar to step 2. _There's currently no handling for other types of errors, re-routing approach etc. (to-do)_

### Router

There are no routing declarations. The site expects a non-file (css etc) URL to be available in '/dist/markup' or in `/src/pages`, if the former is missing. If neither path is found server should just return a 404 page. _Note: As there is no data, there is currently no support for URL parameters (e.g. /shoe/a6s5d). It existed in the code but has been removed to keep things simple._

### Build

* The code finds all the JSM files in '/src/pages' and builds an array of these file paths
* Each page (module) is then run, which load each pages child components, then it's children etc. This results in an array of objects; one for each page, which has CSS, markup (string literals) and front-end JS for each component.
* This array is iterated over to write out all the files needed.
* Dev and Prod modes do essentially the same thing. They both write all the file needed and start the server. In dev it just (re)creates the files for all new requests. There is no hot loading as the site operates mostly as an MPA.


### Compression

* For now file compression in just toggled manually in the code. All text file will compress when left on.
* It currently uses [uglify-js](https://www.npmjs.com/package/uglify-js) and the PostCSS plugin [postcss-minify](https://www.npmjs.com/package/postcss-minify) for minification and [brotli](https://github.com/google/brotli) for compression.


### Partial Page Updates

1. There's a `link` module that should be used for any anchor tags with an `href`. 
2. On instantiation, each of these modules attaches an event listener to itself. 
3. When clicked the link should change the URL pathname to match it's `href` attribute (without making a full-page request). 
4. It also dispatches an event, saying that the pathname has changed (because listening for non-pop URL changes doesn't work). 
2. The `wrapper` template adds a listener for this event. When the event is "heard" there's a fetch call made to the server, requesting the pathname passed in.  
3. The browser receives a response as a JSON object, with the keys "css", "markup" and "script". _Note: This comes as a stream, so it needs to be parsed_. 
4. The CSS string _for each module used_ is converted to a blob and stored in memory. A `<script>` tag is written into the head with a path to said blob. _This does not create another HTTP request_, as the path is to a blob in memory (e.g. `blob:http://localhost:3000/41005629-b6c5-4d77-b31a-1f078b89c11a`).
5. The Markup string is inserted into a `div` with the ID "content".
6. The JavaScript is handled the same as the CSS but is inserted before the body close.

Note: In the current "sketch" only the main content area can be updated. Loading other "widgets" is not there yet. How this could be handled and how complex UI state is maintained, is in process but the likely solution is state for the main content area to be defined in the pathname (main URI) _and other UI states in search parameters or maybe a hash of a JSON object_.

### Caveats and To-dos

* Because of wanting to keep the CSS modular, on full page load, the site may request more CSS files than seems optimal. However the goal is to (eventually) use HTTP2 to serve both the initial HTML and required CSS files in the same response
* Writing needed files to disk can likely be improved or replaced by loading files to memory.
