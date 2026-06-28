import { useSearchParams } from "react-router";
import { UserRound } from "lucide-react";
import XLogo from "./XLogo";

function GitHubIcon() {
  return (
    <svg viewBox="0 0 24 24" width={20} height={20} aria-hidden="true" fill="currentColor">
      <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z" />
    </svg>
  );
}

function Login() {
  const [searchParams] = useSearchParams();
  const errorCode = searchParams.get("error");

  const errorMessages: Record<string, string> = {
    oauth_failed: "GitHub authentication declined or failed.",
    server_error: "Something went wrong on our database server.",
    no_user: "Could not retrieve user details from GitHub.",
    github_declined: "You declined to sign in with Github",
  };

  function signInWithGithub(e: React.FormEvent) {
    e.preventDefault();
    window.location.href = `${import.meta.env.VITE_BACKEND}/auth/github`;
  }

  return (
    <div className="min-h-screen flex text-white">
      <div className="hidden lg:flex flex-1 items-center justify-center relative overflow-hidden bg-black">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_40%,rgba(29,155,240,0.15),transparent_50%),radial-gradient(circle_at_70%_60%,rgba(120,86,255,0.12),transparent_45%)]" />
        <div className="relative flex flex-col items-center gap-6">
          <XLogo size={320} className="text-white opacity-90" />
          <p className="text-2xl text-gray-400 max-w-sm">
            Join the conversation.
          </p>
        </div>
      </div>

      <div className="flex-1 flex items-center justify-center px-6 py-12">
        <div className="w-full max-w-[400px] text-left">
          <XLogo size={40} className="mb-12" />

          <h1 className="text-6xl font-bold leading-[1.1] mb-10 tracking-tight">
            See what's happening in the world right now
          </h1>

          <p className="text-2xl font-bold mb-6">Join today.</p>

          <div className="space-y-3 mb-8">
            <button
              type="button"
              className="w-full flex items-center justify-center gap-3 border border-gray-600 rounded-full py-3 px-4 font-bold hover:bg-white/10 transition-colors cursor-pointer"
            >
              <UserRound size={20} />
              Continue as guest
            </button>

            <form onSubmit={signInWithGithub}>
              <button
                type="submit"
                className="w-full flex items-center justify-center gap-3 bg-white text-black rounded-full py-3 px-4 font-bold hover:bg-gray-200 transition-colors cursor-pointer"
              >
                <GitHubIcon />
                Sign in with GitHub
              </button>
            </form>
          </div>

          {errorCode && errorMessages[errorCode] && (
            <p className="text-red-400 text-sm mb-4">{errorMessages[errorCode]}</p>
          )}

          <p className="text-gray-500 text-xs leading-relaxed">
            By signing up, you agree to the Terms of Service and Privacy Policy.
          </p>
        </div>
      </div>
    </div>
  );
}

export default Login;
