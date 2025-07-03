
import { useState } from "react";
import { ArrowLeft, UserPlus, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import Header from "@/components/Header";
import { useNavigate } from "react-router-dom";

interface Friend {
  id: string;
  name: string;
  email: string;
  status: 'online' | 'offline';
}

const Friends = () => {
  const navigate = useNavigate();
  const [friends, setFriends] = useState<Friend[]>([
    { id: '1', name: 'Alice Johnson', email: 'alice@example.com', status: 'online' },
    { id: '2', name: 'Bob Smith', email: 'bob@example.com', status: 'offline' },
    { id: '3', name: 'Carol Davis', email: 'carol@example.com', status: 'online' },
  ]);
  const [searchTerm, setSearchTerm] = useState("");

  const filteredFriends = friends.filter(friend => 
    friend.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    friend.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-background dark:bg-gray-800">
      <Header />
      
      <main className="p-6">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="flex items-center gap-4 mb-8">
            <Button 
              variant="ghost" 
              size="icon"
              onClick={() => navigate('/')}
              className="hover:bg-gray-100 dark:hover:bg-gray-700"
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <h1 className="text-3xl font-bold text-foreground">Friends</h1>
          </div>

          {/* Search and Add Friend */}
          <div className="flex gap-4 mb-6">
            <Input
              placeholder="Search friends..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="flex-1"
            />
            <Button className="bg-gradient-primary hover:opacity-90 text-white">
              <UserPlus className="h-4 w-4 mr-2" />
              Add Friend
            </Button>
          </div>

          {/* Friends List */}
          <div className="space-y-4">
            {filteredFriends.length === 0 ? (
              <div className="text-center py-12">
                <User className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                <h3 className="text-xl font-semibold text-gray-700 dark:text-gray-300 mb-2">
                  No friends found
                </h3>
                <p className="text-gray-500 dark:text-gray-400">
                  Start connecting with people to share quotes
                </p>
              </div>
            ) : (
              filteredFriends.map((friend) => (
                <Card key={friend.id} className="hover:shadow-md transition-shadow duration-200">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gradient-primary rounded-full flex items-center justify-center">
                          <User className="h-5 w-5 text-white" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-foreground">{friend.name}</h3>
                          <p className="text-sm text-gray-500 dark:text-gray-400">{friend.email}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className={`w-3 h-3 rounded-full ${
                          friend.status === 'online' ? 'bg-green-500' : 'bg-gray-400'
                        }`} />
                        <span className={`text-sm ${
                          friend.status === 'online' ? 'text-green-600 dark:text-green-400' : 'text-gray-500 dark:text-gray-400'
                        }`}>
                          {friend.status}
                        </span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default Friends;
