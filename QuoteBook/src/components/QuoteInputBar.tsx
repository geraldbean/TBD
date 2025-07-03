
import { useState } from "react";
import { Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface QuoteInputBarProps {
  onSendQuote: (text: string) => void;
}

const QuoteInputBar = ({ onSendQuote }: QuoteInputBarProps) => {
  const [quoteText, setQuoteText] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (quoteText.trim()) {
      onSendQuote(quoteText.trim());
      setQuoteText("");
    }
  };

  return (
    <div className="sticky bottom-0 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 p-4">
      <form onSubmit={handleSubmit} className="flex gap-2">
        <Input
          value={quoteText}
          onChange={(e) => setQuoteText(e.target.value)}
          placeholder="Share a meaningful quote..."
          className="flex-1"
        />
        <Button 
          type="submit" 
          disabled={!quoteText.trim()}
          className="bg-gradient-to-r from-blue-500 to-purple-500 hover:opacity-90"
        >
          <Send className="h-4 w-4" />
        </Button>
      </form>
    </div>
  );
};

export default QuoteInputBar;
