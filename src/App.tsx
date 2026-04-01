import { useConvexAuth } from "convex/react";
import { AuthScreen } from "./components/AuthScreen";
import { StorytellerApp } from "./components/StorytellerApp";

export default function App() {
  const { isAuthenticated, isLoading } = useConvexAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#0d0b0a] flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 mx-auto mb-6 relative">
            <div className="absolute inset-0 border-2 border-amber-600/30 rounded-full animate-ping" />
            <div className="absolute inset-2 border-2 border-amber-500/50 rounded-full animate-pulse" />
            <div className="absolute inset-4 bg-amber-500/20 rounded-full" />
          </div>
          <p className="font-serif text-amber-200/60 text-lg tracking-wide animate-pulse">
            Opening the tome...
          </p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <AuthScreen />;
  }

  return <StorytellerApp />;
}
