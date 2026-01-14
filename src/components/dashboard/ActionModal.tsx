import { useState } from "react";
import { format } from "date-fns";
import { Calendar as CalendarIcon, CheckCircle2 } from "lucide-react";
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
import { mockClients, remarkTags, DashboardBoxData } from "@/lib/mockData";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";
import { getResultOptionsForBox } from "@/lib/autoUpdateEngine";
import { ClientRecord } from "@/lib/autoUpdateEngine";

interface ActionModalProps {
  isOpen: boolean;
  onClose: () => void;
  box: DashboardBoxData | null;
  onSave: (boxId: string, result: string, clientId: string, remark: string) => void;
  clients?: ClientRecord[];
}

export const ActionModal = ({ isOpen, onClose, box, onSave, clients = [] }: ActionModalProps) => {
  const [date, setDate] = useState<Date>(new Date());
  const [selectedClient, setSelectedClient] = useState<string>("");
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [remark, setRemark] = useState("");
  const [result, setResult] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  // Get result options based on box type
  const resultOptions = box ? getResultOptionsForBox(box.id) : [];

  // Use provided clients or fall back to mock clients
  const displayClients = clients.length > 0 ? clients : mockClients.slice(0, 5).map(c => ({
    id: c.id,
    name: c.name,
    unit: c.unit,
    phone: c.phone,
    area: c.area,
    status: 'active' as const,
    currentBox: box?.id || '',
    serviceType: 'Standard',
    startDate: new Date(),
    pendingAmount: c.amount,
    lastActionDate: new Date(),
    attemptCount: 0,
  }));

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

    if (!remark.trim() && selectedTags.length === 0) {
      toast({
        title: "Remark Required",
        description: "Please add a remark or select quick tags",
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
    await new Promise((resolve) => setTimeout(resolve, 500));
    
    const fullRemark = [...selectedTags, remark].filter(Boolean).join('. ');
    
    if (box) {
      onSave(box.id, result, selectedClient, fullRemark);
    }

    const selectedResult = resultOptions.find(r => r.value === result);
    toast({
      title: "Action Saved",
      description: `${box?.label}: ${selectedResult?.label || result}`,
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
            <Label>Client / Unit ({displayClients.length} available)</Label>
            <Select value={selectedClient} onValueChange={setSelectedClient}>
              <SelectTrigger>
                <SelectValue placeholder="Select client" />
              </SelectTrigger>
              <SelectContent>
                {displayClients.map((client) => (
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
            <Label>Additional Remark</Label>
            <Textarea
              value={remark}
              onChange={(e) => setRemark(e.target.value)}
              placeholder="Enter additional remarks here..."
              className="min-h-[80px] resize-none"
            />
          </div>

          {/* Result Dropdown with descriptions */}
          <div className="space-y-2">
            <Label>Result *</Label>
            <Select value={result} onValueChange={setResult}>
              <SelectTrigger>
                <SelectValue placeholder="Select result" />
              </SelectTrigger>
              <SelectContent>
                {resultOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    <div className="flex flex-col">
                      <span className="font-medium">{option.label}</span>
                      <span className="text-xs text-muted-foreground">{option.description}</span>
                    </div>
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
