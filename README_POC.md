This branch contains a couple of PoCs.

1. Prerendering pages based on published CMS content.
2. Creating content and file upload using File Manager (from public website)
3. Validation on fields using specified validation via the CM editor.

Note that this PoC is done in the `webiny-js` repo and not in an actual `create-webiny-project` project. But this is essentially the same thing, since our repo mimics the `create-webiny-project` project, so all files should be in the same place. 

# 1. Prerendering pages based on published CMS content

To achieve this - we've added the following.

## Backend

We've added the `packages/api-headless-cms-prerendering` package. In the `packages/api-headless-cms-prerendering/src/headlessCms/index.ts`, we created a plugin, in which we are just hooking onto the content entries' `afterPublish` hook, and calling the prerendering service's API in order to trigger the rendering.

The plugin was then registered in the `api/code/headlessCMS/src/index.ts`. Do not that we applied three plugins in order for everything to work:

```ts
prerenderingServiceClientPlugins({
  handlers: {
    render: process.env.PRERENDERING_RENDER_HANDLER,
    flush: process.env.PRERENDERING_FLUSH_HANDLER,
    queue: {
      add: process.env.PRERENDERING_QUEUE_ADD_HANDLER,
      process: process.env.PRERENDERING_QUEUE_PROCESS_HANDLER
    }
  }
}),
  pbPrerenderingClientPlugins(),
  headlessCmsPrerenderingPlugins();
```

So, besides our `headlessCmsPrerenderingPlugins`, we've also added `prerenderingServiceClientPlugins` and `pbPrerenderingClientPlugins` plugins, which add the necessary the prerendering clients. Note that we are not using the prerendering client directly, we are using the Page Builder's prerendering client, which is then using the actual prerendering service client. This is because the Page Builder already has a couple of things configured for us - buckets and app / delivery CDN URLs. This way we don't have to store these ourselves. As said, we're simply relying on the system that's already set up for us.

## Frontend

Everything starts here - `apps/website/code/src/App.tsx`. This is where we import two routes.

```
 <BrowserRouter basename={process.env.PUBLIC_URL}>
        <Switch>
            <Route path={"/locations/create"} component={CreateLocation} />
            <Route path={"*"} component={Location} />
        </Switch>
    </BrowserRouter>
```

Notice that we don't have the `ApolloProvider` nowhere in this React component. We don't need it really.

This is because we're using three different Apollo clients, each talking to its own endpoint.

Check the `apps/website/code/src/components/apollo/README.md` for more information on that.

The route that is important for us is the `*` route, which renders location models for us. For example, if you try to visit `mysite.com/locations/my-location-a`, the view will try to load the location with its slug set to `/locations/my-location-a`. You can organize this in any way you like. For demonstration purposes, this was enough.

> Note that you have to create the "Location" content model and entries via Admin Area / Headless CMS in order for this to work. The complete model can be found in the `README_POC_LOCATION_MODEL.json` file, and you can import this data into your DynamoDb directly if you want, so you don't have to recreate it manually.

## How does prerendering work?

Every time you publish a new entry, the prerendering service will visit the URL defined in the `afterPublish` hook, in the mentioned `packages/api-headless-cms-prerendering/src/headlessCms/index.ts` file. You can have different URL related logic here, this was the simplest one.

> Remember that there are two CDNs in place, one that hosts the plain React app, the other one that is used by actual visitors - to whom we serve static HTML. More on this in the https://docs.webiny.com/docs/key-topics/cloud-infrastructure/website/overview article.

Finally, the prerendering service will capture the HTML and create some files along the way, and store it into the S3 bucket accordingly.

## Bonus - skip executing queries in the prerendering process

We talked about a simple article page and showing a list of other articles at the bottom of the page. We also mentioned that, maybe, we don't want to have these other articles in the initially prerendered content and because SEO doesn't depend on these, we can simply fetch them when the actual user visits the page.

With the `windows.IS_PRERENDER` flag, we can know whether the page is visited by a real user or a prerendering engine. If the latter, we can simply skip the query execution, which will of course, force the query to be executed every time a user visits the page.

This can be seen here: `apps/website/code/src/components/Location/index.tsx:69`.

# 2. Creating content and file upload using File Manager (from public website)

To demonstrate content creation and file upload from public website, we've created `apps/website/code/src/components/CreateLocation/index.tsx`, in which we are rendering a simple form, which you can submit, in order to create a new "Location" content entry. Note that the "Location" entry is not published once its created.

Not sure if that brings any issues to your flow. If so, maybe it might be easier to create custom GQL mutations and queries. Can be further discussed.

> Make sure that your API token allows creation. Use the principle of least-privilege when defining what is allowed via your API token. 

We are also rendering a simple file upload button. Once you select the file, the file upload starts, and you're given a URL to it.

Note that, in your case, you'll probably want to initiate file upload on complete form submit (once all fields are valid). Additionally, on the backend/GraphQL side, we've created `packages/api-file-manager-public-upload/src/graphql/index.ts` package, which we've imported in `api/code/graphql/src/index.ts`. With this plugins, we've added the `getPublicPresignedPostPayload` query, which will give the client all of the necessary information to be able to upload the file directly to S3.

Why did we use File Manager at all?

Well, if you don't want it to behave like that, the files that are uploaded from frontend won't end up in your File Manager UI. If this is not the intended behaviour, we can discuss this further as well.

The second reason we used File Manager for this is its backend image transformation / optimization features.

When you upload an image, you will be able to figure out its CDN URL easily (as demonstrated in `apps/website/code/src/components/CreateLocation/FileUploadButton.tsx:86`. Once you have the path to the file, you can simply add `?width=123` to get the request image in a different dimension. There are a couple of different dimensions users can retrieve, so it's not like the user can really put an arbitrary value here, and request hundreds of different sizes.  

## FAQ

### Can I adjust the allowed file sizes?

Yes, at the moment, it's a hardcoded, in the `packages/api-file-manager-public-upload/src/graphql/getPresignedPostPayload.ts`.

### How about security?

Apart from specifying the min/max file upload size, the thing you can do, is create a new Lambda function which will get triggered on file upload.
Then you can maybe use `https://www.npmjs.com/package/file-type` to inspect it.
 
# 3. Validation on fields using specified validation via the CM editor.

In the form, we are also executing the `GET_LOCATION_CONTENT_MODEL` query, which will give us the content model data. From there, we can pull out the `fields` property, and for each field, we can check which `validation` rules it has, and apply those to our fields accordignly.

You can try this out and see if it makes sense. If not, the recommended way would be to use the `@webiny/validation` library. I believe it's a solid approach as well, and if the validation won't change that much, I'd go with it, and reduce the complexity a bit.

