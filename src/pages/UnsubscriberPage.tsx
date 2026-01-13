import { MainLayout } from "@/components/layout/MainLayout";
import { PageHeader } from "@/components/common/PageHeader";
import { DataTable } from "@/components/common/DataTable";
import { unsubscriberRecords, UnsubscriberRecord } from "@/lib/extendedMockData";
import { Button } from "@/components/ui/button";
import { RefreshCw } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { RestrictionBanner } from "@/components/dashboard/RestrictionBanner";

const UnsubscriberPage = () => {
  const { toast } = useToast();

  const columns = [
    { key: "clientName", header: "Client Name", sortable: true },
    { key: "unit", header: "Unit" },
    { key: "phone", header: "Phone" },
    { key: "area", header: "Area", sortable: true },
    { key: "unsubscribeDate", header: "Unsubscribe Date", sortable: true },
    { key: "reason", header: "Reason" },
    {
      key: "actions",
      header: "Actions",
      render: (record: UnsubscriberRecord) => (
        <Button
          variant="outline"
          size="sm"
          onClick={(e) => {
            e.stopPropagation();
            toast({ 
              title: "Re-activation Request", 
              description: `Re-activation request sent for ${record.clientName}` 
            });
          }}
        >
          <RefreshCw size={14} className="mr-1" />
          Re-activate
        </Button>
      )
    }
  ];

  return (
    <MainLayout>
      <PageHeader
        title="Unsubscribers"
        subtitle={`${unsubscriberRecords.length} unsubscribed clients`}
        breadcrumbs={[{ label: "Unsubscriber" }]}
      />

      <div className="p-6">
        <DataTable
          data={unsubscriberRecords}
          columns={columns}
          searchPlaceholder="Search unsubscribers..."
          exportFileName="unsubscriber_records"
        />
      </div>

      <RestrictionBanner />
    </MainLayout>
  );
};

export default UnsubscriberPage;
