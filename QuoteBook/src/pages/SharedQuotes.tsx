import { useState } from "react";
import { Quote, Home, Users, Sun, Moon, Plus, Share, ChevronLeft, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { useNavigate } from "react-router-dom";
import SharedQuoteFeed from "@/components/SharedQuoteFeed";
import { cn } from "@/lib/utils";

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

interface Friend {
  id: string;
  name: string;
  username: string;
  avatarUrl?: string;
  isOnline: boolean;
}

const SharedQuotes = () => {
  const navigate = useNavigate();
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [showFriends, setShowFriends] = useState(false);
  const [quotes, setQuotes] = useState<SharedQuote[]>([
    {
      id: '1',
      user: { 
        name: 'Alex Johnson', 
        username: '@alexj',
        avatarUrl: '/avatars/alex.png' 
      },
      text: "The only way to do great work is to love what you do.",
      timestamp: '2025-06-30T08:30:00Z',
      likeCount: 24,
      likedByUser: false,
    },
    {
      id: '2',
      user: { 
        name: 'Sarah Chen', 
        username: '@sarahc',
        avatarUrl: '/avatars/sarah.png' 
      },
      text: "Life is what happens to you while you're busy making other plans.",
      timestamp: '2025-06-30T10:15:00Z',
      likeCount: 18,
      likedByUser: true,
    },
    {
      id: '3',
      user: { 
        name: 'Mike Rodriguez', 
        username: '@mikero',
        avatarUrl: '/avatars/mike.png' 
      },
      text: "Innovation distinguishes between a leader and a follower.",
      timestamp: '2025-06-30T14:45:00Z',
      likeCount: 31,
      likedByUser: false,
    },
    {
      id: '4',
      user: { 
        name: 'Emma Davis', 
        username: '@emmad',
        avatarUrl: '/avatars/emma.png' 
      },
      text: "Be yourself; everyone else is already taken.",
      timestamp: '2025-06-30T16:20:00Z',
      likeCount: 12,
      likedByUser: true,
    },
    {
      id: '5',
      user: { 
        name: 'James Wilson', 
        username: '@jamesw',
        avatarUrl: '/avatars/james.png' 
      },
      text: "The future belongs to those who believe in the beauty of their dreams.",
      timestamp: '2025-06-30T18:00:00Z',
      likeCount: 27,
      likedByUser: false,
    },
  ]);

  const [friends] = useState<Friend[]>([
    {
      id: '1',
      name: 'Alex Johnson',
      username: '@alexj',
      avatarUrl: '/avatars/alex.png',
      isOnline: true,
    },
    {
      id: '2',
      name: 'Sarah Chen',
      username: '@sarahc',
      avatarUrl: '/avatars/sarah.png',
      isOnline: false,
    },
    {
      id: '3',
      name: 'Mike Rodriguez',
      username: '@mikero',
      avatarUrl: '/avatars/mike.png',
      isOnline: true,
    },
  ]);

  const handleDarkModeToggle = () => {
    setIsDarkMode(!isDarkMode);
    document.documentElement.classList.toggle('dark');
  };

  const handleToggleCollapse = () => {
    setIsCollapsed(!isCollapsed);
  };

  const handleFriendsClick = () => {
    setShowFriends(!showFriends);
  };

  const handleQuoteLike = (quoteId: string) => {
    setQuotes(prevQuotes =>
      prevQuotes.map(quote =>
        quote.id === quoteId
          ? {
              ...quote,
              likedByUser: !quote.likedByUser,
              likeCount: quote.likedByUser ? quote.likeCount - 1 : quote.likeCount + 1
            }
          : quote
      )
    );
  };

  return (
    <div className={`min-h-screen bg-gray-50 dark:bg-gray-900 ${isDarkMode ? 'dark' : ''}`}>
      {/* Fixed Sidebar */}
      <div className={cn(
        "bg-gray-100 dark:bg-gray-900 border-r border-gray-200 dark:border-gray-700 transition-all duration-300 flex flex-col h-screen fixed left-0 top-0 z-30",
        isCollapsed ? "w-[64px]" : "w-[200px]"
      )}>
        {/* Header with Logo and Title */}
        <div className="p-4 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-3">
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-2 rounded-lg">
              <Quote className="h-5 w-5 text-white" />
            </div>
            {!isCollapsed && (
              <div>
                <h1 className="text-lg font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  Quotable
                </h1>
                <p className="text-xs text-gray-500 dark:text-gray-400">Social Media</p>
              </div>
            )}
          </div>
        </div>

        {/* Floating Collapse Button on Sidebar Edge */}
        <button
          onClick={handleToggleCollapse}
          className="absolute top-6 -right-2 z-40 bg-transparent border border-gray-300 dark:border-gray-600 rounded-full p-0.5 shadow-sm hover:bg-gray-100 dark:hover:bg-gray-700 transition"
          aria-label={isCollapsed ? "Expand Sidebar" : "Collapse Sidebar"}
        >
          <ChevronLeft
            className={cn(
              "h-3 w-3 text-gray-500 transition-transform duration-200",
              isCollapsed && "rotate-180"
            )}
          />
        </button>

        {/* Main Section */}
        <div className="p-3 space-y-3 flex-1 overflow-y-auto">
          {/* Share Quote Button */}
          <Button 
            className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:opacity-90 text-white flex items-center gap-2 justify-center"
          >
            <Plus className="h-4 w-4" />
            {!isCollapsed && "Share Quote"}
          </Button>

          {/* Home Button */}
          <Button 
            onClick={() => navigate('/')}
            variant="ghost" 
            className={cn(
              "w-full justify-start hover:bg-gray-200 dark:hover:bg-gray-800 flex items-center gap-2",
              isCollapsed && "justify-center"
            )}
          >
            <Home className="h-4 w-4" />
            {!isCollapsed && "Home"}
          </Button>

          {/* Friends Button */}
          <Button 
            onClick={handleFriendsClick}
            variant="ghost" 
            className={cn(
              "w-full justify-start hover:bg-gray-200 dark:hover:bg-gray-800 flex items-center gap-2",
              isCollapsed && "justify-center"
            )}
          >
            <Users className="h-4 w-4" />
            {!isCollapsed && "Friends"}
          </Button>
        </div>

        {/* Dark Mode Toggle at Bottom */}
        <div className="p-3 border-t border-gray-200 dark:border-gray-700">
          <div className="flex justify-center items-center gap-2">
            {!isCollapsed && <Sun className="h-4 w-4 text-gray-500" />}
            <Switch 
              checked={isDarkMode}
              onCheckedChange={handleDarkModeToggle}
              className="data-[state=checked]:bg-blue-600"
            />
            {!isCollapsed && <Moon className="h-4 w-4 text-gray-500" />}
          </div>
        </div>
      </div>

      {/* Friends Sub-Sidebar */}
      {showFriends && (
        <div className={cn(
          "bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 transition-all duration-300 flex flex-col h-screen fixed top-0 z-40",
          isCollapsed ? "left-[64px] w-[256px]" : "left-[200px] w-[256px]"
        )}>
          {/* Friends Header */}
          <div className="p-4 border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                Friends
              </h2>
              <Button
                onClick={() => setShowFriends(false)}
                variant="ghost"
                size="icon"
                className="h-6 w-6 hover:bg-gray-200 dark:hover:bg-gray-700"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Friends List */}
          <div className="p-3 flex-1 overflow-y-auto">
            <div className="space-y-2">
              {friends.map((friend) => (
                <div
                  key={friend.id}
                  className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer"
                >
                  <div className="relative">
                    <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-semibold">
                      {friend.name.split(' ').map(n => n[0]).join('')}
                    </div>
                    {friend.isOnline && (
                      <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-white dark:border-gray-800"></div>
                    )}
                  </div>
                  <div>
                    <p className="font-medium text-gray-900 dark:text-white">
                      {friend.name}
                    </p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {friend.username}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className={cn(
        "transition-all duration-300",
        showFriends 
          ? (isCollapsed ? "ml-[320px]" : "ml-[456px]") 
          : (isCollapsed ? "ml-[64px]" : "ml-[200px]")
      )}>
        {/* Smaller Header */}
        <div className="sticky top-0 z-10 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-6 py-4">
          <h1 className="text-xl font-bold text-gray-900 dark:text-white">
            Shared Quotes
          </h1>
          <p className="text-gray-600 dark:text-gray-400 text-sm">
            See what your friends are sharing today
          </p>
        </div>

        {/* Quote Feed */}
        <SharedQuoteFeed quotes={quotes} onQuoteLike={handleQuoteLike} />
      </div>
    </div>
  );
};

export default SharedQuotes;
