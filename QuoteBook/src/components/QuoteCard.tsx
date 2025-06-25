
import { useState } from "react";
import { MoreVertical, Edit, Trash2, Palette } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Quote } from "./QuoteInput";

interface QuoteCardProps {
  quote: Quote;
  onEdit: (id: string, updatedQuote: Partial<Quote>) => void;
  onDelete: (id: string) => void;
}

//display function(displaying on a card(textbox))
const QuoteCard = ({ quote, onEdit, onDelete }: QuoteCardProps) => {
  const [isEditing, setIsEditing] = useState(false);

  //quote_entered: user input
  const [editText, setEditText] = useState(quote.quote_entered);
  //who_said_it: author
  const [editAuthor, setEditAuthor] = useState(quote.who_said_it);
  const [showColorPicker, setShowColorPicker] = useState(false);

  const colors = [
    '#ffffff', '#f8fafc', '#f1f5f9', '#e2e8f0', '#cbd5e1',
    '#fef3c7', '#fed7aa', '#fecaca', '#f9a8d4', '#ddd6fe',
    '#bfdbfe', '#a7f3d0', '#bbf7d0', '#fde68a', '#fed7d7'
  ];

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const handleEdit = () => {
    onEdit(quote.quote_id, { quote_entered: editText, who_said_it: editAuthor }); //saving edited quote also changes from php table

    setIsEditing(false);
  };

  const handleDelete = () => {
    onDelete(quote.quote_id);
  };

  const handleColorChange = (color: string) => {
    onEdit(quote.quote_id, { backgroundColor: color });
    setShowColorPicker(false);
  };

  const backgroundColor = quote.backgroundColor || '#ffffff';

  return (
    <>
      <Card 
        className="hover:shadow-md transition-shadow duration-200 animate-fade-in relative"
        style={{ backgroundColor }}
      >
        <CardContent className="p-6">
          {/* Three-dot menu */}
          <div className="absolute top-4 right-4">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="h-8 w-8 hover:bg-gray-100">
                  <MoreVertical className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => setIsEditing(true)} className="flex items-center gap-2">
                  <Edit className="h-4 w-4" />
                  Edit Quote
                </DropdownMenuItem>
                <DropdownMenuItem onClick={handleDelete} className="flex items-center gap-2 text-red-600">
                  <Trash2 className="h-4 w-4" />
                  Delete Quote
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setShowColorPicker(true)} className="flex items-center gap-2">
                  <Palette className="h-4 w-4" />
                  Change Background
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          <blockquote className="text-lg leading-relaxed text-gray-800 italic mb-4 pr-8">
            "{quote.quote_entered}"
          </blockquote>
          <div className="flex justify-between items-center text-sm text-gray-600">
            <cite className="font-medium">— {quote.who_said_it}</cite>
            <time className="text-gray-400">{formatDate(quote.date)}</time>
          </div>
        </CardContent>
      </Card>

      {/* Edit Dialog */}
      <Dialog open={isEditing} onOpenChange={setIsEditing}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Quote</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium">Quote Text</label>
              <Textarea
                value={editText}
                onChange={(e) => setEditText(e.target.value)}
                placeholder="Enter quote text..."
                className="mt-1"
              />
            </div>
            <div>
              <label className="text-sm font-medium">Author</label>
              <Input
                value={editAuthor}
                onChange={(e) => setEditAuthor(e.target.value)}
                placeholder="Who said it?"
                className="mt-1"
              />
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setIsEditing(false)}>
                Cancel
              </Button>
              <Button onClick={handleEdit}>
                Save Changes
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Color Picker Dialog */}
      <Dialog open={showColorPicker} onOpenChange={setShowColorPicker}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Change Background Color</DialogTitle>
          </DialogHeader>
          <div className="grid grid-cols-5 gap-3 p-4">
            {colors.map((color) => (
              <button
                key={color}
                onClick={() => handleColorChange(color)}
                className="w-10 h-10 rounded-md border-2 border-gray-200 hover:border-gray-400 transition-colors"
                style={{ backgroundColor: color }}
              />
            ))}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default QuoteCard;
