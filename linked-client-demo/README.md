Use this package to bring up a live demo of the np-platform components that updates live as you make changes. This helps when debugging changes the the library.

As the "linked" in the name suggests, this package is created by having it's source directories link to the corresponding directories in np-platform-client, except that we have a different package.json, an app.json, and a few other files needed to bring up the demo.

There might be a more elegant way to do this, but this works for now.

To bring up a the demo, do the following
```
yarn install
yarn demo
```
