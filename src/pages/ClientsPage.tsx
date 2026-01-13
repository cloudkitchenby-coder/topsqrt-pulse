import { useState } from "react";
import { MainLayout } from "@/components/layout/MainLayout";
import { PageHeader } from "@/components/common/PageHeader";
import { DataTable } from "@/components/common/DataTable";
import { AutoStatusBadge } from "@/components/common/StatusBadge";
import { extendedClients, ExtendedClient } from "@/lib/extendedMockData";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Plus, Eye, Pencil, Trash2, Phone, Mail, MapPin } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { RestrictionBanner } from "@/components/dashboard/RestrictionBanner";

const areasList = ['All Areas', 'Lawrence Road', 'Rohini', 'Dwarka', 'Saket', 'Janakpuri', 'Model Town', 'Civil Lines', 'Pitampura', 'Karol Bagh', 'Lajpat Nagar'];

const ClientsPage = () => {
  const { toast } = useToast();
  const [selectedArea, setSelectedArea] = useState("All Areas");
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [viewClient, setViewClient] = useState<ExtendedClient | null>(null);

  const filteredClients = extendedClients.filter(client => {
    if (selectedArea !== "All Areas" && client.area !== selectedArea) return false;
    if (selectedStatus !== "all" && client.status !== selectedStatus) return false;
    return true;
  });

  const columns = [
    { key: "clientId", header: "Client ID", sortable: true },
    { key: "name", header: "Client Name", sortable: true },
    { key: "unit", header: "Unit", sortable: true },
    { key: "area", header: "Area", sortable: true },
    { key: "phone", header: "Phone" },
    { 
      key: "status", 
      header: "Status",
      render: (client: ExtendedClient) => (
        <AutoStatusBadge status={client.status} />
      )
    },
    { key: "lastContact", header: "Last Contact", sortable: true },
    {
      key: "actions",
      header: "Actions",
      render: (client: ExtendedClient) => (
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8"
            onClick={(e) => {
              e.stopPropagation();
              setViewClient(client);
            }}
          >
            <Eye size={16} />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8"
            onClick={(e) => {
              e.stopPropagation();
              toast({ title: "Edit mode", description: "Opening client editor..." });
            }}
          >
            <Pencil size={16} />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 text-destructive hover:text-destructive"
            onClick={(e) => {
              e.stopPropagation();
              toast({ title: "Delete", description: "Client deletion not available in demo", variant: "destructive" });
            }}
          >
            <Trash2 size={16} />
          </Button>
        </div>
      )
    }
  ];

  return (
    <MainLayout>
      <PageHeader
        title="Clients"
        subtitle={`${filteredClients.length} total clients`}
        breadcrumbs={[{ label: "Clients" }]}
        actions={
          <Button className="bg-primary">
            <Plus size={18} className="mr-2" />
            Add New Client
          </Button>
        }
      />

      <div className="p-6 space-y-4">
        {/* Filters */}
        <div className="flex flex-wrap gap-4">
          <Select value={selectedArea} onValueChange={setSelectedArea}>
            <SelectTrigger className="w-48">
              <SelectValue placeholder="Filter by Area" />
            </SelectTrigger>
            <SelectContent>
              {areasList.map(area => (
                <SelectItem key={area} value={area}>{area}</SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={selectedStatus} onValueChange={setSelectedStatus}>
            <SelectTrigger className="w-48">
              <SelectValue placeholder="Filter by Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="inactive">Inactive</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <DataTable
          data={filteredClients}
          columns={columns}
          searchPlaceholder="Search clients..."
          exportFileName="clients_data"
        />
      </div>

      <RestrictionBanner />

      {/* View Client Dialog */}
      <Dialog open={!!viewClient} onOpenChange={() => setViewClient(null)}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Client Details</DialogTitle>
          </DialogHeader>
          {viewClient && (
            <div className="space-y-4">
              <div className="text-center pb-4 border-b">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-3">
                  <span className="text-2xl font-bold text-primary">
                    {viewClient.name.charAt(0)}
                  </span>
                </div>
                <h3 className="text-lg font-semibold">{viewClient.name}</h3>
                <p className="text-sm text-muted-foreground">{viewClient.clientId}</p>
              </div>

              <div className="space-y-3">
                <div className="flex items-center gap-3 text-sm">
                  <MapPin size={16} className="text-muted-foreground" />
                  <span>Unit: {viewClient.unit}, {viewClient.area}</span>
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <Phone size={16} className="text-muted-foreground" />
                  <span>{viewClient.phone}</span>
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <Mail size={16} className="text-muted-foreground" />
                  <span>{viewClient.email}</span>
                </div>
              </div>

              <div className="bg-muted/50 rounded-lg p-4 space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Status</span>
                  <AutoStatusBadge status={viewClient.status} />
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Total Amount</span>
                  <span className="font-semibold">₹{viewClient.totalAmount.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Paid Amount</span>
                  <span className="font-semibold text-green-600">₹{viewClient.paidAmount.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Pending</span>
                  <span className="font-semibold text-red-600">₹{(viewClient.totalAmount - viewClient.paidAmount).toLocaleString()}</span>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </MainLayout>
  );
};

export default ClientsPage;
