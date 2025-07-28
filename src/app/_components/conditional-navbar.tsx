"use client";

import { usePathname } from "next/navigation";
import { signOut, useSession } from "next-auth/react";
import {
  Disclosure,
  DisclosureButton,
  DisclosurePanel,
  Menu,
  MenuButton,
  MenuItem,
  MenuItems,
} from "@headlessui/react";
import { Bars3Icon, XMarkIcon } from "@heroicons/react/24/outline";
import { SafeImage } from "~/components";
import { NavbarSearch } from "./navbar-search";
import { classNames, getUserAvatar } from "~/utils";
import Link from "next/link";

const navigation: { name: string; href: string; current: boolean }[] = [
  // { name: 'Pokemon', href: '/', current: true },
];

export function ConditionalNavbar() {
  const { data: session } = useSession();

  const user = session?.user
    ? {
        name: session.user.name ?? "User",
        email: session.user.email ?? "",
        imageUrl: getUserAvatar(session.user),
      }
    : null;
  const pathname = usePathname();

  // Hide navbar on Pokemon detail pages and landing page
  const isPokemonDetailPage =
    pathname?.startsWith("/pokemon/") && pathname !== "/pokemon";
  const isLandingPage = pathname === "/";

  if (isPokemonDetailPage || isLandingPage) {
    return null;
  }

  const handleSignOut = async () => {
    await signOut({ callbackUrl: "/" });
  };

  return (
    <Disclosure as="header" className="bg-white shadow-sm">
      <div className="mx-auto max-w-7xl px-2 sm:px-4 lg:divide-y lg:divide-gray-200 lg:px-8">
        <div className="relative flex h-16 justify-between">
          <div className="relative z-10 flex px-2 lg:px-0">
            <div className="flex shrink-0 items-center">
              <SafeImage
                alt="Pokemon Tracker"
                src="/logo.png"
                width={32}
                height={32}
                className="h-8 w-8"
                priority
              />
              <span className="ml-2 text-xl font-bold text-gray-900">
                Pokemon
              </span>
            </div>
          </div>

          <NavbarSearch />

          <div className="relative z-10 flex items-center lg:hidden">
            {/* Mobile menu button */}
            <DisclosureButton className="group relative inline-flex items-center justify-center rounded-md p-2 text-gray-600 hover:bg-gray-100 hover:text-gray-700 focus:ring-2 focus:ring-indigo-500 focus:outline-hidden focus:ring-inset">
              <span className="absolute -inset-0.5" />
              <span className="sr-only">Open menu</span>
              <Bars3Icon
                aria-hidden="true"
                className="block size-6 group-data-open:hidden"
              />
              <XMarkIcon
                aria-hidden="true"
                className="hidden size-6 group-data-open:block"
              />
            </DisclosureButton>
          </div>
          <div className="hidden lg:relative lg:z-10 lg:ml-4 lg:flex lg:items-center">
            {/* User menu dropdown */}
            {session && user ? (
              <Menu as="div" className="relative ml-4 shrink-0">
                <MenuButton className="relative flex rounded-full bg-white focus:outline-hidden focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2">
                  <span className="absolute -inset-1.5" />
                  <span className="sr-only">Open user menu</span>
                  <SafeImage
                    alt={`${user.name} avatar`}
                    src={user.imageUrl}
                    width={32}
                    height={32}
                    className="size-8 rounded-full"
                  />
                </MenuButton>

                <MenuItems
                  transition
                  className="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black/5 transition focus:outline-hidden data-closed:scale-95 data-closed:transform data-closed:opacity-0 data-enter:duration-100 data-enter:ease-out data-leave:duration-75 data-leave:ease-in"
                >
                  <MenuItem>
                    <button
                      onClick={handleSignOut}
                      className="block w-full px-4 py-2 text-left text-sm text-gray-700 data-focus:bg-gray-100 data-focus:outline-hidden"
                    >
                      Sign out
                    </button>
                  </MenuItem>
                </MenuItems>
              </Menu>
            ) : (
              <Link
                href="/api/auth/signin"
                className="ml-4 rounded-md bg-red-400 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-red-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-400"
              >
                Sign in
              </Link>
            )}
          </div>
        </div>
        <nav
          aria-label="Global"
          className="hidden lg:flex lg:space-x-8 lg:py-2"
        >
          {navigation.map((item) => (
            <a
              key={item.name}
              href={item.href}
              aria-current={item.current ? "page" : undefined}
              className={classNames(
                item.current
                  ? "bg-gray-100 text-gray-900"
                  : "text-gray-900 hover:bg-gray-50 hover:text-gray-900",
                "inline-flex items-center rounded-md px-3 py-2 text-sm font-medium",
              )}
            >
              {item.name}
            </a>
          ))}
        </nav>
      </div>

      <DisclosurePanel as="nav" aria-label="Global" className="lg:hidden">
        <div className="space-y-1 px-2 pt-2 pb-3">
          {navigation.map((item) => (
            <DisclosureButton
              key={item.name}
              as="a"
              href={item.href}
              aria-current={item.current ? "page" : undefined}
              className={classNames(
                item.current
                  ? "bg-gray-100 text-gray-900"
                  : "text-gray-900 hover:bg-gray-50 hover:text-gray-900",
                "block rounded-md px-3 py-2 text-base font-medium",
              )}
            >
              {item.name}
            </DisclosureButton>
          ))}
        </div>
        {session && user && (
          <div className="border-t border-gray-200 pt-4 pb-3">
            <div className="flex items-center px-4">
              <div className="shrink-0">
                <SafeImage
                  alt={`${user.name} avatar`}
                  src={user.imageUrl}
                  width={40}
                  height={40}
                  className="size-10 rounded-full"
                />
              </div>
              <div className="ml-3">
                <div className="text-base font-medium text-gray-800">
                  {user.name}
                </div>
                <div className="text-sm font-medium text-gray-600">
                  {user.email}
                </div>
              </div>
            </div>
            <div className="mt-3 space-y-1 px-2">
              <DisclosureButton
                as="button"
                onClick={handleSignOut}
                className="block w-full rounded-md px-3 py-2 text-left text-base font-medium text-gray-600 hover:bg-gray-50 hover:text-gray-900"
              >
                Sign out
              </DisclosureButton>
            </div>
          </div>
        )}
        {!session && (
          <div className="border-t border-gray-200 pt-4 pb-3">
            <div className="px-2">
              <Link
                href="/api/auth/signin"
                className="block rounded-md bg-red-400 px-3 py-2 text-base font-medium text-white shadow-sm hover:bg-red-500"
              >
                Sign in
              </Link>
            </div>
          </div>
        )}
      </DisclosurePanel>
    </Disclosure>
  );
}
