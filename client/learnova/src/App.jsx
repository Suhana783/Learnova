import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';

// ─── Public Site ───────────────────────────────────────────────────────────────
import PublicLayout   from './public-site/layouts/PublicLayout';
import Landing        from './public-site/pages/Landing';
import CourseCatalog  from './public-site/pages/CourseCatalog';
import CourseDetail   from './public-site/pages/CourseDetail';

// ─── Student Dashboard ─────────────────────────────────────────────────────────
// (empty — will be wired up in the next phase)

// ─── Admin Panel ───────────────────────────────────────────────────────────────
// (empty — will be wired up in a later phase)

export default function App() {
  return (
    <Routes>
      {/* ── Public Routes ── */}
      <Route element={<PublicLayout />}>
        <Route path="/"           element={<Landing />} />
        <Route path="/courses"    element={<CourseCatalog />} />
        <Route path="/courses/:id" element={<CourseDetail />} />
      </Route>

      {/* Catch-all → home */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
