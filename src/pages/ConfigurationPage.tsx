import { useState } from "react";
import { MainLayout } from "@/components/layout/MainLayout";
import { PageHeader } from "@/components/common/PageHeader";
import { configTabs, officers } from "@/lib/extendedMockData";
import { remarkTags } from "@/lib/mockData";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { 
  Settings, 
  Users, 
  MapPin, 
  MessageSquare, 
  LayoutDashboard, 
  Bell, 
  Download,
  Plus,
  Pencil,
  Trash2,
  Save
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { RestrictionBanner } from "@/components/dashboard/RestrictionBanner";
import { AutoStatusBadge } from "@/components/common/StatusBadge";

const iconMap: Record<string, React.ReactNode> = {
  'Settings': <Settings size={16} />,
  'Users': <Users size={16} />,
  'MapPin': <MapPin size={16} />,
  'MessageSquare': <MessageSquare size={16} />,
  'LayoutDashboard': <LayoutDashboard size={16} />,
  'Bell': <Bell size={16} />,
  'Download': <Download size={16} />,
};

const ConfigurationPage = () => {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("general");

  const handleSave = () => {
    toast({
      title: "Settings saved",
      description: "Your configuration has been updated successfully.",
    });
  };

  return (
    <MainLayout>
      <PageHeader
        title="Configuration"
        subtitle="Manage system settings and preferences"
        breadcrumbs={[{ label: "Configuration" }]}
      />

      <div className="p-6">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="flex flex-wrap h-auto gap-2 bg-muted/50 p-2">
            {configTabs.map(tab => (
              <TabsTrigger 
                key={tab.id} 
                value={tab.id}
                className="flex items-center gap-2 data-[state=active]:bg-background"
              >
                {iconMap[tab.icon]}
                <span className="hidden sm:inline">{tab.name}</span>
              </TabsTrigger>
            ))}
          </TabsList>

          {/* General Settings */}
          <TabsContent value="general">
            <Card>
              <CardHeader>
                <CardTitle>General Settings</CardTitle>
                <CardDescription>Configure basic company information</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="companyName">Company Name</Label>
                    <Input id="companyName" defaultValue="TOPS QRT" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="contactNumber">Contact Number</Label>
                    <Input id="contactNumber" defaultValue="+91-9876543210" />
                  </div>
                  <div className="space-y-2 md:col-span-2">
                    <Label htmlFor="address">Address</Label>
                    <Textarea 
                      id="address" 
                      defaultValue="Lawrence Road, New Delhi - 110035"
                      rows={3}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="workingHoursStart">Working Hours Start</Label>
                    <Input id="workingHoursStart" type="time" defaultValue="09:00" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="workingHoursEnd">Working Hours End</Label>
                    <Input id="workingHoursEnd" type="time" defaultValue="18:00" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="currency">Currency Symbol</Label>
                    <Input id="currency" defaultValue="₹" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="timezone">Timezone</Label>
                    <Input id="timezone" defaultValue="Asia/Kolkata" />
                  </div>
                </div>
                <Button onClick={handleSave}>
                  <Save size={16} className="mr-2" />
                  Save Changes
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          {/* User Management */}
          <TabsContent value="users">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle>User Management</CardTitle>
                  <CardDescription>Manage users and their roles</CardDescription>
                </div>
                <Button>
                  <Plus size={16} className="mr-2" />
                  Add User
                </Button>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Area</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {officers.map(officer => (
                      <TableRow key={officer.id}>
                        <TableCell className="font-medium">{officer.name}</TableCell>
                        <TableCell>{officer.email}</TableCell>
                        <TableCell>{officer.area}</TableCell>
                        <TableCell>
                          <AutoStatusBadge status={officer.status} />
                        </TableCell>
                        <TableCell>
                          <div className="flex gap-2">
                            <Button variant="ghost" size="icon" className="h-8 w-8">
                              <Pencil size={14} />
                            </Button>
                            <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive">
                              <Trash2 size={14} />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Area Management */}
          <TabsContent value="areas">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle>Area Management</CardTitle>
                  <CardDescription>Configure service areas and assignments</CardDescription>
                </div>
                <Button>
                  <Plus size={16} className="mr-2" />
                  Add Area
                </Button>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {['Lawrence Road', 'Rohini', 'Dwarka', 'Saket', 'Janakpuri', 'Model Town'].map(area => (
                    <Card key={area} className="bg-muted/30">
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="font-medium">{area}</p>
                            <p className="text-sm text-muted-foreground">
                              {officers.filter(o => o.area === area).length} officers assigned
                            </p>
                          </div>
                          <Button variant="ghost" size="icon">
                            <Pencil size={14} />
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Quick Remark Configuration */}
          <TabsContent value="remarks">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle>Quick Remark Tags</CardTitle>
                  <CardDescription>Configure quick-select remark options</CardDescription>
                </div>
                <Button>
                  <Plus size={16} className="mr-2" />
                  Add Tag
                </Button>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-3">
                  {remarkTags.map(tag => (
                    <div key={tag} className="flex items-center gap-2 bg-muted px-4 py-2 rounded-full">
                      <span>{tag}</span>
                      <button className="text-muted-foreground hover:text-destructive transition-colors">
                        <Trash2 size={14} />
                      </button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Dashboard Settings */}
          <TabsContent value="dashboard">
            <Card>
              <CardHeader>
                <CardTitle>Dashboard Settings</CardTitle>
                <CardDescription>Configure dashboard appearance and behavior</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <Label>Show Officer Follow-Up Section</Label>
                    <p className="text-sm text-muted-foreground">Display officer visit tracking boxes</p>
                  </div>
                  <Switch defaultChecked />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <Label>Show User Follow-Up Section</Label>
                    <p className="text-sm text-muted-foreground">Display user call tracking boxes</p>
                  </div>
                  <Switch defaultChecked />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <Label>Enable Animations</Label>
                    <p className="text-sm text-muted-foreground">Show count change animations</p>
                  </div>
                  <Switch defaultChecked />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <Label>Auto-refresh Dashboard</Label>
                    <p className="text-sm text-muted-foreground">Automatically refresh data every 5 minutes</p>
                  </div>
                  <Switch />
                </div>
                <Button onClick={handleSave}>
                  <Save size={16} className="mr-2" />
                  Save Changes
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Notification Settings */}
          <TabsContent value="notifications">
            <Card>
              <CardHeader>
                <CardTitle>Notification Settings</CardTitle>
                <CardDescription>Configure alerts and notifications</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <Label>Email Notifications</Label>
                    <p className="text-sm text-muted-foreground">Receive daily summary via email</p>
                  </div>
                  <Switch defaultChecked />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <Label>SMS Alerts</Label>
                    <p className="text-sm text-muted-foreground">Get instant SMS for urgent matters</p>
                  </div>
                  <Switch />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <Label>Browser Notifications</Label>
                    <p className="text-sm text-muted-foreground">Show desktop notifications</p>
                  </div>
                  <Switch defaultChecked />
                </div>
                <Button onClick={handleSave}>
                  <Save size={16} className="mr-2" />
                  Save Changes
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Backup & Export */}
          <TabsContent value="backup">
            <Card>
              <CardHeader>
                <CardTitle>Backup & Export</CardTitle>
                <CardDescription>Manage data backups and exports</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Card className="bg-muted/30">
                    <CardContent className="p-4">
                      <h4 className="font-medium mb-2">Full Data Backup</h4>
                      <p className="text-sm text-muted-foreground mb-4">
                        Export all data including clients, payments, and records
                      </p>
                      <Button variant="outline" onClick={() => {
                        toast({ title: "Backup started", description: "Preparing full data export..." });
                      }}>
                        <Download size={16} className="mr-2" />
                        Download Backup
                      </Button>
                    </CardContent>
                  </Card>
                  <Card className="bg-muted/30">
                    <CardContent className="p-4">
                      <h4 className="font-medium mb-2">Scheduled Backups</h4>
                      <p className="text-sm text-muted-foreground mb-4">
                        Configure automatic daily or weekly backups
                      </p>
                      <div className="flex items-center gap-2">
                        <Switch />
                        <span className="text-sm">Enable auto-backup</span>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      <RestrictionBanner />
    </MainLayout>
  );
};

export default ConfigurationPage;
