# Use Netlify to deploy your Next.js, PostgreSQL® and Aiven for Caching app

This tutorial guides you through deploying a [Netlify](https://www.netlify.com/) web application with an [Aiven for PostgreSQL®](https://aiven.io/postgresql) and [Aiven for Caching](https://aiven.io/caching) backend.

The sample application used in this tutorial is a cooking recipe library displaying open source [recipe data](https://www.kaggle.com/datasets/thedevastator/better-recipes-for-a-better-life). It's built in [Next.js](https://nextjs.org/), which can be deployed to Netlify with ease, and connects to PostgreSQL with [Prisma](https://www.prisma.io/) and Aiven for Caching with [ioredis](https://www.npmjs.com/package/ioredis).

The source code for the application is available on GitHub at https://github.com/Aiven-Labs/nextjs-netlify.

## Before you begin

Before starting the tutorial, do the following if you haven't already:

1. Sign up to [Aiven](https://console.aiven.io/signup).
1. Sign up to [Netlify](https://app.netlify.com/signup).
1. Install the [GitHub CLI](https://github.com/cli/cli#installation).
1. Install the [Netlify CLI](https://docs.netlify.com/cli/get-started/).

## Create free PostgreSQL and Aiven for Caching services

Follow the instructions below to create your free Aiven for PostgreSQL and Aiven for Caching services. You can read more about the Aiven free plans in the [Aiven documentation](https://docs.aiven.io/docs/platform/concepts/free-plan).

1. Login to the [Aiven Console](https://console.aiven.io).
1. Choose the project you want your service to be in.
1. On the **Services** page, click **Create service**.
1. Select the service you want to create, either **PostgreSQL** or **Aiven for Caching**.
1. Select **DigitalOcean** as the cloud provider and choose the region.

    We recommend using `do-nyc` in the North America region to minimise latency, as this region will be closest to where the Netlify free plan deploys its functions. However, the Aiven free plans are currently available in the following regions and you can pick whichever you like:
    * EMEA: `do-ams` (Amsterdam), `do-ldn` (London), `do-fra` (Frankfurt)
    * Americas: `do-nyc` (New York), `do-sfo` (San Francisco), `do-tor` (Toronto)
    * APAC: `do-blr` (Bangalore)

1. Select the **Free** plan.
1. Optionally, choose a descriptive name for the service.
1. Click **Create free service**.

## Get the application code

To deploy the application to Netlify you'll need your own fork of the [Aiven-Labs/nextjs-netlify](https://github.com/Aiven-Labs/nextjs-netlify) GitHub repository.
See the [GitHub CLI instructions to fork the repository](https://docs.github.com/en/get-started/quickstart/fork-a-repo?tool=cli#forking-a-repository).

For instance, to fork and clone the repository with GitHub CLI:

```shell
gh repo fork https://github.com/Aiven-Labs/nextjs-netlify.git \
    --clone --remote
```

> **Tip** You can change the name of the forked repository by adding `--fork-name <name>` to the command.

## Deploy the application

Follow the instructions below to configure continuous deployment. This will automatically deploy your changes.

1. Navigate to the `nextjs-netlify` directory on your local machine:

    ```shell
    cd nextjs-netlify
    ```

1. Sign into your Netlify account to obtain the access token:

    ```shell
    netlify login
    ```

1. Configure continuous deployment:

    Start and follow the automated setup process. Choose to create a new site, and then select the default options for other prompts. Note that you will be required to authorize Netlify with GitHub. You can do so either through `app.netlify.com` or with a GitHub personal access token.

    ```shell
    netlify init
    ```

1. Open the Netlify site admin user interface:

    ```shell
    netlify open --admin
    ```

1. Configure the site in Netlify:

    1. Go to **Site configuration**.
    1. Go to **Environment variables**.
    1. Add variable `DATABASE_URL`:

        Copy the PostgreSQL database URI from the service's **Overview** page in the Aiven console and paste it in as the `DATABASE_URL` value.
        
        * To create a new database, replace `defaultdb` with the new database name.
        * To configure the schema for the application, add `&schema=public` to the end of the URI.

        The PostgreSQL URI will be in this form (shown with `&schema=public` added):
        ```
        postgres://user:password@host:port/defaultdb?sslmode=require&schema=public
        ```

    1. Add variable `REDIS_URI`:

        Copy the Redis URI from the service's **Overview** page in the Aiven console and paste it in as the `REDIS_URI` value.

        The Redis URI will be in this form:
        ```
        rediss://user:password@host:port
        ```


1. Deploy the site:

    Go to the **Deploys** section in Netlify and trigger the deployment by clicking the `Trigger deploy` button.

    > **Note:** The database migrations and seed are done during the Netlify deployment process. Make sure you have the PostgreSQL database up and running when deploying to achieve a working environment on the first try.
     
1. Visit the deployed site:

    Open the site from the Netlify admin user interface or from the command line with:

    ```shell
     netlify open --site
    ```
    
    > **Tip** When the site starts up, choose **Recipes** at the top left of the window to go to the main part of the app.

Congratulations, you have now successfully deployed your application. Any subsequent changes you push will automatically be deployed to your site.

## Use the application

This example application has a **Home** page with some relevant links and a **Recipes** page where you can browse and inspect recipes. You can like recipes that seem interesting and filter the list to show only liked ones. Furthermore, you can see interesting statistics from all of the recipes and those that are liked.

Aiven for PostgreSQL is used as the database for storing all recipes and whether they are liked or not. Aiven for Caching is not necessary for the app to function, but using it means that statistics are cached to offer faster response times. You can toggle the use of Caching on and off, and the response times will be shown in the app to demonstrate the difference.

## Find out more

For more information, see the

* [Aiven documentation](https://aiven.io/docs)
* [Aiven for PostgreSQL documentation](https://aiven.io/docs/products/postgresql)
* [Aiven for Caching documentation](https://aiven.io/docs/products/caching)
* [Netlify CLI Command list](https://cli.netlify.com/)

<!-- The following text does not go into the final tutorial, as the tutorial footer provides it -->

-------

*PostgreSQL is a trademark or registered trademark of the PostgreSQL Community Association of Canada, and used with their permission. \*Redis is a registered trademark of Redis Ltd. Any rights therein are reserved to Redis Ltd. Any use by Aiven is for referential purposes only and does not indicate any sponsorship, endorsement or affiliation between Redis and Aiven. All product and service names used in this website are for identification purposes only and do not imply endorsement.*
