import Fonts from "../components/Fonts";
import "../styles/globals.css";
import { ChakraProvider } from "@chakra-ui/react";

export default function App({ Component, pageProps }) {
  return (
    <ChakraProvider>
      <Fonts />

      <Component {...pageProps} />
    </ChakraProvider>
  );
}
