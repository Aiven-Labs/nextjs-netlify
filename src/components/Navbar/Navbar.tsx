import React from "react";
import Image from "next/image";
import styles from "./styles.module.css";
import { Box, Button, Link } from "@aivenio/aquarium";

export const Navbar: React.FC = () => (
  <nav className={styles.navbar}>
    <Link href="/">
      <Image src="/logo.svg" width={150} height={50} alt="Aiven logo" />
    </Link>
    <Box marginLeft="5" display="flex" gap="5">
      <Link href="/">Home</Link>
      <Link href="/recipes">Recipes</Link>
    </Box>
    <Box marginLeft="auto" className={styles.netlifyDeployButton}>
      <Button.ExternalLink href="#">Deploy to Netlify</Button.ExternalLink>
    </Box>
  </nav>
);
