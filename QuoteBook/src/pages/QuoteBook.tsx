
import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Header from "@/components/Header";
import QuoteSidebar from "@/components/QuoteSidebar";
import QuoteInput, { Quote } from "@/components/QuoteInput";
import QuoteCard from "@/components/QuoteCard";

const QuoteBook = () => {
  const { bookSlug } = useParams<{ bookSlug: string }>();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [showQuoteInput, setShowQuoteInput] = useState(false);
  const [quotes, setQuotes] = useState<Quote[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isDarkMode, setIsDarkMode] = useState(false);

  // Convert slug back to readable name
  const bookName = bookSlug?.split('-').map(word => 
    word.charAt(0).toUpperCase() + word.slice(1)
  ).join(' ') || 'Quote Book';

  // Apply dark mode to document
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  const handleSaveQuote = (quote: Quote) => {
    setQuotes(prev => [quote, ...prev]);
    setShowQuoteInput(false);
  };

  const handleAddQuote = () => {
    setShowQuoteInput(true);
  };

  const handleCancelQuote = () => {
    setShowQuoteInput(false);
  };

  const handleEditQuote = (id: string, updatedQuote: Partial<Quote>) => {
    setQuotes(prev => prev.map(quote => 
      quote.id === id ? { ...quote, ...updatedQuote } : quote
    ));
  };

  const handleDeleteQuote = (id: string) => {
    setQuotes(prev => prev.filter(quote => quote.id !== id));
  };

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
  };

  const toggleSidebar = () => {
    setSidebarCollapsed(!sidebarCollapsed);
  };

  const filteredQuotes = quotes.filter(quote => 
    quote.text.toLowerCase().includes(searchTerm.toLowerCase()) ||
    quote.author.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen flex w-full bg-background dark:bg-gray-900">
      {/* Sidebar */}
      <QuoteSidebar 
        isCollapsed={sidebarCollapsed}
        onToggleCollapse={toggleSidebar}
        onQuoteAdd={handleAddQuote}
        isDarkMode={isDarkMode}
        onDarkModeToggle={toggleDarkMode}
      />

      {/* Main Content */}
      <div 
        className="flex-1 flex flex-col transition-all duration-300"
        style={{ 
          marginLeft: sidebarCollapsed ? '64px' : '200px' 
        }}
      >
        {/* Header */}
        <Header />

        {/* Main Content Area */}
        <main className="flex-1 p-6 bg-background dark:bg-gray-800">
          <div className="w-full max-w-none">
            {/* Top Controls - Fixed positioning */}
            <div className="flex items-center justify-between mb-8 w-full">
              {/* Title aligned to left */}
              <div className="flex items-center">
                <h2 className="text-2xl font-bold text-foreground">{bookName}</h2>
              </div>
              
              {/* Search aligned to right */}
              <div className="relative w-80">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Search quotes..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 focus:ring-2 focus:ring-blue-600 focus:border-blue-600 w-full"
                />
              </div>
            </div>

            {/* Quote Input */}
            {showQuoteInput && (
              <div className="mb-8 max-w-4xl mx-auto">
                <QuoteInput 
                  onSave={handleSaveQuote}
                  onCancel={handleCancelQuote}
                />
              </div>
            )}

            {/* Quotes Display */}
            <div className="space-y-6 max-w-4xl mx-auto">
              {filteredQuotes.length === 0 ? (
                <div className="text-center py-12">
                  <div className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent text-6xl font-bold mb-4">
                    "
                  </div>
                  <h3 className="text-xl font-semibold text-gray-700 dark:text-gray-300 mb-2">
                    No quotes yet in {bookName}
                  </h3>
                  <p className="text-gray-500 dark:text-gray-400 mb-6">
                    Start collecting meaningful quotes by clicking the "Quoted" button
                  </p>
                  {!showQuoteInput && (
                    <Button 
                      onClick={handleAddQuote}
                      className="bg-gradient-to-r from-blue-600 to-purple-600 hover:opacity-90 text-white"
                    >
                      Add Your First Quote
                    </Button>
                  )}
                </div>
              ) : (
                filteredQuotes.map((quote) => (
                  <QuoteCard 
                    key={quote.id} 
                    quote={quote}
                    onEdit={handleEditQuote}
                    onDelete={handleDeleteQuote}
                  />
                ))
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default QuoteBook;
