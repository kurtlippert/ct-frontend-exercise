# ct-frontend-exercise
**Install nodejs**  
Install NodeJS as per your system  
`brew install node`  
`choco install node`  
`sudo (apt|dnf|etc.) install (node|nodejs|etc.)`

**Install yarn or npm**  
`brew install (npm|yarn)`  
...  
etc.

**Install parcel-bundler through npm/yarn**  
`npm install -g parcel-bundler`  
`yarn global add parcel-bundler`  

**Set `CLIENT_ID` and `CLIENT_SECRET` env vars appropriately**  
I use a `.env` file at my projects root (this is why I use the `dotenv-cli` package)  
But I think just adding those env vars at project run should be sufficient

**Running the app**  
`yarn(npm) start` to run  
`yarn(npm) build` to build  

**Q/A**  
_What challenges did you run into (if any)?_  
- Had trouble initially authenticating against the commercetools auth endpoint
  - Misread the **CLIENT_ID** and **SECRET** creds from email; I though **frontend-engineering-exercise** was the **CLIENT_ID** as first (lol)
  - Typo in the **cURL** request I tried to create
  - In all it sucked up about 30min+ time just trying to get data
- Did not finish filtering functionality
  - formed many different GET requests against the **ProductProjection** endpoint, but I couldn't get the result-set to filter after doing a bit of research ([here](https://docs.commercetools.com/http-api-query-predicates.html) and [here](https://docs.commercetools.com/http-api-projects-productProjections#query-productprojections)). Just wasn't able to get any kind of filtering going via cURL on the command line.

_What areas of the code you are most proud of?_  
- View Logic
- Reducers
- I like simple few-line functions to describe an app. Most FE-frameworks have you mutating objects in some way. In this case, the code is just a series of functions (and then the React `Render` function which kicks everything off). That said, in the background `react-redux` _is_ doing object mutations with classes etc. (like the `connect` functions), but that bit is abstracted away.

_What areas of the code you are least proud of?_  
- My `RXJS` logic feels quite difficult to read. Would've liked to have had time to clean it up.  
- My TS Typing code is a little rough.
- Ideally would've split out some of the code into separate files.

_What tradeoffs you were forced to make?_  
  - Didn't finish the filtering functionality because I couldn't get the query param stuff to work and still leave me enough time to actually get something on the page.  

_Any other notes you'd like to share?_
  - I started from some react / redux starter code I already had written during some exploratory FE toolchains (in this case: React, Redux, TypeScript, RXJS and Redux RXJS Observable Middleware, and I used the Parcel Module Bundler). Because this code was fresher on my mind, I opted to use it instead of plain JS or react or something. As I got started, I realized I was probably making things a lot harder for myself, but was already in too deep to start from something (arguably) simplier. In short, severly overestimated what I could accomplish with this starter code in 4 hours
