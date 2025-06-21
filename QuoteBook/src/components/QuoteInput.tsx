
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

export interface Quote {
  id: string;
  quote_entered: string;
  who_said_it: string;
  timestamp: Date;
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
    const newQuote = {
      quote_entered: quote_entered.trim(),
      who_said_it: who_said_it.trim(),
    };

    try {
      const response = await fetch("http://localhost/Quotebook/personal_page.php", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newQuote),
      });

      const savedQuote = await response.json();
      onSave({
        id: savedQuote.id,
        quote_entered: savedQuote.quote_entered,
        who_said_it: savedQuote.who_said_it,
        timestamp: new Date(savedQuote.timestamp),
        backgroundColor: "#ffffff",
      });

      setText("");
      setAuthor("");
    } catch (err) {
      alert("Failed to save quote");
    }
  } else {
    alert("Please fill in both the quote and the who_said_it.");
  }
};



  return (
    <div className="bg-white dark:bg-gray-800 rounded-md shadow-md p-6">
      <h2 className="quote_entered-lg font-semibold quote_entered-gray-800 dark:quote_entered-gray-200 mb-4">
        Add New Quote
      </h2>
      <div className="space-y-4">
        <div>
          <label htmlFor="quote" className="block quote_entered-sm font-medium quote_entered-gray-700 dark:quote_entered-gray-300">
            Quote
          </label>
          <Textarea
            id="quote"
            rows={3}
            className="shadow-sm focus:ring-primary focus:border-primary block w-full sm:quote_entered-sm border-gray-300 rounded-md dark:bg-gray-700 dark:border-gray-600 dark:quote_entered-white"
            placeholder="Write the quote here..."
            value={quote_entered}
            onChange={(e) => setText(e.target.value)}
          />
        </div>
        <div>
          <label htmlFor="who_said_it" className="block quote_entered-sm font-medium quote_entered-gray-700 dark:quote_entered-gray-300">
            Author
          </label>
          <Input
            type="quote_entered"
            name="who_said_it"
            id="who_said_it"
            className="shadow-sm focus:ring-primary focus:border-primary block w-full sm:quote_entered-sm border-gray-300 rounded-md dark:bg-gray-700 dark:border-gray-600 dark:quote_entered-white"
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


// <?php
// session_start();
// include 'db_connection.php';
// include 'login_check.php';

// header("Access-Control-Allow-Origin: *");
// header("Content-Type: application/json");

// // Fetch quotes only for the logged-in user
// $sql = $con->prepare("SELECT quote_id, quote_entered, who_said_it, timestamp FROM quote WHERE user_id = ?");
// $sql->bind_param("i", $uid);
// $sql->execute();

// $result = $sql->get_result();
// $quotes = [];

// while ($row = $result->fetch_assoc()) {
//     $quotes[] = [
//         "id" => $row['quote_id'],
//         "quote_entered" => $row['quote_entered'],
//         "who_said_it" => $row['who_said_it'],
//         "timestamp" => $row['timestamp']
//     ];
// }

// echo json_encode($quotes);

// $sql->close();
// $con->close();
// ?>
