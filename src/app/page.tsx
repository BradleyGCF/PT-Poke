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
          <div className="relative z-10 pb-8 bg-transparent sm:pb-16 md:pb-20 lg:w-full lg:max-w-2xl lg:pb-28 xl:pb-32">
            <main className="mx-auto mt-10 max-w-7xl px-4 sm:mt-12 sm:px-6 md:mt-16 lg:mt-20 lg:px-8 xl:mt-28">
              <div className="sm:text-center lg:text-left">
                                  <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl md:text-6xl">
                    <span className="block xl:inline">Discover </span>
                    <span className="block text-red-600 font-bold xl:inline">your Pokemon</span>
                    <span className="block xl:inline"> adventure</span>
                  </h1>
                <p className="mt-3 text-base text-gray-600 sm:mt-5 sm:text-lg sm:max-w-xl sm:mx-auto md:mt-5 md:text-xl lg:mx-0">
                Catch them all like never before — browse, track, and complete your Pokédex with every Pokémon ever created.
                </p>

                <div className="mt-8 sm:mt-10 sm:flex sm:justify-center lg:justify-start">
                  <button
                    onClick={handleGetStarted}
                    className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-white bg-red-500 hover:bg-red-600 md:py-4 md:text-lg md:px-10 transition-colors duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-transform"
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
          <div className="h-56 w-full sm:h-72 md:h-96 lg:w-full lg:h-full flex items-center justify-center">
            <div className="relative">
              {/* Main Pokemon */}
              <div className="relative z-10">
                <SafeImage
                  src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/244.png"
                  alt="Entei"
                  width={300}
                  height={300}
                  className="w-64 h-64 sm:w-80 sm:h-80 object-contain"
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
                  className="w-20 h-20 sm:w-24 sm:h-24 object-contain"
                />
              </div>
              
              <div className="absolute -bottom-6 -right-6 opacity-60">
                <SafeImage
                  src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/467.png"
                  alt="Magmortar"
                  width={120}
                  height={120}
                  className="w-20 h-20 sm:w-24 sm:h-24 object-contain"
                />
              </div>
              
              <div className="absolute top-16 -right-12 opacity-40">
                <SafeImage
                  src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/157.png"
                  alt="Typhlosion"
                  width={100}
                  height={100}
                  className="w-16 h-16 sm:w-20 sm:h-20 object-contain"
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
