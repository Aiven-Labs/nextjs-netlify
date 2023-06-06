import React, { PropsWithChildren } from "react";
import { Navbar } from "../Navbar/Navbar";
import { Footer } from "../Footer/Footer";
import Head from "next/head";
import styles from "./styles.module.css";
import { Alert } from "@aivenio/aquarium";
import { useAppContext } from "@/context";

export const Layout: React.FC<PropsWithChildren<{}>> = ({ children }) => {
  const { alert } = useAppContext();

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
      <Navbar />
      <main className={styles.main}>
        {alert && <Alert {...alert} />}
        {children}
      </main>
      <Footer />
    </>
  );
};
