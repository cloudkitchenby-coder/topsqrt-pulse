import { useState, useMemo } from "react";
import { useParams } from "react-router-dom";
import { MainLayout } from "@/components/layout/MainLayout";
import { PageHeader } from "@/components/common/PageHeader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { reportTypes, paymentRecords, officers } from "@/lib/extendedMockData";
import { 
  FileText, 
  TrendingUp, 
  Users, 
  MapPin, 
  DollarSign, 
  CheckCircle, 
  Clock,
  Download,
  FileSpreadsheet
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { RestrictionBanner } from "@/components/dashboard/RestrictionBanner";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
} from "recharts";

const iconMap: Record<string, React.ReactNode> = {
  'FileText': <FileText size={18} />,
  'TrendingUp': <TrendingUp size={18} />,
  'Users': <Users size={18} />,
  'MapPin': <MapPin size={18} />,
  'DollarSign': <DollarSign size={18} />,
  'CheckCircle': <CheckCircle size={18} />,
  'Clock': <Clock size={18} />,
};

const COLORS = ['#8b5cf6', '#3b82f6', '#22c55e', '#f59e0b', '#ef4444', '#06b6d4'];

const ReportsPage = () => {
  const { reportType } = useParams();
  const { toast } = useToast();
  const [selectedReport, setSelectedReport] = useState(reportType || 'daily-activity');
  const [selectedArea, setSelectedArea] = useState("all");
  const [selectedOfficer, setSelectedOfficer] = useState("all");

  const chartData = useMemo(() => {
    // Mock data for charts
    return [
      { name: 'Mon', visits: 45, calls: 32, payments: 12000 },
      { name: 'Tue', visits: 52, calls: 45, payments: 18500 },
      { name: 'Wed', visits: 38, calls: 28, payments: 9800 },
      { name: 'Thu', visits: 61, calls: 52, payments: 22000 },
      { name: 'Fri', visits: 55, calls: 48, payments: 15600 },
      { name: 'Sat', visits: 42, calls: 35, payments: 11200 },
    ];
  }, []);

  const pieData = useMemo(() => [
    { name: 'Completed', value: 145 },
    { name: 'Pending', value: 45 },
    { name: 'Follow-up', value: 32 },
    { name: 'Cancelled', value: 8 },
  ], []);

  const handleExport = (format: 'pdf' | 'excel') => {
    toast({
      title: "Generating report...",
      description: `Preparing ${format.toUpperCase()} export`,
    });
    
    setTimeout(() => {
      toast({
        title: "Download ready!",
        description: `Report exported as ${format.toUpperCase()}`,
      });
    }, 1500);
  };

  const currentReport = reportTypes.find(r => r.id === selectedReport);

  return (
    <MainLayout>
      <PageHeader
        title="Reports"
        subtitle="Generate and export detailed reports"
        breadcrumbs={[
          { label: "Reporting", path: "/reports" },
          { label: currentReport?.name || "Reports" }
        ]}
      />

      <div className="flex flex-col lg:flex-row">
        {/* Report Types Sidebar */}
        <div className="w-full lg:w-64 bg-card border-b lg:border-b-0 lg:border-r border-border p-4">
          <h3 className="text-sm font-semibold text-muted-foreground mb-3 px-2">Report Types</h3>
          <div className="space-y-1">
            {reportTypes.map(report => (
              <button
                key={report.id}
                onClick={() => setSelectedReport(report.id)}
                className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-all ${
                  selectedReport === report.id
                    ? 'bg-primary text-primary-foreground'
                    : 'hover:bg-muted text-foreground/80'
                }`}
              >
                {iconMap[report.icon]}
                <span>{report.name}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Report Content */}
        <div className="flex-1 p-6 space-y-6">
          {/* Filters */}
          <Card>
            <CardContent className="p-4">
              <div className="flex flex-wrap items-center gap-4">
                <div className="flex items-center gap-2">
                  <span className="text-sm text-muted-foreground">From:</span>
                  <Input type="date" className="w-40" defaultValue="2024-01-01" />
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-muted-foreground">To:</span>
                  <Input type="date" className="w-40" defaultValue={new Date().toISOString().split('T')[0]} />
                </div>

                <Select value={selectedArea} onValueChange={setSelectedArea}>
                  <SelectTrigger className="w-40">
                    <SelectValue placeholder="Area" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Areas</SelectItem>
                    <SelectItem value="lawrence">Lawrence Road</SelectItem>
                    <SelectItem value="rohini">Rohini</SelectItem>
                    <SelectItem value="dwarka">Dwarka</SelectItem>
                  </SelectContent>
                </Select>

                <Select value={selectedOfficer} onValueChange={setSelectedOfficer}>
                  <SelectTrigger className="w-48">
                    <SelectValue placeholder="Officer" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Officers</SelectItem>
                    {officers.map(officer => (
                      <SelectItem key={officer.id} value={officer.id}>{officer.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Button className="bg-primary">Generate Report</Button>

                <div className="flex gap-2 ml-auto">
                  <Button variant="outline" onClick={() => handleExport('pdf')}>
                    <Download size={16} className="mr-2" />
                    PDF
                  </Button>
                  <Button variant="outline" onClick={() => handleExport('excel')}>
                    <FileSpreadsheet size={16} className="mr-2" />
                    Excel
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Charts */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Activity Overview</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={chartData}>
                      <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="visits" fill="#8b5cf6" name="Visits" />
                      <Bar dataKey="calls" fill="#3b82f6" name="Calls" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Status Distribution</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={pieData}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={80}
                        paddingAngle={5}
                        dataKey="value"
                        label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                      >
                        {pieData.map((_, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle className="text-lg">Payment Collection Trend</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={chartData}>
                      <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip formatter={(value) => `₹${Number(value).toLocaleString()}`} />
                      <Line 
                        type="monotone" 
                        dataKey="payments" 
                        stroke="#22c55e" 
                        strokeWidth={2}
                        dot={{ fill: '#22c55e' }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      <RestrictionBanner />
    </MainLayout>
  );
};

export default ReportsPage;
