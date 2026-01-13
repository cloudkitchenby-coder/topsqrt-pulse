import { useState } from "react";
import { format } from "date-fns";
import { Calendar as CalendarIcon, Filter, Download, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { BoxGrid } from "./BoxGrid";
import { 
  areas, 
  users, 
  auditLogData, 
  DashboardBoxData,
  initialOfficerBoxes,
  initialUserBoxes
} from "@/lib/mockData";
import { cn } from "@/lib/utils";

interface MasterAdminViewProps {
  officerBoxes: DashboardBoxData[];
  userBoxes: DashboardBoxData[];
  onBoxClick: (box: DashboardBoxData) => void;
}

export const MasterAdminView = ({ officerBoxes, userBoxes, onBoxClick }: MasterAdminViewProps) => {
  const [selectedArea, setSelectedArea] = useState<string>("all");
  const [selectedUser, setSelectedUser] = useState<string>("all");
  const [dateRange, setDateRange] = useState<{ from: Date; to: Date }>({
    from: new Date(),
    to: new Date(),
  });
  const [showAuditLog, setShowAuditLog] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const officerTotal = officerBoxes.reduce((sum, box) => sum + (box.count || 0), 0);
  const userTotal = userBoxes.reduce((sum, box) => sum + (box.count || 0), 0);

  const filteredAuditLog = auditLogData.filter(log => 
    log.user.toLowerCase().includes(searchQuery.toLowerCase()) ||
    log.client.toLowerCase().includes(searchQuery.toLowerCase()) ||
    log.action.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getResultBadgeVariant = (result: string) => {
    switch (result) {
      case "Done": return "default";
      case "Follow-Up": return "secondary";
      case "Pending": return "destructive";
      default: return "outline";
    }
  };

  return (
    <div className="container mx-auto px-4 py-6 space-y-6">
      {/* Filters Bar */}
      <div className="bg-card rounded-xl p-4 shadow-card">
        <div className="flex flex-wrap items-center gap-4">
          <div className="flex items-center gap-2 text-primary">
            <Filter className="h-5 w-5" />
            <span className="font-semibold">Filters</span>
          </div>

          <Select value={selectedArea} onValueChange={setSelectedArea}>
            <SelectTrigger className="w-[150px]">
              <SelectValue placeholder="Select Area" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Areas</SelectItem>
              {areas.map((area) => (
                <SelectItem key={area} value={area}>{area}</SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={selectedUser} onValueChange={setSelectedUser}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select User" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Users</SelectItem>
              {users.map((user) => (
                <SelectItem key={user.email} value={user.email}>{user.name}</SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" className="w-[260px] justify-start text-left font-normal">
                <CalendarIcon className="mr-2 h-4 w-4" />
                {format(dateRange.from, "MMM dd")} - {format(dateRange.to, "MMM dd, yyyy")}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="range"
                selected={{ from: dateRange.from, to: dateRange.to }}
                onSelect={(range) => {
                  if (range?.from && range?.to) {
                    setDateRange({ from: range.from, to: range.to });
                  }
                }}
                initialFocus
              />
            </PopoverContent>
          </Popover>

          <div className="flex-1" />

          <Button 
            variant={showAuditLog ? "default" : "outline"}
            onClick={() => setShowAuditLog(!showAuditLog)}
          >
            {showAuditLog ? "Hide Audit Log" : "Drill Down"}
          </Button>

          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      {/* Aggregated Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-card rounded-xl p-4 shadow-card text-center">
          <p className="text-sm text-muted-foreground">Total Actions</p>
          <p className="text-3xl font-bold text-foreground">{officerTotal + userTotal}</p>
        </div>
        <div className="bg-card rounded-xl p-4 shadow-card text-center">
          <p className="text-sm text-muted-foreground">Officer Visits</p>
          <p className="text-3xl font-bold text-primary">{officerTotal}</p>
        </div>
        <div className="bg-card rounded-xl p-4 shadow-card text-center">
          <p className="text-sm text-muted-foreground">User Follow-ups</p>
          <p className="text-3xl font-bold text-primary">{userTotal}</p>
        </div>
        <div className="bg-card rounded-xl p-4 shadow-card text-center">
          <p className="text-sm text-muted-foreground">Completion Rate</p>
          <p className="text-3xl font-bold text-emerald-500">78%</p>
        </div>
      </div>

      {/* Audit Log Table */}
      {showAuditLog && (
        <div className="bg-card rounded-xl p-6 shadow-card animate-slide-up">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-bold text-foreground">Audit Log</h3>
            <div className="relative w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search logs..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9"
              />
            </div>
          </div>

          <div className="rounded-lg border overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/50">
                  <TableHead>Time</TableHead>
                  <TableHead>User</TableHead>
                  <TableHead>Action</TableHead>
                  <TableHead>Client</TableHead>
                  <TableHead>Remark</TableHead>
                  <TableHead>Result</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredAuditLog.map((log) => (
                  <TableRow key={log.id}>
                    <TableCell className="font-medium">{log.time}</TableCell>
                    <TableCell>{log.user}</TableCell>
                    <TableCell>{log.action}</TableCell>
                    <TableCell>{log.client}</TableCell>
                    <TableCell>{log.remark}</TableCell>
                    <TableCell>
                      <Badge variant={getResultBadgeVariant(log.result)}>
                        {log.result}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>
      )}

      {/* Dashboard Boxes */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <BoxGrid
          title="Officers Visit Follow-Up"
          subtitle="Field officer tasks"
          totalCount={officerTotal}
          boxes={officerBoxes}
          onBoxClick={onBoxClick}
        />
        <BoxGrid
          title="User Follow-Up"
          subtitle="Internal team tasks"
          totalCount={userTotal}
          boxes={userBoxes}
          onBoxClick={onBoxClick}
        />
      </div>
    </div>
  );
};
