import { useMemo } from "react";
import { MainLayout } from "@/components/layout/MainLayout";
import { PageHeader } from "@/components/common/PageHeader";
import { AutoStatusBadge } from "@/components/common/StatusBadge";
import { officers, Officer } from "@/lib/extendedMockData";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Users, CheckCircle, Clock, MapPin } from "lucide-react";
import { RestrictionBanner } from "@/components/dashboard/RestrictionBanner";

const LiveMonitoringPage = () => {
  const stats = useMemo(() => {
    const active = officers.filter(o => o.status === 'active').length;
    const onBreak = officers.filter(o => o.status === 'break').length;
    const offline = officers.filter(o => o.status === 'offline').length;
    const totalVisits = officers.reduce((sum, o) => sum + o.visitsCompleted, 0);
    
    return { active, onBreak, offline, totalVisits };
  }, []);

  return (
    <MainLayout>
      <PageHeader
        title="Live Monitoring"
        subtitle="Real-time field officer tracking"
        breadcrumbs={[{ label: "Live Monitoring" }]}
      />

      <div className="p-6 space-y-6">
        {/* Summary Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="bg-gradient-to-br from-green-50 to-green-100/50 border-green-200">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-green-500 rounded-lg">
                  <Users className="text-white" size={20} />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Active Officers</p>
                  <p className="text-2xl font-bold text-green-700">{stats.active}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-yellow-50 to-yellow-100/50 border-yellow-200">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-yellow-500 rounded-lg">
                  <Clock className="text-white" size={20} />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">On Break</p>
                  <p className="text-2xl font-bold text-yellow-700">{stats.onBreak}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-gray-50 to-gray-100/50 border-gray-200">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-gray-500 rounded-lg">
                  <Users className="text-white" size={20} />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Offline</p>
                  <p className="text-2xl font-bold text-gray-700">{stats.offline}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-blue-50 to-blue-100/50 border-blue-200">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-500 rounded-lg">
                  <CheckCircle className="text-white" size={20} />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Visits Today</p>
                  <p className="text-2xl font-bold text-blue-700">{stats.totalVisits}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Map Placeholder */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MapPin size={20} />
              Live Map View
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-80 bg-gradient-to-br from-muted/30 to-muted/60 rounded-lg flex items-center justify-center border-2 border-dashed border-muted-foreground/20">
              <div className="text-center">
                <MapPin size={48} className="mx-auto text-muted-foreground/40 mb-3" />
                <p className="text-muted-foreground font-medium">Map Integration</p>
                <p className="text-sm text-muted-foreground/70">
                  Google Maps integration will display officer locations here
                </p>
                <div className="flex justify-center gap-4 mt-4">
                  {officers.filter(o => o.status === 'active').slice(0, 3).map((officer, i) => (
                    <div key={officer.id} className="flex items-center gap-2 bg-background px-3 py-1.5 rounded-full text-sm shadow-sm">
                      <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                      {officer.name.split(' ')[0]}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Officers Table */}
        <Card>
          <CardHeader>
            <CardTitle>Officer Status</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Officer</TableHead>
                  <TableHead>Area</TableHead>
                  <TableHead>Current Location</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Last Update</TableHead>
                  <TableHead className="text-right">Visits</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {officers.map((officer) => (
                  <TableRow key={officer.id}>
                    <TableCell>
                      <div>
                        <p className="font-medium">{officer.name}</p>
                        <p className="text-sm text-muted-foreground">{officer.phone}</p>
                      </div>
                    </TableCell>
                    <TableCell>{officer.area}</TableCell>
                    <TableCell className="max-w-48 truncate">{officer.currentLocation}</TableCell>
                    <TableCell>
                      <AutoStatusBadge status={officer.status} />
                    </TableCell>
                    <TableCell className="text-muted-foreground">{officer.lastUpdate}</TableCell>
                    <TableCell className="text-right font-semibold">{officer.visitsCompleted}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>

      <RestrictionBanner />
    </MainLayout>
  );
};

export default LiveMonitoringPage;
