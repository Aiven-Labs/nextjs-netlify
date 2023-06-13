import React from "react";
import Image from "next/image";
import styles from "./styles.module.css";
import { Box, Button, Link } from "@aivenio/aquarium";
import { useRouter } from "next/router";
import { NavLink } from "../NavLink/NavLink";

export const Navbar: React.FC = () => {
  const { pathname } = useRouter();

  return (
    <nav className={styles.navbar}>
      <Link href="/">
        <Image src="/logo.svg" width={150} height={50} alt="Aiven logo" />
      </Link>
      <Box marginLeft="5" display="flex" gap="5">
        <NavLink href="/" active={pathname === "/"}>
          Home
        </NavLink>
        <NavLink href="/recipes" active={pathname === "/recipes"}>
          Recipes
        </NavLink>
      </Box>
      <Box marginLeft="auto" className={styles.netlifyDeployButton}>
        <Button.ExternalLink href="#">Deploy to Netlify</Button.ExternalLink>
      </Box>
    </nav>
  );
};
