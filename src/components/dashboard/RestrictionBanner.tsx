import { AlertTriangle } from "lucide-react";

export const RestrictionBanner = () => {
  return (
    <div className="bg-destructive/10 border-t border-destructive/20 py-3 mt-auto">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-center gap-2 text-destructive">
          <AlertTriangle className="h-4 w-4" />
          <span className="text-sm font-medium">
            ⚠️ NO BILLING / GST FEATURES | NO MANUAL EDITING
          </span>
        </div>
      </div>
    </div>
  );
};
