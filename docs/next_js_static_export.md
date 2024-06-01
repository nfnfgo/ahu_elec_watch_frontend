# Static Export

When the app not necessarily requires all `Next.js` server side features and don't require `Node.js` (For example if you
are developing an SPA), then maybe you would use _Static Export_ feature provided by `Next.js`.

> To get a better support of Static Export feature, Next.js recommend you using App Router.

# Enable Static Export

To enable _Static Export_, add following config to `next.config.mjs`:

```js
const nextConfig = {
    output: "export"
};
```

> The old `next export` script has been deprecated and removed in Next.js 14, so the only way to use this feature now is
> update the config file.

After this settings, everytime you call `next build`, it would generate the static file in `/out` directory.

# Reference Error: window is undefined

This is a general error that we may met when using static export.

To solve this, we need to ensure **all the client specified code are actually only run in client side**.

You may say you have added `use client;` at the beginning of the file, but this is not enough. Because in the new
version of `Next.js`, client component will also be pre-rendered in server.

To make sure your code run only in client side, you can write something like:

```js
if (typeof window !== 'undefined') {
    // client only code like below
    // access window etc
    return window.matchMedia("(prefers-color-scheme:dark)").matches;
}
```

# Route 404 Not Found

After exporting and deploying the exported static file, we may met `404 Not Found` error when accessing some of the sub
routes like `/info/user`, this may because we don't set the NGINX rules.

```
location / {
    if ($request_uri ~ ^/(.*)\.html(\?|$)) {
        return 302 /$1;
    }
    try_files $uri $uri.html $uri/ =404;
}
```

![image.png](https://s2.loli.net/2024/05/31/JZ9spGIuNxafCcl.png)

After adding this NGINX settings, there should be no more `404` when you try to access any route.

# Refs

[Next.js Docs - Static Export](https://nextjs.org/docs/app/building-your-application/deploying/static-exports)