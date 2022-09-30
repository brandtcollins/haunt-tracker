import Head from "next/head";
import { FunctionComponent, ReactNode } from "react";
import Header from "../Header/Header";
interface LayoutProps {
  children: ReactNode;
  title: string;
}

const Layout: FunctionComponent<LayoutProps> = ({ children, title }) => {
  return (
    <>
      <Head>
        <title>{title} - Haunt Tracker</title>
        <meta property="og:title" content={title} key={title} />
      </Head>
      <div className="min-h-full">
        <div className="bg-darkGray-500 pb-32">
          <Header />
          <header className="py-10">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
              <h1 className="text-3xl font-bold tracking-tight text-white">
                {title}
              </h1>
            </div>
          </header>
        </div>

        <main className="-mt-32 bg-darkGray-500 min-h-screen">
          <div className="mx-auto max-w-7xl px-4 pb-12 sm:px-6 lg:px-8">
            <div className="rounded-lg bg-darkGray-300 px-5 py-6 shadow sm:px-6">
              {children}
            </div>
          </div>
        </main>
      </div>
    </>
  );
};

export default Layout;
