
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface MessageQuoteCardProps {
  id: string;
  user: {
    name: string;
    avatarUrl?: string;
  };
  text: string;
  timestamp: string;
  isCurrentUser: boolean;
}

const MessageQuoteCard = ({ user, text, timestamp, isCurrentUser }: MessageQuoteCardProps) => {
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
    <div className={`flex gap-3 mb-4 ${isCurrentUser ? 'flex-row-reverse' : 'flex-row'}`}>
      <Avatar className="w-10 h-10 flex-shrink-0">
        <AvatarImage src={user.avatarUrl} alt={user.name} />
        <AvatarFallback className="bg-gradient-to-r from-blue-500 to-purple-500 text-white text-sm">
          {user.name.charAt(0).toUpperCase()}
        </AvatarFallback>
      </Avatar>
      
      <div className={`flex flex-col max-w-[70%] ${isCurrentUser ? 'items-end' : 'items-start'}`}>
        <div className={`mb-1 text-sm font-medium text-gray-600 dark:text-gray-400 ${isCurrentUser ? 'text-right' : 'text-left'}`}>
          {user.name}
        </div>
        
        <div className={`relative p-4 rounded-2xl shadow-sm border ${
          isCurrentUser 
            ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-br-md' 
            : 'bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-bl-md border-gray-200 dark:border-gray-600'
        }`}>
          <blockquote className="text-base leading-relaxed italic">
            "{text}"
          </blockquote>
        </div>
        
        <div className={`mt-1 text-xs text-gray-500 dark:text-gray-400 ${isCurrentUser ? 'text-right' : 'text-left'}`}>
          {formatTimestamp(timestamp)}
        </div>
      </div>
    </div>
  );
};

export default MessageQuoteCard;
