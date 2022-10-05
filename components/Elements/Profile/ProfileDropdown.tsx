import { Disclosure, Menu, Transition } from "@headlessui/react";
import Link from "next/link";
import { Fragment, FunctionComponent } from "react";
import { useUserContext } from "../../../state/UserContext";
import { iUserNavigationProps } from "../../../ts/Interfaces";
import { classNames } from "../../../utils/HelperFunctions";
import Avatar from "../Avatar";

interface ProfileDropdownProps {
  userNavigation: iUserNavigationProps[];
}

const ProfileDropdown: FunctionComponent<ProfileDropdownProps> = ({
  userNavigation,
}) => {
  const { username, website, avatarUrl } = useUserContext();

  return (
    <Menu as="div" className="relative ml-3">
      <div>
        <Menu.Button className="flex max-w-xs items-center rounded-full bg-gray-800 text-sm focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800">
          <span className="sr-only">Open user menu</span>
          <Avatar username={username} url={avatarUrl} />
        </Menu.Button>
      </div>
      <Transition
        as={Fragment}
        enter="transition ease-out duration-100"
        enterFrom="transform opacity-0 scale-95"
        enterTo="transform opacity-100 scale-100"
        leave="transition ease-in duration-75"
        leaveFrom="transform opacity-100 scale-100"
        leaveTo="transform opacity-0 scale-95"
      >
        <Menu.Items className="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
          {userNavigation.map((item) => (
            <Menu.Item key={item.name}>
              {({ active }) => (
                <Link key={item.name} href={item.href} passHref>
                  <a
                    onClick={item.onClick}
                    className={classNames(
                      active ? "bg-gray-100" : "",

                      "block px-4 py-2 text-sm text-gray-700"
                    )}
                  >
                    {item.name}
                  </a>
                </Link>
              )}
            </Menu.Item>
          ))}
        </Menu.Items>
      </Transition>
    </Menu>
  );
};

export default ProfileDropdown;
