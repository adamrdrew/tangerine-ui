# Convo AI Search Assistant Plugin

This is a frontend plugin that provides a conversational AI search interface that talks to [Tangerine](https://github.com/RedHatInsights/tangerine-backend).

## Development
Before starting:
* Make sure you are using Node 18
* Run `yarn install`
* You'll need the URL for your tangerine server as well as the OAuth token exported as environment variables:

```sh
export TANGERINE_CLUSTER_URL="tangerine.mycompany.com"
export TANGERINE_CLUSTER_API_TOKEN="DEADBEEFDEADBEEFDEADBEEFDEADBEEF"
```

With all of that in place you can start the dev server:

```sh
yarn dev
```

The app will be running on `localhost:3000`

## Deploy to RHDH

### Proxy Config

In `app-config.yaml` first add the proxy:

```yaml
proxy:
  endpoints:
    '/tangerine':
      target: "tangerine.mycompany.com"
      headers:
        Authorization: "Bearer DEADBEEFDEADBEEFDEADBEEFDEADBEEF"
```

### Dynamic Plugin Config

Add this to the dynmaic plugins config file
```yaml
    - package: "https://github.com/RedHatInsights/backstage-plugin-convo-frontend/releases/download/v0.2.9/redhatinsights-backstage-plugin-convo-frontend-dynamic-0.2.9.tgz"
      disabled: false
      integrity: "sha256-2lwrT6OIXWCaNFsR+Ns6T5MDWRmYUSGW8VpyeWwPLtU="
      pluginConfig:
        dynamicPlugins:
          frontend:
            redhatinsights.backstage-plugin-convo-frontend:
              dynamicRoutes:
                - path: /convo
                  importName: AISearchFrontendPage
                  menuItem:
                    icon: 'chat'
                    text: "Convo: AI Search"

```

### Build the Dynamic Plugin

Run `./build` - the packed tarball for the release along with its integrity sha will be generated.

