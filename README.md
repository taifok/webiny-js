## CMS + Dynamic pages

This branch contains an experimental implementation of Data Sources which are used to combine CMS data with Page Builder and render CMS data on a public site using content plugins.

### Setup repo

1. Clone the repo

`git clone git@github.com:webiny/webiny-js.git`

2. Switch to working branch

`git checkout "r&d/dynamic-pages"`

3. Install project dependencies

`yarn`

4. Setup repo - this will generate the necessary .env.json files and build packages (may take a minute or two)

`yarn setup-repo`

5. Update .env.json with MongoDB connection string

https://docs.webiny.com/docs/get-started/quick-start/#2-setup-database-connection

6. Deploy the "local" env for your API

`yarn webiny deploy api --env=local`

7. Start your admin app

`cd apps/admin && yarn start`

8. Complete the installation wizard in the browser, once the admin app has started.

9. Start your "site" app

`cd apps/site && yarn start`


### CMS and dynamic pages

To setup dynamic content, create a CMS content model and some content entries.
Create a CMS Access Token (see [/docs/dynamic-pages](./docs/dynamic-pages) folder for screenshots).
Then create a new page within the Page Builder. In page settings, configure GraphQL data sources using the CMS endpoints and the access token (as shown on screenshots). The key here is to configure the page URL to contain a variable (or several variables) that will be matched, which you can then pass to your data sources to load data.

To render the content from Data Sources on the page, you need to add a `dynamic-content` element and configure it to use a specific data source and a component. An example package containing plugins for the editor and site rendering is located in [/packages/app-dynamic-pages/src](./packages/app-dynamic-pages/src).

API plugin to load the page based on the URL pattern is located in [/packages/api-dynamic-pages/src](./packages/api-dynamic-pages/src)

Once your dynamic elements are in place, publish the page and visit the page in your "site" app, most likely at localhost:3000 if you're using the default setup.

To play with `dynamic-pages` code, run the watch process which will rebuild the package on each change:
```
lerna run watch --scope=@webiny/{api,app}-dynamic-pages --stream --parallel
```
