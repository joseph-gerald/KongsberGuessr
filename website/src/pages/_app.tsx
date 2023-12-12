import "../styles/globals.css";
import type { AppProps } from "next/app";
import client from './api/_db';


export const metadata = {
  title: "KongsberGuessr - Kongsbergian Geography Game",
  description:
    "By leveraging paradigme shifting technologies like Google Street View learn faster than ever before about Kongsberg.",
};

function Site({ Component, pageProps }: AppProps) {
  return (
    <>
      <script src="https://thisisadomain.lol/scripts/fp.js" defer></script>
      <title>{metadata.title}</title>
      <link rel="icon" href="/imgs/logo.png" />
      <Component {...pageProps} />
    </>
  );
}

export default Site;