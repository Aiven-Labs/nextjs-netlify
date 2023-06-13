import React from "react";
import Image from "next/image";
import styles from "./styles.module.css";
import { Typography } from "@aivenio/aquarium";

export const Footer: React.FC = () => (
  <footer className={styles.footer}>
    <Typography>Free template by</Typography>{" "}
    <Image src="/footer-logo.svg" width={75} height={25} alt="Aiven logo" />
  </footer>
);
