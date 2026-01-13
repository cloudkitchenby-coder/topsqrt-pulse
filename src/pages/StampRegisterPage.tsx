import { useMemo } from "react";
import { MainLayout } from "@/components/layout/MainLayout";
import { PageHeader } from "@/components/common/PageHeader";
import { DataTable } from "@/components/common/DataTable";
import { stampRecords, StampRecord } from "@/lib/extendedMockData";
import { Card, CardContent } from "@/components/ui/card";
import { FileText, DollarSign, TrendingUp } from "lucide-react";
import { RestrictionBanner } from "@/components/dashboard/RestrictionBanner";

const StampRegisterPage = () => {
  const stats = useMemo(() => {
    const totalAmount = stampRecords.reduce((sum, s) => sum + s.amount, 0);
    const stampTypes = [...new Set(stampRecords.map(s => s.stampType))];
    
    return {
      totalRecords: stampRecords.length,
      totalAmount,
      stampTypes: stampTypes.length,
    };
  }, []);

  const columns = [
    { key: "date", header: "Date", sortable: true },
    { key: "clientName", header: "Client Name", sortable: true },
    { key: "unit", header: "Unit" },
    { key: "stampType", header: "Stamp Type", sortable: true },
    { 
      key: "amount", 
      header: "Amount",
      render: (stamp: StampRecord) => (
        <span className="font-semibold">₹{stamp.amount.toLocaleString()}</span>
      )
    },
    { key: "officer", header: "Officer", sortable: true },
  ];

  return (
    <MainLayout>
      <PageHeader
        title="Stamp Register"
        subtitle="Track and manage stamp records"
        breadcrumbs={[{ label: "Stamp Register" }]}
      />

      <div className="p-6 space-y-6">
        {/* Summary Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Card className="bg-gradient-to-br from-purple-50 to-purple-100/50 border-purple-200">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-purple-500 rounded-lg">
                  <FileText className="text-white" size={20} />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Total Records</p>
                  <p className="text-xl font-bold text-purple-700">{stats.totalRecords}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-green-50 to-green-100/50 border-green-200">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-green-500 rounded-lg">
                  <DollarSign className="text-white" size={20} />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Total Amount</p>
                  <p className="text-xl font-bold text-green-700">₹{stats.totalAmount.toLocaleString()}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-blue-50 to-blue-100/50 border-blue-200">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-500 rounded-lg">
                  <TrendingUp className="text-white" size={20} />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Stamp Types</p>
                  <p className="text-xl font-bold text-blue-700">{stats.stampTypes}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <DataTable
          data={stampRecords}
          columns={columns}
          searchPlaceholder="Search stamps..."
          exportFileName="stamp_register"
        />
      </div>

      <RestrictionBanner />
    </MainLayout>
  );
};

export default StampRegisterPage;
