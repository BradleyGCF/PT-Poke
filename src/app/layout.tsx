import "~/styles/globals.css";

import { Inter } from "next/font/google";
import { type Metadata } from "next";

import { TRPCReactProvider } from "~/trpc/react";
import { auth } from "~/server/auth";
import { SearchProvider } from "~/contexts/search-context";
import { ErrorBoundary } from "~/components";
import { ConditionalNavbar } from "~/app/_components";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "Pokemon App",
  description: "Track and explore Pokemon with our modern Pokedex",
  icons: [{ rel: "icon", url: "/favicon.ico" }],
};

export default async function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const session = await auth();
  
  const user = session?.user ? {
    name: session.user.name ?? 'User',
    email: session.user.email ?? '',
    imageUrl: session.user.image ?? '/favicon.ico', // Use local favicon as fallback
  } : null;

  return (
    <html lang="en" className={`${inter.variable} h-full`}>
      <body className="h-full bg-white" style={{
        background: 'radial-gradient(circle at 25% 50%, rgba(255, 140, 0, 0.12) 0%, rgba(255, 140, 0, 0.06) 35%, rgba(255, 255, 255, 1) 60%)'
      }}>
        <ErrorBoundary>
          <TRPCReactProvider>
            <SearchProvider>
              <div className="min-h-full">
                <ConditionalNavbar user={user} session={session} />
                <div className="py-10">
                  <main>
                    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
                      {children}
                    </div>
                  </main>
                </div>
              </div>
            </SearchProvider>
          </TRPCReactProvider>
        </ErrorBoundary>
      </body>
    </html>
  );
}
