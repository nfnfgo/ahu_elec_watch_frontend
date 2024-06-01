When using darkmode with `TailwindCSS`, there will be some cases that the _Native Web Component_ like scroll bar could
not follow the app's darkmode status.

To solve this question, we only need to add the following `className` on top level of our apps, for example the `body`
tags:

```
'dark:[color-scheme:dark]'
```

And everything should work fine.