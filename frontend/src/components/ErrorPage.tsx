import { Link } from "react-router";
import XLogo from "./XLogo";

function ErrorPage() {
  return (
    <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center px-6">
      <Link
        to="/"
        className="text-white hover:opacity-80 transition-opacity"
        aria-label="Back to home"
      >
        <XLogo size={96} />
      </Link>

      <h1 className="mt-10 text-3xl md:text-4xl font-bold tracking-tight text-center">
        This page doesn’t exist
      </h1>
      <p className="mt-3 text-gray-500 text-center max-w-sm">
        Try searching for something else, or go back to the home page.
      </p>

      <Link
        to="/"
        className="mt-8 text-sky-500 font-bold hover:underline cursor-pointer"
      >
        Back to home
      </Link>
    </div>
  );
}

export default ErrorPage;
