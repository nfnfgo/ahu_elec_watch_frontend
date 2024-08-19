# Backend API Configuration

You can set different backend URL address for `development` and `production` Node Environment separately.

Checkout `src/config` directory for more info.

# Generate Static Website

To generate a static website to host on a server without running a Next backend, run:

```shell
next build
```

If command success, the generated static asset should appears at `./out`

## Generate Release Package

To generate a valid release zip file that could be directly used in server, run:

```shell
npm run release
```

This command will call:

1. `npm run build`, or actually `next build` to generate static assets.
2. `npm run archive_out` which will package up the `./out` directory into a zip file.

> Notice: The generated zip file will be in `./out` directory.