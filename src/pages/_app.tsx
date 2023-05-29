import { Context } from '@aivenio/aquarium';

import '@aivenio/aquarium/dist/styles.css';
import '@/styles/globals.css';

import type { AppProps } from 'next/app';

import { Layout } from '@/components/Layout/Layout';
import { AppContextProvider } from '@/context';

export default function App({ Component, pageProps }: AppProps) {
  return (
    <Context>
      <AppContextProvider>
        <Layout>
          <Component {...pageProps} />
        </Layout>
      </AppContextProvider>
    </Context>
  );
}
