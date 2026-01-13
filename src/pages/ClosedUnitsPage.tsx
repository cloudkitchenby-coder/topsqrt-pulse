import { MainLayout } from "@/components/layout/MainLayout";
import { PageHeader } from "@/components/common/PageHeader";
import { DataTable } from "@/components/common/DataTable";
import { AutoStatusBadge } from "@/components/common/StatusBadge";
import { closedUnits, ClosedUnit } from "@/lib/extendedMockData";
import { Button } from "@/components/ui/button";
import { RotateCcw, Archive } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { RestrictionBanner } from "@/components/dashboard/RestrictionBanner";

const ClosedUnitsPage = () => {
  const { toast } = useToast();

  const columns = [
    { key: "unit", header: "Unit", sortable: true },
    { key: "clientName", header: "Client Name", sortable: true },
    { key: "area", header: "Area", sortable: true },
    { key: "closureDate", header: "Closure Date", sortable: true },
    { key: "reason", header: "Reason" },
    { 
      key: "finalSettlement", 
      header: "Settlement Status",
      render: (unit: ClosedUnit) => (
        <AutoStatusBadge status={unit.finalSettlement} />
      )
    },
    {
      key: "actions",
      header: "Actions",
      render: (unit: ClosedUnit) => (
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={(e) => {
              e.stopPropagation();
              toast({ 
                title: "Reopen Request", 
                description: `Reopen request submitted for ${unit.unit}` 
              });
            }}
          >
            <RotateCcw size={14} className="mr-1" />
            Reopen
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={(e) => {
              e.stopPropagation();
              toast({ title: "Archived", description: "Unit moved to archive" });
            }}
          >
            <Archive size={14} />
          </Button>
        </div>
      )
    }
  ];

  return (
    <MainLayout>
      <PageHeader
        title="Closed Units"
        subtitle={`${closedUnits.length} closed units`}
        breadcrumbs={[{ label: "Closed Units" }]}
      />

      <div className="p-6">
        <DataTable
          data={closedUnits}
          columns={columns}
          searchPlaceholder="Search closed units..."
          exportFileName="closed_units"
        />
      </div>

      <RestrictionBanner />
    </MainLayout>
  );
};

export default ClosedUnitsPage;
