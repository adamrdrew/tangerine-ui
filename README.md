# [Backstage](https://backstage.io)

This is your newly scaffolded Backstage App, Good Luck!

## Setup Proxy Config
```
proxy:
  endpoints:
    '/backend':
      target: "https://tangerine.apps.rhods-internal.61tk.p1.openshiftapps.com:6443"
      headers:
        Authorization: "Bearer ${CLUSTER_API_TOKEN}"
```

To start the app, run:

```sh
yarn install
yarn dev
```

## AI Assisted Search Dynamic Plugin

This is a development mono-repo for the Openshift Information plugin. This mono-repo was created using @backstage/create-app to provide a backend and frontend for the plugin to integrate with.

You can find the plugin code in `plugins/openshift`

## Components

### Entity Page Card

* `EntityOpenshiftInfoContent`: Displays Openshift Deployment information about each service in the Catalog. The following information is provided per deployment:
  * Deployment status
  * Name of deployment
  * Deployed image tag
  * CPU usage
  * Memory usage
  * Last deployment time

## Configuration

In `app-config.yaml` first add the proxy:

```yaml
proxy:
  endpoints:
    '/backend':
      target: 'https://api.my.openshift.cluster.com'
      headers:
        Authorization: "Bearer ${CLUSTER_API_TOKEN}"
```

Also in `app-config.yaml` add `redhatinsights.backstage-plugin-openshift` and the card component configs into the dynamic plugins section.


TODO: Need to update this
```yaml
dynamicPlugins:
  frontend:
    redhatinsights.backstage-plugin-ai-search-frontend:
      dynamicRoutes:
        - path: /ai-search-frontend
          importName: AISearchFrontendPage
          menuItem:
            icon: 'kind:resource'
            text: AI Search
```

## Development

To start the app, run:

```sh
yarn install
yarn dev
```

Before you do, you'll likely want to have catalog entries to see the plugin working on. Check out AppStage for that. 

### Build the Dynamic Plugin

Run `./build` - the packed tarball for the release along with its integrity sha will be generated.

