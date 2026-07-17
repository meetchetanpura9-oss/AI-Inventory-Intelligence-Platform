import { Bot, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const prompts = ["Forecast demand", "Check inventory", "Show top sellers"];

export function MiniChat() {
  return (
    <section className="rounded-xl border border-white/10 bg-white/[0.04] p-5 shadow-xl shadow-black/15 backdrop-blur-xl transition-all duration-300 ease-out hover:-translate-y-1 hover:border-white/20 hover:shadow-2xl hover:shadow-black/25">
      <div className="flex items-center gap-3">
        <div className="flex size-10 items-center justify-center rounded-lg border border-violet-300/20 bg-violet-500/10 text-violet-100">
          <Bot className="size-5" />
        </div>
        <div>
          <h2 className="text-base font-semibold text-white">Mini AI Assistant</h2>
          <p className="text-xs text-slate-400">Ask AI about stock, sales, and forecasts</p>
        </div>
      </div>
      <div className="mt-5 flex gap-2">
        <Input
          className="border-white/10 bg-white/[0.06] text-white placeholder:text-slate-500"
          placeholder='Ask AI... "Which products need reordering?"'
        />
        <Button aria-label="Ask AI" size="icon-lg">
          <Send className="size-4" />
        </Button>
      </div>
      <div className="mt-4 flex flex-wrap gap-2">
        {prompts.map((prompt) => (
          <Button key={prompt} className="border-white/10 bg-white/[0.06]" size="sm" variant="outline">
            {prompt}
          </Button>
        ))}
      </div>
    </section>
  );
}
