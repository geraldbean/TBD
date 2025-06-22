
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

export interface Quote {
  id: string;
  text: string;
  author: string;
  timestamp: Date;
  backgroundColor?: string;
}

interface QuoteInputProps {
  onSave: (quote: Quote) => void;
  onCancel: () => void;
}

const QuoteInput = ({ onSave, onCancel }: QuoteInputProps) => {
  const [text, setText] = useState("");
  const [author, setAuthor] = useState("");

  const handleSave = () => {
    if (text.trim() && author.trim()) {
      const newQuote: Quote = {
        id: crypto.randomUUID(),
        text: text.trim(),
        author: author.trim(),
        timestamp: new Date(),
        backgroundColor: '#ffffff',
      };
      onSave(newQuote);
      setText("");
      setAuthor("");
    } else {
      alert("Please fill in both the quote and the author.");
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-md shadow-md p-6">
      <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-4">
        Add New Quote
      </h2>
      <div className="space-y-4">
        <div>
          <label htmlFor="quote" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Quote
          </label>
          <Textarea
            id="quote"
            rows={3}
            className="shadow-sm focus:ring-primary focus:border-primary block w-full sm:text-sm border-gray-300 rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            placeholder="Write the quote here..."
            value={text}
            onChange={(e) => setText(e.target.value)}
          />
        </div>
        <div>
          <label htmlFor="author" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Author
          </label>
          <Input
            type="text"
            name="author"
            id="author"
            className="shadow-sm focus:ring-primary focus:border-primary block w-full sm:text-sm border-gray-300 rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            placeholder="Who said it?"
            value={author}
            onChange={(e) => setAuthor(e.target.value)}
          />
        </div>
        <div className="flex justify-end gap-4">
          <Button variant="ghost" onClick={onCancel}>
            Cancel
          </Button>
          <Button onClick={handleSave}>Save Quote</Button>
        </div>
      </div>
    </div>
  );
};

export default QuoteInput;
