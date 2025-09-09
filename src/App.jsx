import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import MainLayout from "./components/layout/MainLayout";
import InboxPage from "./pages/InboxPage";
import ArchivePage from "./pages/ArchivePage";
import DraftsPage from "./pages/DraftsPage";
import SentPage from "./pages/SentPage";
import StarredPage from "./pages/StarredPage";
import TrashPage from "./pages/TrashPage";
import SpamPage from "./pages/SpamPage";
import "./App.css";
import NotFound from "./pages/NotFound";
import LoginPage from "./pages/LoginPage";
import GuestRoute from "./components/auth/GuestRoute";
import ProtectedRoute from "./components/auth/ProtectedRoute";
import { EmailProvider } from "./context/EmailContext";
import EmailDetailPage from "./pages/EmailDetailPage";
import ProfilePage from "./pages/ProfilePage";

function App() {
  return (
    <Router>
      <Routes>
        {/* Login hanya bisa diakses kalau belum login */}
        <Route
          path="/login"
          element={
            <GuestRoute>
              <LoginPage />
            </GuestRoute>
          }
        />

        {/* Routes yang butuh login + email data */}
        <Route
          element={
            <ProtectedRoute>
              <EmailProvider>
                <MainLayout />
              </EmailProvider>
            </ProtectedRoute>
          }
        >
          <Route path="/" element={<InboxPage />} />
          <Route path="/inbox" element={<InboxPage />} />
          <Route path="/archive" element={<ArchivePage />} />
          <Route path="/draft" element={<DraftsPage />} />
          <Route path="/sent" element={<SentPage />} />
          <Route path="/junk" element={<SpamPage />} />
          <Route path="/deleted" element={<TrashPage />} />
          <Route path="/starred" element={<StarredPage />} />
          <Route path="/profile" element={<ProfilePage />} />

          {/* Email detail routes */}
          <Route path="inbox/:uid" element={<EmailDetailPage />} />
          <Route path="sent/:uid" element={<EmailDetailPage />} />
          <Route path="draft/:uid" element={<EmailDetailPage />} />
          <Route path="deleted/:uid" element={<EmailDetailPage />} />
          <Route path="junk/:uid" element={<EmailDetailPage />} />
          <Route path="archive/:uid" element={<EmailDetailPage />} />
          <Route path="starred/:uid" element={<EmailDetailPage />} />

          {/* Not Found */}
          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
