Experimental things with Targetprocess views.

Try it at [http://tp-experiments.herokuapp.com](http://tp-experiments.herokuapp.com).

## Usecases

- [Copy view settings](https://github.com/khmylov/tp-views-utils/blob/master/docs/copyCardSettings.md "Copy view settings") (also, [related idea](https://tp3.uservoice.com/forums/174654-we-will-rock-you/suggestions/4469450-copy-customize-cards-designs-between-boards-re-u) on UserVoice)

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
