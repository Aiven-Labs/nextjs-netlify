# Deploy a Netlify app built on Aiven

This tutorial guides you through deploying a [Netlify](https://www.netlify.com/) web application with an [Aiven for PostgreSQL®](https://aiven.io/postgresql) and [Aiven for Redis®](https://aiven.io/redis) backend.

The sample application used in this tutorial is a cooking recipe library displaying open source [recipe data](https://www.kaggle.com/datasets/thedevastator/better-recipes-for-a-better-life). It's built in [Next.js](https://nextjs.org/), which can be deployed to Netlify with ease, and connects to PostgreSQL with [Prisma](https://www.prisma.io/) and Redis with [ioredis](https://www.npmjs.com/package/ioredis).

The source code for the application is available on GitHub at https://github.com/aiven/nextjs-netlify.

# Before you begin

Before starting the tutorial, do the following:

1. If you haven't already, sign up to [Aiven](https://console.aiven.io/signup).
1. If you haven't already, sign up to [Netlify](https://app.netlify.com/signup).

# Step 1. Create free PostgreSQL and Redis services

Follow the instructions below to create your free PostgreSQL and Redis services with Aiven. You can read more about the Aiven free plans in the [Aiven documentation](https://docs.aiven.io/docs/platform/concepts/free-plan).

1. Login to [Aiven Console](https://console.aiven.io).
1. In the project you want to create a service in, go to **Services**.
1. On the **Services** page, click **Create service**.
1. Select the service you want to create, either **PostgreSQL** or **Redis**.
1. Select **AWS** as the cloud provider and choose the region.

    We recommend using `us-east-1` to minimise latency, as this region will be closest to where the Netlify functions are deployed if using their free plan. However, the Aiven free plans are currently available in the following regions and you can pick whichever you like:
    * EMEA: aws-eu-north-1, aws-eu-west-1, aws-eu-west-2, aws-eu-west-3
    * Americas: aws-us-east-1, aws-us-east-2, aws-us-west-2, aws-ca-central-1
    * APAC: aws-ap-south-1

1. Select **Free** plan.
1. Click **Create free service**.

# Step 2. Get the application code

To deploy the application to Netlify you'll need to have your own GitHub repository for [aiven/nextjs-netlify](https://github.com/aiven/nextjs-netlify). If you have the [GitHub CLI](https://github.com/cli/cli#installation) installed, you can simply follow the instructions below to fork the repository. Otherwise, see the relevant [GitHub instructions](https://docs.github.com/en/get-started/quickstart/fork-a-repo?tool=webui#forking-a-repository).


Fork and clone the forked repository with GitHub CLI

```
gh repo fork https://github.com/aiven/nextjs-netlify.git --clone --remote
```

You can name the repository by adding `--fork-name <name>` to the command.

# Step 3. Deploy the application

Follow the instructions below to configure continuous deployment. This will automatically deploy your changes. Make sure to run the commands in the root directory of the repository.

1. Install Netlify CLI:

    ```
    npm install netlify-cli -g
    ```

1. Sign into your Netlify account to obtain the access token:

    ```
    netlify login
    ```

1. Configure continuous deployment:

    Start and follow the automated setup process. Choose to create a new site, and then select the default options other prompts. Note that you will be required to authorize Netlify with GitHub.

    ```
    netlify init
    ```

1. Open the Netlify site admin user interface:

    ```
    netlify open --admin
    ```

1. Configure the site in Netlify:

    1. Go to **Site configuration**.
    1. Go to **Environment variables**.
    1. Add variable `DATABASE_URL`:

        Copy the PostgreSQL database URI from the `Service Overview` page in the Aiven console and paste it in as the `DATABASE_URL` value.
        
        * To create a new database, replace `defaultdb` with the new database name.
        * To configure the schema for the application, add `&schema=public` to the end of the URI.

        Example URI below:
        ```
        postgres://user:password@host:port/defaultdb?sslmode=require&schema=public
        ```

    1. Add variable `REDIS_URI`:

        Copy the Redis URI from the `Service Overview` page in the Aiven console and paste it in as the `REDIS_URI` value.

        Example URI below:
        ```
        rediss://user:password@host:port
        ```


1. Deploy the site:

    Go to the **Deploys** section in Netlify and trigger the deployment by clicking the `Trigger deploy` -button.

    **NOTE:** The database migrations and seed are done during the Netlify deployment process. Make sure you have the PostgreSQL database up and running when deploying to achieve a working environment on the first try.
     
1. Visit the deployed site:

    Open the site from the Netlify admin user interface or from the command line with:

    ```
     netlify open --site
    ```

Congratulations, you have now successfully deployed your application. Any subsequent changes you push will automatically be deployed to your site.

# Step 4. Use the application

This example application has a **Home** page with some relevant links and a **Recipes** page where you can browse and inspect recipes. You can like recipes that seem interesting and filter the list to show only liked ones. Furthermore, you can see interesting statistics from all of the recipes and those that are liked.

Aiven for PostgreSQL is used as the database for storing all recipes and whether they are liked or not. Aiven for Redis is optional for the app to function, but when configured statistics are cached to offer faster response time. You are able to toggle Redis on and off. The database response times are shown in the app to demonstrate the difference.

# For more information, see

* [Aiven documentation](docs.aiven.io)
* [Netlify CLI Command list](https://cli.netlify.com/)
