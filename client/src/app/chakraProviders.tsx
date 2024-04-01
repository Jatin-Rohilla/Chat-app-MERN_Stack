"use client";

import { ChakraProvider, extendTheme } from "@chakra-ui/react";

const theme = extendTheme({
  styles: {
    global: {
      "::-webkit-scrollbar": {
        width: "5px",
        borderRadius: "10px",
      },
      "::-webkit-scrollbar-track": {
        backgroundColor: "gray.100",
      },
      "::-webkit-scrollbar-thumb": {
        backgroundColor: "gray.300",
      },
      "::-webkit-scrollbar-thumb:hover": {
        backgroundColor: "gray.400",
      },
    },
  },
});

export function Providers({ children }: { children: React.ReactNode }) {
  return <ChakraProvider theme={theme}>{children}</ChakraProvider>;
}
