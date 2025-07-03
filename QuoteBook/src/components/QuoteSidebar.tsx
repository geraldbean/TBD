
import { useState } from "react";
import { Plus, Share, Bell, Book, Users, MessageSquareShare, Quote, Sun, Moon, ChevronLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";

interface QuoteSidebarProps {
  isCollapsed: boolean;
  onToggleCollapse: () => void;
  onQuoteAdd: () => void;
  isDarkMode: boolean;
  onDarkModeToggle: () => void;
}

const QuoteSidebar = ({ isCollapsed, onToggleCollapse, onQuoteAdd, isDarkMode, onDarkModeToggle }: QuoteSidebarProps) => {
  const navigate = useNavigate();
  const [quoteBooks, setQuoteBooks] = useState(['Personal Quotes']);
  const [newBookName, setNewBookName] = useState('');
  const [showNewBookDialog, setShowNewBookDialog] = useState(false);
  const [activeItem, setActiveItem] = useState('Personal Quotes');

  const addQuoteBook = () => {
    if (newBookName.trim()) {
      setQuoteBooks([...quoteBooks, newBookName.trim()]);
      setNewBookName('');
      setShowNewBookDialog(false);
    }
  };

  const handleFriendsClick = () => {
    setActiveItem('friends');
    navigate('/friends');
  };

  const handleSharedQuotesClick = () => {
    setActiveItem('shared-quotes');
    // Keep for future functionality
  };

  const handleQuoteBookClick = (book: string) => {
    setActiveItem(book);
    if (book === 'Personal Quotes') {
      navigate('/');
    } else {
      // Navigate to the specific quote book page
      const bookSlug = book.toLowerCase().replace(/\s+/g, '-');
      navigate(`/quote-book/${bookSlug}`);
    }
  };

  const handleNotificationsClick = () => {
    setActiveItem('notifications');
  };

  return (
    <div className={cn(
      "bg-gray-100 dark:bg-gray-900 border-r border-gray-200 dark:border-gray-700 transition-all duration-300 flex flex-col h-screen fixed left-0 top-0 z-30",
      isCollapsed ? "w-[64px]" : "w-[200px]" //match marginLeft values on index.tsx 

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
        onClick={onToggleCollapse}
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




      <div className="p-3 space-y-3 flex-1 overflow-y-auto">
        {/* Add Quote Button */}
        <Button 
          onClick={onQuoteAdd}
          className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:opacity-90 text-white flex items-center gap-2 justify-center"
        >
          <Plus className="h-4 w-4" />
          {!isCollapsed && "Quoted"}
        </Button>

        {/* Share Quotes Button */}
        <Button 
          className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:opacity-90 text-white flex items-center gap-2 justify-center"
        >
          <Share className="h-4 w-4" />
          {!isCollapsed && "Share Quote"}
        </Button>

        {/* Quote Books Section */}
        {!isCollapsed && (
          <div className="space-y-2">
            <h3 className="text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wide px-2">Quote Books</h3>
            {quoteBooks.map((book, index) => (
              <Button 
                key={index} 
                variant="ghost" 
                onClick={() => handleQuoteBookClick(book)}
                className={cn(
                  "w-full justify-start text-sm hover:bg-gray-200 dark:hover:bg-gray-800 flex items-center gap-2",
                  activeItem === book && "text-transparent bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text font-medium"
                )}
              >
                <Book className={cn(
                  "h-4 w-4",
                  activeItem === book && "text-blue-600"
                )} />
                {book}
              </Button>
            ))}
            
            <Dialog open={showNewBookDialog} onOpenChange={setShowNewBookDialog}>
              <DialogTrigger asChild>
                <Button 
                  variant="ghost" 
                  className="w-full justify-start text-sm text-gray-500 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-800 flex items-center gap-2"
                >
                  <Plus className="h-4 w-4" />
                  Add Quote Book
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Create New Quote Book</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <Input
                    placeholder="Enter quote book name..."
                    value={newBookName}
                    onChange={(e) => setNewBookName(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && addQuoteBook()}
                  />
                  <div className="flex justify-end gap-2">
                    <Button variant="outline" onClick={() => setShowNewBookDialog(false)}>
                      Cancel
                    </Button>
                    <Button onClick={addQuoteBook} disabled={!newBookName.trim()}>
                      Create
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        )}

        {/* Network Section */}
        {!isCollapsed && (
          <>
            <div className="border-t border-gray-200 dark:border-gray-700 pt-3">
              <h3 className="text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wide px-2 mb-2">Network</h3>
            </div>
            
            <Button 
              onClick={handleFriendsClick}
              variant="ghost" 
              className={cn(
                "w-full justify-start hover:bg-gray-200 dark:hover:bg-gray-800 flex items-center gap-2",
                activeItem === 'friends' && "text-transparent bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text font-medium"
              )}
            >
              <Users className={cn(
                "h-4 w-4",
                activeItem === 'friends' && "text-blue-600"
              )} />
              Friends
            </Button>

            <Button 
              onClick={handleSharedQuotesClick}
              variant="ghost" 
              className={cn(
                "w-full justify-start hover:bg-gray-200 dark:hover:bg-gray-800 flex items-center gap-2",
                activeItem === 'shared-quotes' && "text-transparent bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text font-medium"
              )}
            >
              <MessageSquareShare className={cn(
                "h-4 w-4",
                activeItem === 'shared-quotes' && "text-blue-600"
              )} />
              Quoteboard
            </Button>
          </>
        )}

        {/* Collapsed state icons */}
        {isCollapsed && (
          <div className="space-y-2">
            <Button 
              onClick={handleFriendsClick}
              variant="ghost" 
              size="icon"
              className={cn(
                "w-full h-10 hover:bg-gray-200 dark:hover:bg-gray-800",
                activeItem === 'friends' && "bg-blue-600/10"
              )}
            >
              <Users className={cn(
                "h-4 w-4",
                activeItem === 'friends' && "text-blue-600"
              )} />
            </Button>

            <Button 
              onClick={handleSharedQuotesClick}
              variant="ghost" 
              size="icon"
              className={cn(
                "w-full h-10 hover:bg-gray-200 dark:hover:bg-gray-800",
                activeItem === 'shared-quotes' && "bg-blue-600/10"
              )}
            >
              <MessageSquareShare className={cn(
                "h-4 w-4",
                activeItem === 'shared-quotes' && "text-blue-600"
              )} />
            </Button>
          </div>
        )}

        {/* Notifications */}
        <Button 
          onClick={handleNotificationsClick}
          variant="ghost" 
          className={cn(
            "w-full justify-start hover:bg-gray-200 dark:hover:bg-gray-800 flex items-center gap-2",
            isCollapsed && "justify-center",
            activeItem === 'notifications' && "text-transparent bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text font-medium"
          )}
        >
          <Bell className={cn(
            "h-4 w-4",
            activeItem === 'notifications' && "text-blue-600"
          )} />
          {!isCollapsed && "Notifications"}
        </Button>
      </div>

      {/* Dark Mode Toggle at Bottom */}
      <div className="p-3 border-t border-gray-200 dark:border-gray-700">
        <div className="flex justify-center items-center gap-2">
          {!isCollapsed && <Sun className="h-4 w-4 text-gray-500" />}
          <Switch 
            checked={isDarkMode}
            onCheckedChange={onDarkModeToggle}
            className="data-[state=checked]:bg-blue-600"
          />
          {!isCollapsed && (
            <>
              <Moon className="h-4 w-4 text-gray-500" />
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default QuoteSidebar;
