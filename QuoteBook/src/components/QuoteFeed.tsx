
import { ScrollArea } from "@/components/ui/scroll-area";
import MessageQuoteCard from "./MessageQuoteCard";

interface Quote {
  id: string;
  user: {
    name: string;
    avatarUrl?: string;
  };
  text: string;
  timestamp: string;
  isCurrentUser: boolean;
}

interface QuoteFeedProps {
  quotes: Quote[];
}

const QuoteFeed = ({ quotes }: QuoteFeedProps) => {
  return (
    <ScrollArea className="flex-1 px-4">
      <div className="py-4 space-y-2">
        {quotes.map((quote) => (
          <MessageQuoteCard
            key={quote.id}
            id={quote.id}
            user={quote.user}
            text={quote.text}
            timestamp={quote.timestamp}
            isCurrentUser={quote.isCurrentUser}
          />
        ))}
      </div>
    </ScrollArea>
  );
};

export default QuoteFeed;
