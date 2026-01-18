import { Routes, Route, Navigate } from 'react-router-dom';
import ModuleNavigation from '../../components/common/ModuleNavigation';
import TrainingLibraryPage from './TrainingLibraryPage';
import CoursesPage from './CoursesPage';
import CourseDetailPage from './CourseDetailPage';
import CommunityPage from './CommunityPage';
import ChatPage from './ChatPage';

export default function PassionSinglesPage() {
  return (
    <div>
      <ModuleNavigation module="singles" />
      <Routes>
        <Route index element={<Navigate to="training-library" replace />} />
        <Route path="training-library" element={<TrainingLibraryPage />} />
        <Route path="courses" element={<CoursesPage />} />
        <Route path="courses/:id" element={<CourseDetailPage />} />
        <Route path="community" element={<CommunityPage />} />
        <Route path="chat" element={<ChatPage />} />
      </Routes>
    </div>
  );
}

