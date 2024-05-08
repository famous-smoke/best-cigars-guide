# Famous Smoke Shop Best Cigars Guide
Find the best recommended Cigars by year, occasion, shape, size, country, food pairing, and more. 

## Production url
- https://www.famous-smoke.com/best-cigars-guide/

## AEM Preview Environments
- Preview: https://main--best-cigars-guide--famous-smoke.hlx.page/best-cigars-guide
- Live: https://main--best-cigars-guide--famous-smoke.hlx.live/best-cigars-guide

## Installation

```sh
npm i
```

## Linting

```sh
npm run lint
```

## Local development

1. Create a new repository based on the `aem-boilerplate` template and add a mountpoint in the `fstab.yaml`
1. Add the [AEM Code Sync GitHub App](https://github.com/apps/aem-code-sync) to the repository
1. Install the [AEM CLI](https://github.com/adobe/helix-cli): `npm install -g @adobe/aem-cli`
1. Start AEM Proxy: `aem up` (opens your browser at `http://localhost:3000`)
1. Open the `best-cigars-guide` directory in your favorite IDE and start coding :)
1. Once you are are ready to push your changes, simply use Git to add, commit, and push and your code to your preview `https://<branch>--<repo>--<owner>.hlx.page/` and production `https://<branch>--<repo>--<owner>.hlx.live/` sites.
