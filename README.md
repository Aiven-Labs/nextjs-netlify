nextjs-netlify
======================

Free [Netlify](https://www.netlify.com/) quickstart recipe libary app using [Next.js](https://nextjs.org/), [Prisma](https://www.prisma.io/) and [Aiven](https://aiven.io). Recipe data is from [kaggle](https://www.kaggle.com/datasets/thedevastator/better-recipes-for-a-better-life).

About the app
========

The application is a recipe library where you can browse and inspect recipes. Additionally, you can like recipes that seem interesting and filter list to show only liked ones. Furthermore, you can see interesting statistics from all of the recipes and those that are liked.

PostgreSQL is used as the data storage for storing all recipes and whether they are liked or not. Redis is optional, but when configured statistics are cached to offer faster response time. The database response times are shown in the app to demonstrate the difference. You can get a free PostgreSQL and Redis to use from Aiven by [signing up](https://console.aiven.io/signup).

The application is designed to be hosted on serverless application platform Netlify, which has amazing support for hosting Next.js applications.

Getting started
============

The app requires PostgreSQL database. Configuring Redis is optional, but highly recommended to demonstrate all features of the application and the benefits of having a Redis as part of your application. Using `us-east-1` region is recommended to minimise latency, as this region will be closest to where the Netlify functions are deployed if using their free plan.

Get free PostgreSQL and Redis from [Aiven](https://console.aiven.io).

## Fork and deploy to Netlify

You can fork this branch and deploy the application immediately to Netlify by clicking the button below. Database migrations and seed is done during the Netlify deployment process. Make sure you have PostgreSQL database up and running when deploying to achieve working environment on the first try.

[![Deploy to Netlify](https://www.netlify.com/img/deploy/button.svg)](https://app.netlify.com/start/deploy?repository=https://github.com/aiven/nextjs-netlify)

## Development setup

- Install Node version 18
- Copy [.env.template](.env.template) as .env and set DATABASE_URL and REDIS_URI
- Install the packages: `npm ci`
- Setup the database by running: `npm run reset-db`
- Start the development server: `npm run dev`
- Go to http://localhost:3000 and head to browse the recipes

Congratulations you can now start developing. The page reloads automatically as you make changes.

## Useful commands for development

- Reset the database: `npm run reset-db`
- Run the development server: `npm run dev`
- Run eslint: `npm run eslint`
- Run prettier format: `npm run format`


Netlify deployment
============

You can fork this branch and deploy the application immediately to Netlify by clicking the button below. Database migrations and seed is done during the Netlify deployment process. Make sure you have PostgreSQL database up and running when deploying to achieve working environment on the first try.

[![Deploy to Netlify](https://www.netlify.com/img/deploy/button.svg)](https://app.netlify.com/start/deploy?repository=https://github.com/aiven/nextjs-netlify)

## Setup automatic deployment manually

1. Install packages: `npm ci`
1. Login with the cli to obtain token: `npx netlify login`
1. Start and follow the automated setup process: `npx netlify init`

    Choose to create a new site, and then select the default options other prompts. You will be required to authorize Netlify with GitHub.

1. Open site admin UI in Netlify: `npx netlify open --admin`
1. Go to site configuration section and add environment variables for PostgreSQL and Redis. Check [.env.template](.env.template) for the keys.
1. Go to deploys section and trigger the deployment by clicking `Trigger deploy` -button.
1. Access the app from command line with `npx netlify open --site` or open the site from the Netlify admin UI.

You can now push changes and your changes will be automatically deployed to your site.

License
============
nextjs-netlify is licensed under the Apache license, version 2.0. Full license text is available in the [LICENSE](LICENSE) file.

Please note that the project explicitly does not require a CLA (Contributor License Agreement) from its contributors.

Contact
============
Bug reports and patches are very welcome, please post them as GitHub issues and pull requests at https://github.com/aiven/nextjs-netlify.
