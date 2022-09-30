import * as React from "react";
import "../styles/globals.css";
import type { AppProps } from "next/app";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import UserProvider from "../state/UserContext";
import ModalProvider from "../state/ModalContext";
import Modal from "../components/Elements/Modal/Modal";

const queryClient = new QueryClient();

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <QueryClientProvider client={queryClient}>
      <UserProvider>
        <ModalProvider>
          <Modal />
          <Component {...pageProps} />
        </ModalProvider>
      </UserProvider>
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
}

export default MyApp;
