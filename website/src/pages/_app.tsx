import "../styles/globals.css";
import type { AppProps } from "next/app";

export const metadata = {
  title: "KongsberGuessr - Kongsbergian Geograpahy Game",
  description:
    "By leveraging paradigme shifting technologies like Google Street View learn faster than ever before about Kongsberg.",
};

function Site({ Component, pageProps }: AppProps) {
  return (
    <>
      <Component {...pageProps} />
    </>
  );
}

export default Site;