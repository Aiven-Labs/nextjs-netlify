import { Box, Button, Link } from '@aivenio/aquarium';
import Image from 'next/image';
import { useRouter } from 'next/router';

import styles from './styles.module.css';

import { NavLink } from '@/components/NavLink/NavLink';

export const Navbar: React.FC = () => {
  const { pathname } = useRouter();

  return (
    <nav className={styles.navbar}>
      <Link href="/">
        <Image src="/logo.svg" width={140} height={50} alt="Aiven logo" />
      </Link>
      <Box marginLeft="5" display="flex" gap="5">
        <NavLink href="/" active={pathname === '/'}>
          Home
        </NavLink>
        <NavLink href="/recipes" active={pathname === '/recipes'}>
          Recipes
        </NavLink>
      </Box>
      <Box marginLeft="auto" className={styles.netlifyDeployButton}>
        <Button.ExternalLink href="https://github.com/aiven/nextjs-netlify" target="_blank">
          Deploy to Netlify
        </Button.ExternalLink>
      </Box>
    </nav>
  );
};
