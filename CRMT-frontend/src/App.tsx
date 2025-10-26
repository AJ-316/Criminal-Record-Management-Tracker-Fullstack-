import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import Layout from "./components/Layout";
import ProtectedRoute from "./components/ProtectedRoute";

// Public Pages
import PublicHome from "./pages/PublicHome";
import Login from "./pages/Login"; // Corrected import path
import Register from "./pages/Register";
import NotFound from "./pages/NotFound";

// Police/Admin Pages
import PoliceAdminDashboard from "./pages/PoliceAdminDashboard";
import CriminalsList from "./pages/CriminalsList";
import AddParty from "./pages/AddParty";
import ViewCriminalProfile from "./pages/ViewCriminalProfile";
import AddFIR from "./pages/AddFIR";
import CaseFiles from "./pages/CaseFiles";
import ViewCase from "./pages/ViewCase";

// Lawyer Pages
import LawyerDashboard from "./pages/LawyerDashboard";

// Public User Specific Pages
import ReportCriminalSighting from "./pages/ReportCriminalSighting";
import PublicAlerts from "./pages/PublicAlerts";
import SubmissionHistory from "./pages/SubmissionHistory";


const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <Routes>
            {/* Public Routes */}
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/" element={<Layout><PublicHome /></Layout>} />

            {/* Protected Routes for Police/Admin */}
            <Route element={<ProtectedRoute allowedRoles={["police", "admin"]} />}>
              <Route path="/police/dashboard" element={<Layout><PoliceAdminDashboard /></Layout>} />
              <Route path="/police/add-party" element={<Layout><AddParty /></Layout>} />
              {/* Redirect from old route to new one to avoid 404s from bookmarks or cached links */}
              <Route path="/police/add-criminal" element={<Layout><Navigate to="/police/add-party" replace /></Layout>} />
              <Route path="/police/criminals" element={<Layout><CriminalsList /></Layout>} />
              <Route path="/police/criminal/:id" element={<Layout><ViewCriminalProfile /></Layout>} />
              <Route path="/police/firs" element={<Layout><AddFIR /></Layout>} />
              {/* Case Management Routes */}
              <Route path="/police/case-files" element={<Layout><CaseFiles /></Layout>} />
              <Route path="/cases/:id" element={<Layout><ViewCase /></Layout>} />
              <Route path="/police/reports" element={<Layout><div>Police/Admin Reports Page</div></Layout>} />
              <Route path="/police/alerts" element={<Layout><div>Police/Admin Alerts Page</div></Layout>} />
            </Route>

            {/* Protected Routes for Lawyer */}
            <Route element={<ProtectedRoute allowedRoles={["lawyer"]} />}>
              <Route path="/lawyer/dashboard" element={<Layout><LawyerDashboard /></Layout>} />
              <Route path="/lawyer/criminal-profiles" element={<Layout><div>Lawyer View Criminal Profiles Page</div></Layout>} />
              <Route path="/lawyer/search" element={<Layout><div>Lawyer Search Records Page</div></Layout>} />
              {/* Placeholder for Download Case PDF */}
            </Route>

            {/* Protected Routes for Public User (some pages might be accessible without login, but for now, let's protect them) */}
            <Route element={<ProtectedRoute allowedRoles={["public"]} />}>
              <Route path="/public/report-sighting" element={<Layout><ReportCriminalSighting /></Layout>} />
              <Route path="/public/alerts" element={<Layout><PublicAlerts /></Layout>} />
              <Route path="/public/submission-history" element={<Layout><SubmissionHistory /></Layout>} />
            </Route>

            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;