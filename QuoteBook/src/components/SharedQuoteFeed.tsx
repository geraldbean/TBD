
import SharedQuoteCard from "./SharedQuoteCard";

interface SharedQuote {
  id: string;
  user: {
    name: string;
    username: string;
    avatarUrl?: string;
  };
  text: string;
  timestamp: string;
  likeCount: number;
  likedByUser: boolean;
}

interface SharedQuoteFeedProps {
  quotes: SharedQuote[];
  onQuoteLike: (quoteId: string) => void;
}

const SharedQuoteFeed = ({ quotes, onQuoteLike }: SharedQuoteFeedProps) => {
  return (
    <div className="overflow-y-auto h-[calc(100vh-120px)] px-8 py-6">
      <div className="max-w-3xl mx-auto space-y-6">
        {quotes.map((quote, index) => (
          <div 
            key={quote.id}
            className="animate-fade-in"
            style={{ animationDelay: `${index * 0.1}s` }}
          >
            <SharedQuoteCard
              user={quote.user}
              text={quote.text}
              timestamp={quote.timestamp}
              likeCount={quote.likeCount}
              likedByUser={quote.likedByUser}
              onLike={() => onQuoteLike(quote.id)}
              onDoubleClick={() => onQuoteLike(quote.id)}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default SharedQuoteFeed;
