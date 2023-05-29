import { Typography } from "@aivenio/aquarium";
import Head from "next/head";

export default function Home() {
  return (
    <>
      <Head>
        <title>Recipe library powered by Aiven and Netlify</title>
        <meta
          name="description"
          content="Recipe library built with Next.js, PostgreSQL, Redis, OpenSearch and Netlify"
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main>
        <Typography.LargeHeading>
          Recipe library built with Next.js and hosted by Netlify. Utilizing
          Aiven for PostgreSQL, Redis and OpenSearch.
        </Typography.LargeHeading>
      </main>
    </>
  );
}
