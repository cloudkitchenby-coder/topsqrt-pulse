import { DashboardBox } from "./DashboardBox";
import { DashboardBoxData } from "@/lib/mockData";

interface BoxGridProps {
  title: string;
  subtitle: string;
  totalCount: number;
  boxes: DashboardBoxData[];
  onBoxClick: (box: DashboardBoxData) => void;
}

export const BoxGrid = ({ title, subtitle, totalCount, boxes, onBoxClick }: BoxGridProps) => {
  return (
    <div className="bg-card/50 rounded-2xl p-6 border border-border/50 backdrop-blur-sm">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-lg font-bold text-foreground">{title}</h2>
          <p className="text-sm text-muted-foreground">{subtitle}</p>
        </div>
        <div className="bg-primary/10 px-4 py-2 rounded-full">
          <span className="text-sm font-semibold text-primary">{totalCount} Total</span>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {boxes.map((box) => (
          <DashboardBox
            key={box.id}
            box={box}
            onClick={() => onBoxClick(box)}
          />
        ))}
      </div>
    </div>
  );
};
