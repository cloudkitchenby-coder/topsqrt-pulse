import { useState, useMemo } from "react";
import { MainLayout } from "@/components/layout/MainLayout";
import { PageHeader } from "@/components/common/PageHeader";
import { DataTable } from "@/components/common/DataTable";
import { AutoStatusBadge } from "@/components/common/StatusBadge";
import { paymentRecords, PaymentRecord } from "@/lib/extendedMockData";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Calendar, DollarSign, TrendingUp, Clock } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { RestrictionBanner } from "@/components/dashboard/RestrictionBanner";

const PaymentsPage = () => {
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [selectedOfficer, setSelectedOfficer] = useState("all");

  const filteredPayments = paymentRecords.filter(payment => {
    if (selectedStatus !== "all" && payment.status !== selectedStatus) return false;
    if (selectedOfficer !== "all" && payment.officer !== selectedOfficer) return false;
    return true;
  });

  const officers = [...new Set(paymentRecords.map(p => p.officer))];

  const stats = useMemo(() => {
    const completed = filteredPayments.filter(p => p.status === 'completed');
    const pending = filteredPayments.filter(p => p.status === 'pending');
    
    return {
      totalCollected: completed.reduce((sum, p) => sum + p.amount, 0),
      totalPending: pending.reduce((sum, p) => sum + p.amount, 0),
      completedCount: completed.length,
      pendingCount: pending.length,
    };
  }, [filteredPayments]);

  const columns = [
    { key: "date", header: "Date", sortable: true },
    { key: "clientName", header: "Client Name", sortable: true },
    { key: "unit", header: "Unit" },
    { 
      key: "amount", 
      header: "Amount",
      render: (payment: PaymentRecord) => (
        <span className="font-semibold">₹{payment.amount.toLocaleString()}</span>
      )
    },
    { 
      key: "status", 
      header: "Status",
      render: (payment: PaymentRecord) => (
        <AutoStatusBadge status={payment.status} />
      )
    },
    { key: "officer", header: "Officer", sortable: true },
    { key: "receiptNo", header: "Receipt No." },
    { key: "paymentMethod", header: "Method" },
  ];

  return (
    <MainLayout>
      <PageHeader
        title="Payments"
        subtitle="Manage payment records and collections"
        breadcrumbs={[{ label: "Payments" }]}
      />

      <div className="p-6 space-y-6">
        {/* Summary Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="bg-gradient-to-br from-green-50 to-green-100/50 border-green-200">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-green-500 rounded-lg">
                  <DollarSign className="text-white" size={20} />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Total Collected</p>
                  <p className="text-xl font-bold text-green-700">₹{stats.totalCollected.toLocaleString()}</p>
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
                  <p className="text-sm text-muted-foreground">Pending Amount</p>
                  <p className="text-xl font-bold text-yellow-700">₹{stats.totalPending.toLocaleString()}</p>
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
                  <p className="text-sm text-muted-foreground">Completed</p>
                  <p className="text-xl font-bold text-blue-700">{stats.completedCount}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-orange-50 to-orange-100/50 border-orange-200">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-orange-500 rounded-lg">
                  <Calendar className="text-white" size={20} />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Pending</p>
                  <p className="text-xl font-bold text-orange-700">{stats.pendingCount}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap gap-4">
          <Input type="date" className="w-40" defaultValue={new Date().toISOString().split('T')[0]} />
          <span className="self-center text-muted-foreground">to</span>
          <Input type="date" className="w-40" defaultValue={new Date().toISOString().split('T')[0]} />

          <Select value={selectedStatus} onValueChange={setSelectedStatus}>
            <SelectTrigger className="w-40">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="completed">Completed</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="failed">Failed</SelectItem>
            </SelectContent>
          </Select>

          <Select value={selectedOfficer} onValueChange={setSelectedOfficer}>
            <SelectTrigger className="w-48">
              <SelectValue placeholder="Officer" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Officers</SelectItem>
              {officers.map(officer => (
                <SelectItem key={officer} value={officer}>{officer}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <DataTable
          data={filteredPayments}
          columns={columns}
          searchPlaceholder="Search payments..."
          exportFileName="payment_records"
        />
      </div>

      <RestrictionBanner />
    </MainLayout>
  );
};

export default PaymentsPage;
