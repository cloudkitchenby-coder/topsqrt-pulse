import { useState } from "react";
import { MainLayout } from "@/components/layout/MainLayout";
import { Header } from "@/components/dashboard/Header";
import { MetricsBar } from "@/components/dashboard/MetricsBar";
import { BoxGrid } from "@/components/dashboard/BoxGrid";
import { ActionModal } from "@/components/dashboard/ActionModal";
import { MasterAdminView } from "@/components/dashboard/MasterAdminView";
import { RestrictionBanner } from "@/components/dashboard/RestrictionBanner";
import { 
  initialOfficerBoxes, 
  initialUserBoxes, 
  DashboardBoxData 
} from "@/lib/mockData";

const Dashboard = () => {
  const [selectedLocation, setSelectedLocation] = useState("Lawrence Road");
  const [isMasterView, setIsMasterView] = useState(false);
  const [officerBoxes, setOfficerBoxes] = useState<DashboardBoxData[]>(initialOfficerBoxes);
  const [userBoxes, setUserBoxes] = useState<DashboardBoxData[]>(initialUserBoxes);
  const [selectedBox, setSelectedBox] = useState<DashboardBoxData | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleBoxClick = (box: DashboardBoxData) => {
    setSelectedBox(box);
    setIsModalOpen(true);
  };

  const handleSave = (boxId: string, result: string) => {
    const updateBoxes = (boxes: DashboardBoxData[]) =>
      boxes.map((box) => {
        if (box.id === boxId) {
          if (result === "done") {
            return { ...box, count: Math.max(0, (box.count || 1) - 1) };
          } else if (result === "follow-up" || result === "pending") {
            return { ...box, count: (box.count || 0) + 1 };
          }
        }
        return box;
      });

    setOfficerBoxes(updateBoxes);
    setUserBoxes(updateBoxes);
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

      <ActionModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        box={selectedBox}
        onSave={handleSave}
      />
    </MainLayout>
  );
};

export default Dashboard;
