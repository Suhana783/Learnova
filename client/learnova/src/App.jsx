import { Routes, Route, Navigate } from 'react-router-dom';

import PublicLayout   from './public-site/layouts/PublicLayout';
import Landing        from './public-site/pages/Landing';
import CourseCatalog  from './public-site/pages/CourseCatalog';
import CourseDetail   from './public-site/pages/CourseDetail';
import SignUp         from './public-site/pages/SignUp';
import Login          from './public-site/pages/Login';

import StudentDashboardLayout from './student-dashboard/layouts/StudentDashboardLayout';
import Overview               from './student-dashboard/pages/Overview';
import Profile                from './student-dashboard/pages/Profile';
import Assignments            from './student-dashboard/pages/Assignments';
import CourseLearning         from './student-dashboard/pages/CourseLearning';

export default function App() {
  return (
    <Routes>

      <Route element={<PublicLayout />}>
        <Route path="/"            element={<Landing />} />
        <Route path="/courses"     element={<CourseCatalog />} />
        <Route path="/courses/:id" element={<CourseDetail />} />
        <Route path="/signup"      element={<SignUp />} />
        <Route path="/login"       element={<Login />} />
      </Route>

      <Route path="/student" element={<StudentDashboardLayout />}>
        <Route index                      element={<Navigate to="/student/dashboard" replace />} />
        <Route path="dashboard"           element={<Overview />} />
        <Route path="profile"             element={<Profile />} />
        <Route path="assignments"         element={<Assignments />} />
      </Route>

      <Route path="/student/learn/:courseId" element={<CourseLearning />} />

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
