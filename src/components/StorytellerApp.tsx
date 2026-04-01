import { useState, useRef, useEffect } from "react";
import { useQuery, useMutation, useAction } from "convex/react";
import { useAuthActions } from "@convex-dev/auth/react";
import { api } from "../../convex/_generated/api";
import { Id } from "../../convex/_generated/dataModel";

type Message = {
  _id: Id<"messages">;
  role: "user" | "assistant";
  content: string;
  createdAt: number;
};

type Story = {
  _id: Id<"stories">;
  userId: Id<"users">;
  title: string;
  genre?: string;
  createdAt: number;
  updatedAt: number;
};

const STORY_PROMPTS = [
  "Tell me a tale of a dragon who was afraid of fire",
  "Weave a story about a kingdom made of glass",
  "Share a legend of the last lighthouse keeper",
  "Narrate an adventure in the forest of whispers",
];

export function StorytellerApp() {
  const { signOut } = useAuthActions();
  const stories = useQuery(api.stories.list) ?? [];
  const [currentStoryId, setCurrentStoryId] = useState<Id<"stories"> | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isCreatingStory, setIsCreatingStory] = useState(false);

  const createStory = useMutation(api.stories.create);
  const deleteStory = useMutation(api.stories.remove);

  const handleNewStory = async () => {
    setIsCreatingStory(true);
    try {
      const id = await createStory({
        title: "New Tale",
        genre: "fantasy"
      });
      setCurrentStoryId(id);
      setSidebarOpen(false);
    } finally {
      setIsCreatingStory(false);
    }
  };

  const handleDeleteStory = async (id: Id<"stories">) => {
    if (currentStoryId === id) {
      setCurrentStoryId(null);
    }
    await deleteStory({ id });
  };

  return (
    <div className="min-h-screen bg-[#0d0b0a] flex flex-col">
      {/* Background texture */}
      <div className="fixed inset-0 bg-[radial-gradient(ellipse_at_top,_#1a1512_0%,_#0d0b0a_50%)] pointer-events-none" />
      <div className="fixed inset-0 opacity-20 pointer-events-none" style={{
        backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%' height='100%' filter='url(%23noise)'/%3E%3C/svg%3E")`,
      }} />

      <div className="relative z-10 flex flex-col flex-1">
        {/* Header */}
        <header className="flex-shrink-0 border-b border-amber-900/30 bg-[#0d0b0a]/80 backdrop-blur-sm">
          <div className="flex items-center justify-between px-4 py-3 md:px-6">
            <div className="flex items-center gap-3">
              <button
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="p-2 text-amber-400/70 hover:text-amber-300 transition-colors lg:hidden"
                aria-label="Toggle sidebar"
              >
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>
              <div className="flex items-center gap-2">
                <svg className="w-8 h-8 text-amber-500" viewBox="0 0 100 100" fill="none">
                  <path d="M20 85 L20 20 Q20 15 25 15 L75 15 Q80 15 80 20 L80 85 Q80 90 75 90 L25 90 Q20 90 20 85" stroke="currentColor" strokeWidth="2.5" fill="none" />
                  <circle cx="50" cy="52" r="12" stroke="currentColor" strokeWidth="2" fill="none" />
                </svg>
                <h1 className="font-display text-xl md:text-2xl text-amber-100">Tale Weaver</h1>
              </div>
            </div>
            <button
              onClick={() => signOut()}
              className="px-3 py-1.5 text-amber-400/70 hover:text-amber-300 font-serif text-sm border border-amber-900/40 rounded hover:bg-amber-900/20 transition-all"
            >
              Sign Out
            </button>
          </div>
        </header>

        <div className="flex flex-1 overflow-hidden">
          {/* Sidebar */}
          <aside className={`
            fixed inset-y-0 left-0 z-40 w-72 bg-[#0d0b0a]/95 backdrop-blur-md border-r border-amber-900/30 transform transition-transform duration-300 lg:relative lg:translate-x-0 pt-16 lg:pt-0
            ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}
          `}>
            <div className="flex flex-col h-full">
              <div className="p-4 border-b border-amber-900/30">
                <button
                  onClick={handleNewStory}
                  disabled={isCreatingStory}
                  className="w-full py-3 bg-gradient-to-r from-amber-800/50 to-amber-700/50 border border-amber-700/50 text-amber-100 font-serif rounded-md hover:from-amber-700/50 hover:to-amber-600/50 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  {isCreatingStory ? (
                    <span className="w-4 h-4 border-2 border-amber-200/30 border-t-amber-200 rounded-full animate-spin" />
                  ) : (
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                  )}
                  Begin New Tale
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-3 space-y-2">
                <p className="px-2 py-1 text-amber-400/50 font-serif text-xs uppercase tracking-wider">Your Stories</p>
                {stories.length === 0 && (
                  <p className="px-2 py-4 text-amber-200/40 font-serif text-sm text-center italic">
                    No tales yet. Begin your first story!
                  </p>
                )}
                {stories.map((story: Story) => (
                  <div
                    key={story._id}
                    className={`group flex items-center gap-2 p-3 rounded-md cursor-pointer transition-all ${
                      currentStoryId === story._id
                        ? "bg-amber-900/30 border border-amber-700/50"
                        : "hover:bg-amber-900/20 border border-transparent"
                    }`}
                    onClick={() => {
                      setCurrentStoryId(story._id);
                      setSidebarOpen(false);
                    }}
                  >
                    <div className="w-2 h-10 bg-gradient-to-b from-amber-600 to-amber-800 rounded-sm flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <p className="font-serif text-amber-100 truncate text-sm">{story.title}</p>
                      <p className="text-amber-400/50 text-xs">
                        {new Date(story.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteStory(story._id);
                      }}
                      className="p-1.5 text-amber-400/30 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-all"
                      aria-label="Delete story"
                    >
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </aside>

          {/* Overlay for mobile sidebar */}
          {sidebarOpen && (
            <div
              className="fixed inset-0 bg-black/50 z-30 lg:hidden"
              onClick={() => setSidebarOpen(false)}
            />
          )}

          {/* Main content */}
          <main className="flex-1 flex flex-col overflow-hidden">
            {currentStoryId ? (
              <StoryChat storyId={currentStoryId} />
            ) : (
              <WelcomeScreen onNewStory={handleNewStory} isCreating={isCreatingStory} />
            )}
          </main>
        </div>

        {/* Footer */}
        <footer className="flex-shrink-0 border-t border-amber-900/20 py-2 text-center bg-[#0d0b0a]/80">
          <p className="font-serif text-amber-200/25 text-xs">
            Requested by @PauliusX · Built by @clonkbot
          </p>
        </footer>
      </div>
    </div>
  );
}

function WelcomeScreen({ onNewStory, isCreating }: { onNewStory: () => void; isCreating: boolean }) {
  return (
    <div className="flex-1 flex items-center justify-center p-6">
      <div className="text-center max-w-lg">
        <div className="inline-block mb-6">
          <svg className="w-24 h-24 text-amber-600/50" viewBox="0 0 100 100" fill="none">
            <path d="M15 90 L15 15 Q15 10 20 10 L80 10 Q85 10 85 15 L85 90 Q85 95 80 95 L20 95 Q15 95 15 90" stroke="currentColor" strokeWidth="2" fill="none" />
            <path d="M25 20 L75 20" stroke="currentColor" strokeWidth="1" opacity="0.3" />
            <path d="M25 30 L70 30" stroke="currentColor" strokeWidth="1" opacity="0.3" />
            <path d="M25 40 L65 40" stroke="currentColor" strokeWidth="1" opacity="0.3" />
            <path d="M25 50 L55 50" stroke="currentColor" strokeWidth="1" opacity="0.3" />
            <path d="M35 65 Q50 55 65 65 Q50 75 35 65" stroke="currentColor" strokeWidth="1.5" fill="none" />
          </svg>
        </div>
        <h2 className="font-display text-3xl md:text-4xl text-amber-100 mb-4">
          Welcome, Traveler
        </h2>
        <p className="font-serif text-amber-200/60 text-lg mb-8 leading-relaxed">
          Step into the realm of infinite stories. Command the Tale Weaver to spin yarns of adventure, mystery, romance, or fantasy.
        </p>
        <button
          onClick={onNewStory}
          disabled={isCreating}
          className="inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-amber-700 to-amber-600 text-amber-100 font-serif text-lg rounded-md hover:from-amber-600 hover:to-amber-500 transition-all shadow-lg shadow-amber-900/30 disabled:opacity-50"
        >
          {isCreating ? (
            <>
              <span className="w-5 h-5 border-2 border-amber-200/30 border-t-amber-200 rounded-full animate-spin" />
              Preparing quill...
            </>
          ) : (
            <>
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
              </svg>
              Begin Your First Tale
            </>
          )}
        </button>
      </div>
    </div>
  );
}

function StoryChat({ storyId }: { storyId: Id<"stories"> }) {
  const messages = useQuery(api.messages.listByStory, { storyId }) ?? [];
  const story = useQuery(api.stories.get, { id: storyId });
  const sendMessage = useMutation(api.messages.send);
  const updateTitle = useMutation(api.stories.updateTitle);
  const chat = useAction(api.ai.chat);

  const [input, setInput] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = Math.min(textareaRef.current.scrollHeight, 200) + "px";
    }
  }, [input]);

  const handleSend = async () => {
    if (!input.trim() || isGenerating) return;

    const userMessage = input.trim();
    setInput("");
    setError(null);
    setIsGenerating(true);

    try {
      // Save user message
      await sendMessage({ storyId, content: userMessage, role: "user" });

      // Update story title based on first message
      if (messages.length === 0 && story?.title === "New Tale") {
        const shortTitle = userMessage.slice(0, 50) + (userMessage.length > 50 ? "..." : "");
        await updateTitle({ id: storyId, title: shortTitle });
      }

      // Build conversation history
      const conversationHistory = messages.map((m: Message) => ({
        role: m.role as "user" | "assistant",
        content: m.content,
      }));
      conversationHistory.push({ role: "user", content: userMessage });

      // Get AI response
      const response = await chat({
        messages: conversationHistory,
        systemPrompt: `You are a master storyteller, a weaver of tales in the tradition of the great bards. Your stories are vivid, immersive, and captivating. You speak with eloquence and paint scenes with rich, evocative language.

When the user asks you to tell a story, continue a narrative, or set a scene, respond with beautiful prose. Use sensory details, dramatic tension, and memorable characters. Your tales can span any genre - fantasy, mystery, romance, adventure, horror, or whatever the seeker desires.

Keep your responses focused and paced well - aim for 2-4 paragraphs typically, leaving room for the user to guide the story's direction. End with hooks that invite continuation.

If the user gives direction ("make the hero braver", "add a dragon", "what happens next?"), weave their request seamlessly into the ongoing narrative.

Speak as though you are seated by a crackling fire in an ancient library, sharing timeless tales with an eager listener.`,
      });

      // Save assistant message
      await sendMessage({ storyId, content: response, role: "assistant" });
    } catch (err) {
      console.error("Chat error:", err);
      setError("The Tale Weaver stumbles... Please try again.");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handlePromptClick = (prompt: string) => {
    setInput(prompt);
    textareaRef.current?.focus();
  };

  return (
    <div className="flex-1 flex flex-col overflow-hidden">
      {/* Messages */}
      <div className="flex-1 overflow-y-auto">
        <div className="max-w-3xl mx-auto p-4 md:p-6 space-y-6">
          {messages.length === 0 && !isGenerating && (
            <div className="py-8">
              <p className="font-serif text-amber-200/50 text-center mb-6 italic">
                What tale shall I weave for you today?
              </p>
              <div className="grid gap-3 md:grid-cols-2">
                {STORY_PROMPTS.map((prompt, i) => (
                  <button
                    key={i}
                    onClick={() => handlePromptClick(prompt)}
                    className="p-4 text-left font-serif text-amber-200/70 border border-amber-900/30 rounded-lg hover:bg-amber-900/20 hover:border-amber-700/50 transition-all text-sm"
                  >
                    "{prompt}"
                  </button>
                ))}
              </div>
            </div>
          )}

          {messages.map((message: Message, i: number) => (
            <div
              key={message._id}
              className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}
              style={{ animationDelay: `${i * 0.1}s` }}
            >
              <div
                className={`max-w-[85%] md:max-w-[75%] ${
                  message.role === "user"
                    ? "bg-amber-800/30 border-amber-700/40"
                    : "bg-[#1a1512] border-amber-900/30"
                } border rounded-lg p-4 shadow-lg`}
              >
                {message.role === "assistant" && (
                  <div className="flex items-center gap-2 mb-2 pb-2 border-b border-amber-900/20">
                    <svg className="w-4 h-4 text-amber-500" viewBox="0 0 100 100" fill="none">
                      <path d="M20 85 L20 20 Q20 15 25 15 L75 15 Q80 15 80 20 L80 85" stroke="currentColor" strokeWidth="3" fill="none" />
                    </svg>
                    <span className="text-amber-400/60 font-serif text-xs uppercase tracking-wider">Tale Weaver</span>
                  </div>
                )}
                <p className="font-serif text-amber-100 whitespace-pre-wrap leading-relaxed">
                  {message.content}
                </p>
              </div>
            </div>
          ))}

          {isGenerating && (
            <div className="flex justify-start">
              <div className="bg-[#1a1512] border border-amber-900/30 rounded-lg p-4 shadow-lg">
                <div className="flex items-center gap-2 mb-2 pb-2 border-b border-amber-900/20">
                  <svg className="w-4 h-4 text-amber-500 animate-pulse" viewBox="0 0 100 100" fill="none">
                    <path d="M20 85 L20 20 Q20 15 25 15 L75 15 Q80 15 80 20 L80 85" stroke="currentColor" strokeWidth="3" fill="none" />
                  </svg>
                  <span className="text-amber-400/60 font-serif text-xs uppercase tracking-wider">Tale Weaver</span>
                </div>
                <div className="flex items-center gap-1">
                  <span className="w-2 h-2 bg-amber-500/60 rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                  <span className="w-2 h-2 bg-amber-500/60 rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                  <span className="w-2 h-2 bg-amber-500/60 rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
                  <span className="ml-2 font-serif text-amber-200/50 text-sm italic">Weaving your tale...</span>
                </div>
              </div>
            </div>
          )}

          {error && (
            <div className="flex justify-center">
              <div className="bg-red-900/20 border border-red-800/40 text-red-300 font-serif rounded-lg p-4 text-center">
                {error}
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Input */}
      <div className="flex-shrink-0 border-t border-amber-900/30 bg-[#0d0b0a]/90 backdrop-blur-sm">
        <div className="max-w-3xl mx-auto p-4">
          <div className="flex gap-3">
            <textarea
              ref={textareaRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Speak your request to the Tale Weaver..."
              rows={1}
              disabled={isGenerating}
              className="flex-1 px-4 py-3 bg-[#141110] border border-amber-900/40 rounded-lg text-amber-100 font-serif placeholder:text-amber-200/30 focus:outline-none focus:border-amber-600 focus:ring-1 focus:ring-amber-600/50 transition-all resize-none disabled:opacity-50"
            />
            <button
              onClick={handleSend}
              disabled={!input.trim() || isGenerating}
              className="px-5 py-3 bg-gradient-to-r from-amber-700 to-amber-600 text-amber-100 rounded-lg hover:from-amber-600 hover:to-amber-500 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex-shrink-0"
              aria-label="Send message"
            >
              {isGenerating ? (
                <span className="w-5 h-5 border-2 border-amber-200/30 border-t-amber-200 rounded-full animate-spin block" />
              ) : (
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                </svg>
              )}
            </button>
          </div>
          <p className="mt-2 text-center text-amber-400/30 font-serif text-xs">
            Press Enter to send · Shift+Enter for new line
          </p>
        </div>
      </div>
    </div>
  );
}
