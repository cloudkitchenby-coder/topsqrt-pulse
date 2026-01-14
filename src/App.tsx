import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { SystemProvider } from "@/context/SystemContext";
import Dashboard from "./pages/Dashboard";
import ClientsPage from "./pages/ClientsPage";
import PaymentsPage from "./pages/PaymentsPage";
import UnsubscriberPage from "./pages/UnsubscriberPage";
import ClosedUnitsPage from "./pages/ClosedUnitsPage";
import StampRegisterPage from "./pages/StampRegisterPage";
import ReportsPage from "./pages/ReportsPage";
import LiveMonitoringPage from "./pages/LiveMonitoringPage";
import ConfigurationPage from "./pages/ConfigurationPage";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <SystemProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/clients" element={<ClientsPage />} />
            <Route path="/payments" element={<PaymentsPage />} />
            <Route path="/unsubscriber" element={<UnsubscriberPage />} />
            <Route path="/closed-units" element={<ClosedUnitsPage />} />
            <Route path="/stamp-register" element={<StampRegisterPage />} />
            <Route path="/reports" element={<ReportsPage />} />
            <Route path="/reports/:reportType" element={<ReportsPage />} />
            <Route path="/live-monitoring" element={<LiveMonitoringPage />} />
            <Route path="/configuration" element={<ConfigurationPage />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </SystemProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
