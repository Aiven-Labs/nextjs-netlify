import { Box, Typography } from '@aivenio/aquarium';
import Image from 'next/image';

import styles from './styles.module.css';

export const Footer: React.FC = () => (
  <footer className={styles.footer}>
    <Box display="flex" gap="3" justifyContent="center" className="flex-wrap">
      <Typography>Free template by</Typography> <Image src="/footer-logo.svg" width={75} height={25} alt="Aiven logo" />
      <Typography.Small>
        PostgreSQL is a trademark or registered trademark of the PostgreSQL Community Association of Canada, and used
        with their permission. *Redis is a registered trademark of Redis Ltd. Any rights therein are reserved to Redis
        Ltd. Any use by Aiven is for referential purposes only and does not indicate any sponsorship, endorsement or
        affiliation between Redis and Aiven. All product and service names used in this website are for identification
        purposes only and do not imply endorsement.
      </Typography.Small>
    </Box>
  </footer>
);
