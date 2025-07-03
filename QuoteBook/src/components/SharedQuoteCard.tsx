
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Heart } from "lucide-react";
import { cn } from "@/lib/utils";

interface SharedQuoteCardProps {
  user: {
    name: string;
    username: string;
    avatarUrl?: string;
  };
  text: string;
  timestamp: string;
  likeCount: number;
  likedByUser: boolean;
  onLike: () => void;
  onDoubleClick: () => void;
}

const SharedQuoteCard = ({ 
  user, 
  text, 
  timestamp, 
  likeCount, 
  likedByUser, 
  onLike, 
  onDoubleClick 
}: SharedQuoteCardProps) => {
  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return "just now";
    if (diffInHours < 24) return `${diffInHours}h ago`;
    if (diffInHours < 168) return `${Math.floor(diffInHours / 24)}d ago`;
    return date.toLocaleDateString();
  };

  return (
    <div 
      className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-100 dark:border-gray-700 overflow-hidden transition-all duration-300 hover:shadow-xl hover:scale-[1.01] w-full max-w-3xl mx-auto cursor-pointer"
      onDoubleClick={onDoubleClick}
    >
      {/* Header with avatar and user info */}
      <div className="flex items-center gap-4 p-6 pb-4">
        <Avatar className="w-14 h-14">
          <AvatarImage src={user.avatarUrl} alt={user.name} />
          <AvatarFallback className="bg-gradient-to-r from-blue-500 to-purple-500 text-white font-semibold text-lg">
            {user.name.split(' ').map(n => n[0]).join('').toUpperCase()}
          </AvatarFallback>
        </Avatar>
        
        <div className="flex-1">
          <h3 className="font-semibold text-gray-900 dark:text-white text-lg">
            {user.name}
          </h3>
          <p className="text-gray-500 dark:text-gray-400 text-sm">
            {user.username}
          </p>
        </div>
        
        <div className="text-sm text-gray-400 dark:text-gray-500">
          {formatTimestamp(timestamp)}
        </div>
      </div>

      {/* Quote content */}
      <div className="px-8 py-8 text-center">
        <blockquote className="text-2xl md:text-3xl font-medium text-gray-800 dark:text-gray-200 leading-relaxed italic">
          "{text}"
        </blockquote>
      </div>

      {/* Like section - positioned at bottom left */}
      <div className="px-6 pb-6 flex justify-start">
        <div className="flex items-center gap-2">
          <button
            onClick={onLike}
            className="flex items-center gap-1 transition-all duration-200 hover:scale-110 focus:outline-none"
          >
            <Heart 
              className={cn(
                "h-5 w-5 transition-all duration-200",
                likedByUser 
                  ? "fill-red-500 text-red-500" 
                  : "text-gray-400 hover:text-red-500"
              )}
            />
          </button>
          <span className="text-sm text-gray-500 dark:text-gray-400">
            {likeCount} {likeCount === 1 ? 'like' : 'likes'}
          </span>
        </div>
      </div>
    </div>
  );
};

export default SharedQuoteCard;
