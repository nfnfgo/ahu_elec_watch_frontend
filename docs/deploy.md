# Backend API Configuration

You can set different backend URL address for `development` and `production` Node Environment separately.

You need to create a new file named `general.tsx` in `./src/config` based on `general_example.tsx`, with the URL replaced by your own backend URL address.

Checkout `src/config` directory for more info.

# Generate Static Website

## Generate Release Package

To generate a valid release zip file that could be directly used in server, run:

```shell
npm run release
```

This command will actually execute:

1. `npm run build`, or actually `next build` to generate static assets.
2. `npm run archive_out` which will package up the `./out` directory into a zip file.

> Notice: The generated zip file will be in `./out` directory.

## Generate ./out Directory Only

If you don't want to generate the zip file and only want `./out` directory, then just run `next build`.

# Nginx Configuration

To ensure the Static Generation feature works on server, we may need to manually configure the rules of Nginx server:

```
location / {
    if ($request_uri ~ ^/(.*)\.html(\?|$)) {
        return 302 /$1;
    }
    try_files $uri $uri.html $uri/ =404;
}
```

This will allow us to directly access the path without using `.html` subfix like `example.com/records/period`

> For more info about Static Export of Next.js, you could check out [this blog post](https://code.nfblogs.com/archives/next_js_static_export.html)

-----

After all of this work, you **should be able to access the AHU Elec Watch frontend now**. Notice that to make the whole
project work, you **also need to deploy a backend for this project**.

Check out [AHU Elec Watch Backend Repo](https://github.com/nfnfgo/ahu_elec_watch_backend) for more info.