"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { SafeImage } from "~/components";
import { AuthModal } from "./_components";

export default function LandingPage() {
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const { data: session } = useSession();
  const router = useRouter();

  const handleGetStarted = () => {
    if (session) {
      router.push("/collection");
    } else {
      setIsAuthModalOpen(true);
    }
  };

  return (
    <div className="min-h-[40vh] bg-transparent">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="mx-auto max-w-7xl">
          <div className="relative z-10 bg-transparent pb-8 sm:pb-16 md:pb-20 lg:w-full lg:max-w-2xl lg:pb-28 xl:pb-32">
            <main className="mx-auto mt-10 max-w-7xl px-4 sm:mt-12 sm:px-6 md:mt-16 lg:mt-20 lg:px-8 xl:mt-28">
              <div className="sm:text-center lg:text-left">
                <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl md:text-6xl">
                  <span className="block xl:inline">Discover </span>
                  <span className="block font-bold text-red-600 xl:inline">
                    your Pokemon
                  </span>
                  <span className="block xl:inline"> adventure</span>
                </h1>
                <p className="mt-3 text-base text-gray-600 sm:mx-auto sm:mt-5 sm:max-w-xl sm:text-lg md:mt-5 md:text-xl lg:mx-0">
                  Catch them all like never before — browse, track, and complete
                  your Pokédex with every Pokémon ever created.
                </p>

                <div className="mt-8 sm:mt-10 sm:flex sm:justify-center lg:justify-start">
                  <button
                    onClick={handleGetStarted}
                    className="flex w-full transform items-center justify-center rounded-md border border-transparent bg-red-500 px-8 py-3 text-base font-medium text-white shadow-lg transition-colors transition-transform duration-200 hover:-translate-y-0.5 hover:bg-red-600 hover:shadow-xl md:px-10 md:py-4 md:text-lg"
                  >
                    {session ? "View My Collection" : "Start Adventure"}
                    <span className="ml-2">→</span>
                  </button>
                </div>
              </div>
            </main>
          </div>
        </div>

        {/* Pokemon Images */}
        <div className="lg:absolute lg:inset-y-0 lg:right-0 lg:w-1/2">
          <div className="flex h-56 w-full items-center justify-center sm:h-72 md:h-96 lg:h-full lg:w-full">
            <div className="relative">
              {/* Main Pokemon */}
              <div className="relative z-10">
                <SafeImage
                  src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/244.png"
                  alt="Entei"
                  width={300}
                  height={300}
                  className="h-64 w-64 object-contain sm:h-80 sm:w-80"
                  priority
                />
              </div>

              {/* Secondary Pokemon */}
              <div className="absolute -top-4 -left-8 opacity-60">
                <SafeImage
                  src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/136.png"
                  alt="Flareon"
                  width={120}
                  height={120}
                  className="h-20 w-20 object-contain sm:h-24 sm:w-24"
                />
              </div>

              <div className="absolute -right-6 -bottom-6 opacity-60">
                <SafeImage
                  src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/467.png"
                  alt="Magmortar"
                  width={120}
                  height={120}
                  className="h-20 w-20 object-contain sm:h-24 sm:w-24"
                />
              </div>

              <div className="absolute top-16 -right-12 opacity-40">
                <SafeImage
                  src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/157.png"
                  alt="Typhlosion"
                  width={100}
                  height={100}
                  className="h-16 w-16 object-contain sm:h-20 sm:w-20"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Auth Modal */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
      />
    </div>
  );
}
