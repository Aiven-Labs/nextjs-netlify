nextjs-netlify
======================
Recipe library built with Next.js, PostgreSQL, Redis, OpenSearch and hosted with Netlify. Recipe data is from https://www.kaggle.com/datasets/thedevastator/better-recipes-for-a-better-life.

Overview
========

Recipe library is a Next.js application that uses PostgreSQL as its database. Optionally it utilizes Redis for caching favorite recipe statistics and OpenSearch for providing advanced search support for recipes.

The application is designed to be hosted on serverless application platform Netlify, which has amazing support for hosting Next.js applications.

Features
============

Netlify deployment
============

Development setup
============

- Install Node version 18
- Install the dependencies
  - `npm ci`
- Run the development server:
  - `npm run dev`

License
============
nextjs-netlify is licensed under the Apache license, version 2.0. Full license text is available in the [LICENSE](LICENSE) file.

Please note that the project explicitly does not require a CLA (Contributor License Agreement) from its contributors.

Contact
============
Bug reports and patches are very welcome, please post them as GitHub issues and pull requests at https://github.com/aiven/nextjs-netlify .
