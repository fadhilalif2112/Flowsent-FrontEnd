import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import MainLayout from "./components/layout/MainLayout";
import InboxPage from "./pages/InboxPage";
import ArchivePage from "./pages/ArchivePage";
import DraftsPage from "./pages/DraftsPage";
import SentPage from "./pages/SentPage";
import StarredPage from "./pages/StarredPage";
import TrashPage from "./pages/TrashPage";
import "./App.css";
import NotFound from "./pages/NotFound";

function App() {
  return (
    <Router>
      <MainLayout>
        <Routes>
          {/* route if page not found */}
          <Route path="*" element={<NotFound />} />

          {/* Main Routes */}
          <Route path="/" element={<InboxPage />} />
          <Route path="/inbox" element={<InboxPage />} />
          <Route path="/archive" element={<ArchivePage />} />
          <Route path="/drafts" element={<DraftsPage />} />
          <Route path="/sent" element={<SentPage />} />
          <Route path="/starred" element={<StarredPage />} />
          <Route path="/trash" element={<TrashPage />} />
        </Routes>
      </MainLayout>
    </Router>
  );
}

export default App;
