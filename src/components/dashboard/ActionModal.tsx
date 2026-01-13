import { useState } from "react";
import { format } from "date-fns";
import { Calendar as CalendarIcon, X, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { mockClients, remarkTags, resultOptions, DashboardBoxData } from "@/lib/mockData";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";

interface ActionModalProps {
  isOpen: boolean;
  onClose: () => void;
  box: DashboardBoxData | null;
  onSave: (boxId: string, result: string) => void;
}

export const ActionModal = ({ isOpen, onClose, box, onSave }: ActionModalProps) => {
  const [date, setDate] = useState<Date>(new Date());
  const [selectedClient, setSelectedClient] = useState<string>("");
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [remark, setRemark] = useState("");
  const [result, setResult] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleTagClick = (tag: string) => {
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  };

  const handleSave = async () => {
    if (!selectedClient) {
      toast({
        title: "Client Required",
        description: "Please select a client/unit",
        variant: "destructive",
      });
      return;
    }

    if (!remark.trim()) {
      toast({
        title: "Remark Required",
        description: "Please add a remark",
        variant: "destructive",
      });
      return;
    }

    if (!result) {
      toast({
        title: "Result Required",
        description: "Please select a result",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 800));
    
    if (box) {
      onSave(box.id, result);
    }

    toast({
      title: "Action Saved",
      description: `${box?.label} updated successfully`,
    });

    // Reset form
    setSelectedClient("");
    setSelectedTags([]);
    setRemark("");
    setResult("");
    setIsLoading(false);
    onClose();
  };

  const handleClose = () => {
    setSelectedClient("");
    setSelectedTags([]);
    setRemark("");
    setResult("");
    onClose();
  };

  if (!box) return null;

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[500px] shadow-modal">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl">
            <CheckCircle2 className="h-5 w-5 text-primary" />
            {box.label}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-5 py-4">
          {/* Date Picker */}
          <div className="space-y-2">
            <Label>Date</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-full justify-start text-left font-normal",
                    !date && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {date ? format(date, "PPP") : <span>Pick a date</span>}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={date}
                  onSelect={(d) => d && setDate(d)}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>

          {/* Client Dropdown */}
          <div className="space-y-2">
            <Label>Client / Unit</Label>
            <Select value={selectedClient} onValueChange={setSelectedClient}>
              <SelectTrigger>
                <SelectValue placeholder="Select client" />
              </SelectTrigger>
              <SelectContent>
                {mockClients.map((client) => (
                  <SelectItem key={client.id} value={client.id}>
                    <div className="flex items-center gap-2">
                      <span className="font-medium">{client.unit}</span>
                      <span className="text-muted-foreground">- {client.name}</span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Quick Remark Tags */}
          <div className="space-y-2">
            <Label>Quick Remarks</Label>
            <div className="flex flex-wrap gap-2">
              {remarkTags.map((tag) => (
                <Badge
                  key={tag}
                  variant={selectedTags.includes(tag) ? "default" : "outline"}
                  className={cn(
                    "cursor-pointer transition-all hover:scale-105",
                    selectedTags.includes(tag) && "bg-primary"
                  )}
                  onClick={() => handleTagClick(tag)}
                >
                  {tag}
                </Badge>
              ))}
            </div>
          </div>

          {/* Remark Textarea */}
          <div className="space-y-2">
            <Label>Remark *</Label>
            <Textarea
              value={remark}
              onChange={(e) => setRemark(e.target.value)}
              placeholder="Enter your remark here..."
              className="min-h-[100px] resize-none"
            />
          </div>

          {/* Result Dropdown */}
          <div className="space-y-2">
            <Label>Result *</Label>
            <Select value={result} onValueChange={setResult}>
              <SelectTrigger>
                <SelectValue placeholder="Select result" />
              </SelectTrigger>
              <SelectContent>
                {resultOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Actions */}
        <div className="flex justify-end gap-3 pt-4 border-t">
          <Button variant="outline" onClick={handleClose} disabled={isLoading}>
            Cancel
          </Button>
          <Button onClick={handleSave} disabled={isLoading} className="min-w-[100px]">
            {isLoading ? (
              <span className="flex items-center gap-2">
                <span className="w-4 h-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
                Saving...
              </span>
            ) : (
              "Save"
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
