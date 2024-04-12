## Development

Switch to the `master` branch (already [configured for local development](https://decapcms.org/docs/beta-features/#working-with-a-local-git-repository)).

Start the Decap CMS server:

```shell
npx decap-server
```

In another terminal window, start the Gatsby server:

```shell
gatsby develop
```

The CMS will be available at `http://localhost:8000`.

Changes to the project should be reflected instantly in the browser.

_Note: You'll also see a second link: _`http://localhost:8000/___graphql`_. This is a tool you can use to experiment with querying your data. Learn more about using this tool in the [Gatsby Tutorial](https://www.gatsbyjs.com/docs/tutorial/part-4/#use-graphiql-to-explore-the-data-layer-and-write-graphql-queries)._

## Documentation

- Decap CMS - https://decapcms.org/docs/intro/
- Gatsby - https://www.gatsbyjs.com/docs/

## Deployment

Deployment is handled automatically by Netlify. Pushing to the `production` or `staging` branches will automatically trigger a deployment of the production or staging instance of the site.
