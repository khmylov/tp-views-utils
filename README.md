Experimental things with Targetprocess views.

Try it at [http://tp-experiments.herokuapp.com](http://tp-experiments.herokuapp.com).

## Usecases

- [Copy view settings](https://github.com/khmylov/tp-views-utils/blob/master/docs/copyCardSettings.md "Copy view settings")

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
