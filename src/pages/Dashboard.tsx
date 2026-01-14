import { useState } from "react";
import { MainLayout } from "@/components/layout/MainLayout";
import { Header } from "@/components/dashboard/Header";
import { MetricsBar } from "@/components/dashboard/MetricsBar";
import { BoxGrid } from "@/components/dashboard/BoxGrid";
import { ActionModal } from "@/components/dashboard/ActionModal";
import { MasterAdminView } from "@/components/dashboard/MasterAdminView";
import { RestrictionBanner } from "@/components/dashboard/RestrictionBanner";
import { ActivityLog } from "@/components/dashboard/ActivityLog";
import { useSystem } from "@/context/SystemContext";
import { 
  initialOfficerBoxes, 
  initialUserBoxes, 
  DashboardBoxData 
} from "@/lib/mockData";

const Dashboard = () => {
  const [selectedLocation, setSelectedLocation] = useState("Lawrence Road");
  const [isMasterView, setIsMasterView] = useState(false);
  const [selectedBox, setSelectedBox] = useState<DashboardBoxData | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  const { state, moveClient, getClientsInBox, getBoxCount } = useSystem();

  // Get dynamic counts from system state
  const getOfficerBoxes = (): DashboardBoxData[] => {
    return initialOfficerBoxes.map(box => ({
      ...box,
      count: getBoxCount(box.id) || box.count,
    }));
  };

  const getUserBoxes = (): DashboardBoxData[] => {
    return initialUserBoxes.map(box => ({
      ...box,
      count: getBoxCount(box.id) || box.count,
    }));
  };

  const officerBoxes = getOfficerBoxes();
  const userBoxes = getUserBoxes();

  const handleBoxClick = (box: DashboardBoxData) => {
    setSelectedBox(box);
    setIsModalOpen(true);
  };

  const handleSave = (boxId: string, result: string, clientId: string, remark: string) => {
    if (clientId) {
      moveClient(clientId, boxId, result as 'done' | 'follow-up' | 'pending', remark);
    }
  };

  const officerTotal = officerBoxes.reduce((sum, box) => sum + (box.count || 0), 0);
  const userTotal = userBoxes.reduce((sum, box) => sum + (box.count || 0), 0);

  return (
    <MainLayout>
      <Header
        selectedLocation={selectedLocation}
        onLocationChange={setSelectedLocation}
        isMasterView={isMasterView}
        onToggleView={() => setIsMasterView(!isMasterView)}
      />

      <MetricsBar />

      <main className="flex-1">
        {isMasterView ? (
          <MasterAdminView
            officerBoxes={officerBoxes}
            userBoxes={userBoxes}
            onBoxClick={handleBoxClick}
          />
        ) : (
          <div className="container mx-auto px-4 py-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <BoxGrid
                title="Officers Visit Follow-Up"
                subtitle="Field officer tasks"
                totalCount={officerTotal}
                boxes={officerBoxes}
                onBoxClick={handleBoxClick}
              />
              <BoxGrid
                title="User Follow-Up"
                subtitle="Internal team tasks"
                totalCount={userTotal}
                boxes={userBoxes}
                onBoxClick={handleBoxClick}
              />
            </div>
          </div>
        )}
      </main>

      <RestrictionBanner />
      <ActivityLog />

      <ActionModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        box={selectedBox}
        onSave={handleSave}
        clients={selectedBox ? getClientsInBox(selectedBox.id) : []}
      />
    </MainLayout>
  );
};

export default Dashboard;
