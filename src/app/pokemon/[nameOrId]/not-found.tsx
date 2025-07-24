import Link from "next/link";
import { ArrowLeftIcon } from "@heroicons/react/24/outline";

export default function NotFound() {
  return (
    <div className="max-w-2xl mx-auto text-center py-16">
      <div className="mb-8">
        <div className="text-8xl mb-4">🔍</div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Pokemon Not Found
        </h1>
        <p className="text-gray-600 text-lg">
          The Pokemon you're looking for doesn't exist or may have been misnamed.
        </p>
      </div>

      <div className="space-y-4">
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
          <h3 className="font-semibold text-yellow-800 mb-2">Tips:</h3>
          <ul className="text-sm text-yellow-700 text-left space-y-1">
            <li>• Check the spelling of the Pokemon name</li>
            <li>• Try using the Pokemon's ID number instead</li>
            <li>• Use lowercase letters for the name</li>
            <li>• Make sure it's a valid Pokemon from generations I-IX</li>
          </ul>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link
            href="/"
            className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-orange-400 hover:bg-orange-500 transition-colors"
          >
            <ArrowLeftIcon className="mr-2 h-5 w-5" />
            Back to Pokemon List
          </Link>
          
          <Link
            href="/"
            className="inline-flex items-center justify-center px-6 py-3 border border-gray-300 text-base font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 transition-colors"
          >
            Search Again
          </Link>
        </div>
      </div>
    </div>
  );
} 