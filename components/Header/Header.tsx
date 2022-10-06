import { Fragment, FunctionComponent, useEffect } from "react";
import { Disclosure, Menu, Transition } from "@headlessui/react";
import { classNames, signOut } from "../../utils/HelperFunctions";
import { Bars3Icon, XMarkIcon } from "@heroicons/react/24/outline";
import Avatar from "../Elements/Avatar";
import { useRouter } from "next/router";
import Link from "next/link";
import { useUserContext } from "../../state/UserContext";
import ProfileDropdown from "../Elements/Profile/ProfileDropdown";

interface HeaderProps {}

interface userNavigationProps {
  name: string;
  href: string;
  onClick?: any;
}

const Header: FunctionComponent<HeaderProps> = () => {
  const router = useRouter();
  const { username, website, avatarUrl, session } = useUserContext();
  const userNavigation: userNavigationProps[] = [
    { name: "My Activity", href: `/user/${username}/` },
    { name: "Profile Settings", href: "/user/settings" },
    { name: "Sign out", href: "#", onClick: signOut },
  ];

  const navigation = [
    {
      name: "Activity",
      href: "/activity",
      current: router.pathname === "/activity",
    },
    {
      name: "Haunts",
      href: "/haunts",
      current: router.pathname === "/haunts",
    },
  ];

  return (
    <Disclosure as="nav" className="bg-darkGray-500">
      {({ open }) => (
        <>
          <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
            <div className="border-b border-gray-700">
              <div className="flex h-16 items-center justify-between px-4 sm:px-0">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <Link href="/" passHref>
                      <img
                        className="ml-8 h-8 w-8 hover:cursor-pointer"
                        src="/images/haunt-tracker.png"
                        alt="Your Company"
                      />
                    </Link>
                  </div>
                  <div className="hidden md:block">
                    <div
                      className={`${
                        !session && "hidden"
                      } ml-10 flex items-baseline space-x-4 sticky top-0`}
                    >
                      {navigation.map((item) => (
                        <Link key={item.name} href={item.href} passHref>
                          <a
                            className={classNames(
                              item.current
                                ? "bg-darkGray-300 text-white"
                                : "text-gray-300 hover:bg-darkGray-300 hover:text-white",
                              "px-3 py-2 rounded-md text-sm font-medium"
                            )}
                            aria-current={item.current ? "page" : undefined}
                          >
                            {item.name}
                          </a>
                        </Link>
                      ))}
                    </div>
                  </div>
                </div>
                <div className="hidden md:block">
                  <div className="ml-4 flex items-center md:ml-6">
                    {session ? (
                      <ProfileDropdown userNavigation={userNavigation} />
                    ) : (
                      <>
                        <Link href={"/signin"}>
                          <a className="flex justify-center rounded-md border border-transparent bg-emerald-500 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-emerald-600 mx-2">
                            Sign In
                          </a>
                        </Link>
                        <Link href={"/signup"}>
                          <a className="flex justify-center rounded-md border-emerald-500 border-2 py-2 px-4 text-sm text-emerald-500 font-bold shadow-sm hover:bg-emerald-500 mx-2 hover:text-white">
                            Create an account
                          </a>
                        </Link>
                      </>
                    )}
                  </div>
                </div>
                <div className="-mr-2 flex md:hidden">
                  {/* Mobile menu button */}
                  <Disclosure.Button className="inline-flex items-center justify-center rounded-md bg-darkGray-300 p-2 text-emerald-500 hover:bg-darkGray-100">
                    <span className="sr-only">Open main menu</span>
                    {open ? (
                      <XMarkIcon className="block h-6 w-6" aria-hidden="true" />
                    ) : (
                      <Bars3Icon className="block h-6 w-6" aria-hidden="true" />
                    )}
                  </Disclosure.Button>
                </div>
              </div>
            </div>
          </div>

          <Disclosure.Panel className="border-b border-gray-700 md:hidden">
            <div className="space-y-1 px-2 py-3 sm:px-3">
              {navigation.map((item) => (
                <Disclosure.Button
                  key={item.name}
                  as="a"
                  href={item.href}
                  className={classNames(
                    item.current
                      ? "bg-darkgray-900 text-white"
                      : "text-gray-300 hover:bg-gray-700 hover:text-white",
                    "block px-3 py-2 rounded-md text-base font-medium"
                  )}
                  aria-current={item.current ? "page" : undefined}
                >
                  {item.name}
                </Disclosure.Button>
              ))}
            </div>
            {session ? (
              <>
                <div className="border-t border-darkGray-100 pt-4 pb-3">
                  <div className="flex items-center px-5">
                    <div className="flex-shrink-0">
                      <Avatar url={avatarUrl} username={username} />
                    </div>
                    <div className="ml-3">
                      <div className="text-base font-medium leading-none text-white">
                        {username}
                      </div>
                      <div className="text-sm font-medium leading-none text-gray-400">
                        {website}
                      </div>
                    </div>
                  </div>
                  <div className="mt-3 space-y-1 px-2">
                    {userNavigation.map((item) => (
                      <Disclosure.Button
                        key={item.name}
                        as="a"
                        href={item.href}
                        className="block rounded-md px-3 py-2 text-base font-medium text-gray-400 hover:bg-gray-700 hover:text-white"
                      >
                        {item.name}
                      </Disclosure.Button>
                    ))}
                  </div>
                </div>
              </>
            ) : (
              <>
                <Link href={"/signin"}>
                  <a className="flex mb-4 justify-center rounded-md border border-transparent bg-emerald-500 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-emerald-600 mx-2">
                    Sign In
                  </a>
                </Link>
                <Link href={"/signup"}>
                  <a className="flex justify-center rounded-md border-emerald-500 border-2 py-2 px-4 text-sm text-emerald-500 font-bold shadow-sm hover:bg-emerald-500 mx-2 hover:text-white">
                    Create an account
                  </a>
                </Link>
              </>
            )}
          </Disclosure.Panel>
        </>
      )}
    </Disclosure>
  );
};

export default Header;
