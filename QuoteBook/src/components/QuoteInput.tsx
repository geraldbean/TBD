
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

export interface Quote {
  quote_id: string;
  quote_entered: string;
  who_said_it: string;
  date: Date;
  backgroundColor?: string;
}


interface QuoteInputProps {
  onSave: (quote: Quote) => void;
  onCancel: () => void;
}

const QuoteInput = ({ onSave, onCancel }: QuoteInputProps) => {
  const [quote_entered, setText] = useState("");
  const [who_said_it, setAuthor] = useState("");

 const handleSave = async () => {
  if (quote_entered.trim() && who_said_it.trim()) {
    try {
    const response = await fetch("http://localhost/Quotebook/save_quotes.php", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({  
          quote_entered: quote_entered.trim(),
          who_said_it: who_said_it.trim(),
        }),
      });

      const savedQuote = await response.json();

      if (!savedQuote.success) {
        throw new Error(savedQuote.error || "Unknown error");
      }

      //Pass the saved quote back to the parent component (Index.tsx)
      onSave({
        quote_id: savedQuote.quote_id.toString(),
        quote_entered: savedQuote.quote_entered,
        who_said_it: savedQuote.who_said_it,
        date: new Date(savedQuote.date),
        backgroundColor: "#ffffff", // optional default background
      });

      setText("");   //Clear input
      setAuthor(""); //Clear input
    } catch (err) {
      console.error("Save quote error:", err);
      alert("Failed to save quote");
    }
  } else {
    alert("Please fill in both the quote and author fields.");
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
            value={quote_entered}
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
            value={who_said_it}
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
