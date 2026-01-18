import { Routes, Route, Navigate } from 'react-router-dom';
import ModuleNavigation from '../../components/common/ModuleNavigation';
import ContentLibraryPage from './ContentLibraryPage';
import CommunityPage from './CommunityPage';
import CounselingPage from './CounselingPage';
import ChatPage from './ChatPage';

export default function PassionCouplesPage() {
  return (
    <div>
      <ModuleNavigation module="couples" />
      <Routes>
        <Route index element={<Navigate to="content-library" replace />} />
        <Route path="content-library" element={<ContentLibraryPage />} />
        <Route path="community" element={<CommunityPage />} />
        <Route path="counseling" element={<CounselingPage />} />
        <Route path="chat" element={<ChatPage />} />
      </Routes>
    </div>
  );
}

