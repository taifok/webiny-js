## Three Apollo Clients

We have three Apollo clients here.

1. The default client that talks to your `/graphql` API. We use this one to execute the file upload via File Manager.
2. the `cms/read/{locale}` - for pulling data from CMS
3. the `cms/manage/{locale}` - for executing mutations on the CMS

For every client, we're providing React hooks, so you don't need to pass the client each time you want to make a query or mutation. It's just a matter of importing the React hook for the right client.

So, you should be able to use the following import statements (importing from the app's root directory):

```ts
import { useQuery, useMutation } from "./components/apollo/cms/read";
import { useQuery, useMutation } from "./components/apollo/cms/manage";
import { useQuery, useMutation } from "./components/apollo/graphql";
```
