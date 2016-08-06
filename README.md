Experimental things with Targetprocess views.

Try it at [http://tp-experiments.herokuapp.com](http://tp-experiments.herokuapp.com).

## Usecases

- [Copy view settings](https://github.com/khmylov/tp-views-utils/blob/master/docs/copyCardSettings.md "Copy view settings") (also, [related idea](https://tp3.uservoice.com/forums/174654-we-will-rock-you/suggestions/4469450-copy-customize-cards-designs-between-boards-re-u) on UserVoice)

## Using the app

For now, only API token authentication is supported. 

First of all, sign in into your Targetprocess account. Then, open up this web application. On its authentication page, type in the URL of your Targetprocess account, for example `https://example.tpondemand.com`, and then open the link below "API token" input in a new tab to copy the token value (something similar to `dGVzdA==`). Paste it into "API token" input and hit "Sign in" button.

## Building and running the app locally
Install npm

Install dependencies

    npm install

Run the app

    npm start

## Running app on Heroku

You push only sources to Heroku.
There is `postinstall` npm script, which Heroku runs when building the app,
so all bundling should be handled there.

## Running with Docker

Assuming a functional docker installation

    docker build -t tp-views-utils .

To run, mapping internal port to external OS

    docker run -p 3000:3000 -it --rm --name tp-view-utils tp-view-utils


