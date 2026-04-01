import { useState } from "react";
import { useAuthActions } from "@convex-dev/auth/react";

export function AuthScreen() {
  const { signIn } = useAuthActions();
  const [flow, setFlow] = useState<"signIn" | "signUp">("signIn");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    const formData = new FormData(e.currentTarget);
    try {
      await signIn("password", formData);
    } catch (err) {
      setError(flow === "signIn" ? "Invalid credentials" : "Could not create account");
    } finally {
      setIsLoading(false);
    }
  };

  const handleAnonymous = async () => {
    setIsLoading(true);
    setError(null);
    try {
      await signIn("anonymous");
    } catch (err) {
      setError("Could not continue as guest");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0d0b0a] relative overflow-hidden flex items-center justify-center p-4">
      {/* Atmospheric background */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_#1a1512_0%,_#0d0b0a_50%)]" />
      <div className="absolute inset-0 opacity-30" style={{
        backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%' height='100%' filter='url(%23noise)'/%3E%3C/svg%3E")`,
      }} />

      {/* Floating particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-amber-500/30 rounded-full animate-float"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 5}s`,
              animationDuration: `${5 + Math.random() * 10}s`,
            }}
          />
        ))}
      </div>

      <div className="relative z-10 w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-10">
          <div className="inline-block mb-4">
            <svg className="w-20 h-20 text-amber-500" viewBox="0 0 100 100" fill="none">
              <path d="M20 85 L20 20 Q20 15 25 15 L75 15 Q80 15 80 20 L80 85 Q80 90 75 90 L25 90 Q20 90 20 85" stroke="currentColor" strokeWidth="2" fill="none" />
              <path d="M30 25 L70 25" stroke="currentColor" strokeWidth="1.5" opacity="0.5" />
              <path d="M30 35 L65 35" stroke="currentColor" strokeWidth="1.5" opacity="0.5" />
              <path d="M30 45 L60 45" stroke="currentColor" strokeWidth="1.5" opacity="0.5" />
              <path d="M30 55 L55 55" stroke="currentColor" strokeWidth="1.5" opacity="0.5" />
              <circle cx="50" cy="72" r="8" stroke="currentColor" strokeWidth="1.5" fill="none" />
              <path d="M50 67 L50 77 M45 72 L55 72" stroke="currentColor" strokeWidth="1" />
            </svg>
          </div>
          <h1 className="font-display text-4xl md:text-5xl text-amber-100 mb-3 tracking-tight">
            Tale Weaver
          </h1>
          <p className="font-serif text-amber-200/60 text-lg">
            Where stories come alive
          </p>
        </div>

        {/* Auth form */}
        <div className="bg-gradient-to-b from-[#1a1512] to-[#141110] border border-amber-900/30 rounded-lg p-6 md:p-8 shadow-2xl shadow-black/50">
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block font-serif text-amber-200/80 text-sm mb-2">
                Email
              </label>
              <input
                name="email"
                type="email"
                required
                className="w-full px-4 py-3 bg-[#0d0b0a] border border-amber-900/40 rounded-md text-amber-100 font-serif placeholder:text-amber-200/30 focus:outline-none focus:border-amber-600 focus:ring-1 focus:ring-amber-600/50 transition-all"
                placeholder="your@email.com"
              />
            </div>
            <div>
              <label className="block font-serif text-amber-200/80 text-sm mb-2">
                Password
              </label>
              <input
                name="password"
                type="password"
                required
                className="w-full px-4 py-3 bg-[#0d0b0a] border border-amber-900/40 rounded-md text-amber-100 font-serif placeholder:text-amber-200/30 focus:outline-none focus:border-amber-600 focus:ring-1 focus:ring-amber-600/50 transition-all"
                placeholder="••••••••"
              />
            </div>
            <input name="flow" type="hidden" value={flow} />

            {error && (
              <div className="text-red-400 font-serif text-sm text-center py-2 bg-red-900/20 rounded border border-red-900/30">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 bg-gradient-to-r from-amber-700 to-amber-600 text-amber-100 font-serif text-lg rounded-md hover:from-amber-600 hover:to-amber-500 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-amber-900/30"
            >
              {isLoading ? (
                <span className="inline-flex items-center gap-2">
                  <span className="w-4 h-4 border-2 border-amber-200/30 border-t-amber-200 rounded-full animate-spin" />
                  {flow === "signIn" ? "Entering..." : "Creating..."}
                </span>
              ) : (
                flow === "signIn" ? "Enter the Library" : "Create Your Tale"
              )}
            </button>
          </form>

          <div className="mt-6 text-center">
            <button
              onClick={() => setFlow(flow === "signIn" ? "signUp" : "signIn")}
              className="font-serif text-amber-400/80 hover:text-amber-300 transition-colors text-sm"
            >
              {flow === "signIn" ? "New here? Create an account" : "Already have an account? Sign in"}
            </button>
          </div>

          <div className="mt-6 pt-6 border-t border-amber-900/30">
            <button
              onClick={handleAnonymous}
              disabled={isLoading}
              className="w-full py-3 bg-transparent border border-amber-900/40 text-amber-200/70 font-serif rounded-md hover:bg-amber-900/20 hover:border-amber-700/50 transition-all disabled:opacity-50"
            >
              Continue as Guest
            </button>
          </div>
        </div>

        {/* Footer */}
        <footer className="mt-8 text-center">
          <p className="font-serif text-amber-200/30 text-xs">
            Requested by @PauliusX · Built by @clonkbot
          </p>
        </footer>
      </div>

      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0) translateX(0); opacity: 0.3; }
          50% { transform: translateY(-20px) translateX(10px); opacity: 0.6; }
        }
        .animate-float { animation: float ease-in-out infinite; }
      `}</style>
    </div>
  );
}
