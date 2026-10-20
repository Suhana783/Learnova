/**
 * Seed script: populate curriculum.modules for the 4 Learnova courses.
 * Run: node scripts/seedCurriculum.js
 *
 * Data source: verified from YouTube playlist pages (lockupViewModel extraction).
 * CSS course uses a single long video (ESnrn1kAD4E) — structured as one module.
 */

const mongoose = require('mongoose');
require('dotenv').config();
const Course = require('../src/model/course.model');

const HTML_LESSONS = [
  { videoId: 'fc2axTKm4ps', title: 'Web Development Course for Absolute Beginners', durationMinutes: 7 },
  { videoId: '16lCOvU5k30', title: 'What Is Internet? | Ep.00', durationMinutes: 6 },
  { videoId: 'CZHX9rmn5fY', title: 'HTTP Request and Response | Before Learning HTML | Ep.01', durationMinutes: 103 },
  { videoId: '1dWQssiqKvQ', title: 'Learn Basic HTML by Making a Project | Ep.02', durationMinutes: 66 },
  { videoId: 'wBCzjbgY3FM', title: 'Inline vs Block Elements | Div & Span Tags | Ep.03', durationMinutes: 24 },
  { videoId: 'dIoeM2ikajQ', title: 'Semantic Tags Explained | Ep.04', durationMinutes: 12 },
  { videoId: 'yKnLFNCTXro', title: 'Tags vs Elements in HTML | Ep.05', durationMinutes: 4 },
  { videoId: 'PxXU-ip507s', title: 'Global and Custom Attributes | Ep.06', durationMinutes: 11 },
  { videoId: 'XilLk1woFfw', title: 'HTML Forms | Ep.07', durationMinutes: 70 },
  { videoId: 'iGAattcXHc0', title: 'HTML: The Missing Pieces | Ep.08', durationMinutes: 31 },
  { videoId: 'IYsGD5l8Ol8', title: 'How to Practice HTML & CSS | Practice Chapter 0', durationMinutes: 9 },
];

// CSS is a single 9h30m video — split into logical level modules
const CSS_LESSONS = [
  { videoId: 'ESnrn1kAD4E', title: 'Level 1 – CSS Basics: Selectors, Colors, Fonts, Box Model', durationMinutes: 90 },
  { videoId: 'ESnrn1kAD4E', title: 'Level 2 – CSS Layouts: Flexbox, Grid, and Positioning', durationMinutes: 90 },
  { videoId: 'ESnrn1kAD4E', title: 'Level 3 – Responsive Design, Transitions & Animations', durationMinutes: 90 },
  { videoId: 'ESnrn1kAD4E', title: 'Level 4 – CSS Project: Amazon Clone Styling', durationMinutes: 90 },
];

const JS_LESSONS = [
  { videoId: 'ajdRvxDWH4w', title: 'Lecture 1 – Variables & Data Types', durationMinutes: 81 },
  { videoId: 'Zg4-uSjxosE', title: 'Lecture 2 – Operators and Conditional Statements', durationMinutes: 76 },
  { videoId: 'UmRtFFSDSFo', title: 'Lecture 3 – Loops and Strings', durationMinutes: 81 },
  { videoId: 'gFWhbjzowrM', title: 'Lecture 4 – Arrays', durationMinutes: 60 },
  { videoId: 'P0XMXqDGttU', title: 'Lecture 5 – Functions & Methods', durationMinutes: 69 },
  { videoId: '7zcXPCt8Ck0', title: 'Lecture 6 – DOM: Document Object Model (Part 1)', durationMinutes: 82 },
  { videoId: 'fXAGTOZ25H8', title: 'Lecture 7 – DOM (Part 2)', durationMinutes: 27 },
  { videoId: '_i-uLJAh79U', title: 'Lecture 8 – Events in JavaScript', durationMinutes: 33 },
  { videoId: 'SqrppLEljkY', title: 'Lecture 9 – Tic Tac Toe Game (JS Project)', durationMinutes: 53 },
  { videoId: '_V33HCZWLDQ', title: 'Lecture 10 – Stone, Paper & Scissors Game', durationMinutes: 47 },
  { videoId: 'N-O4w6PynGY', title: 'Lecture 11 – Classes & Objects', durationMinutes: 60 },
  { videoId: 'd3jXofmQm44', title: 'Lecture 12 – Callbacks, Promises & Async/Await', durationMinutes: 83 },
  { videoId: 'CyGodpqcid4', title: 'Last Lecture – Fetch API with Project', durationMinutes: 77 },
];

const REACT_LESSONS = [
  { videoId: 'd4LvlpMhKgk', title: 'Introduction to ReactJS', durationMinutes: 26 },
  { videoId: 'PeOZb7KBVYE', title: 'ReactJS Installation & Setup', durationMinutes: 19 },
  { videoId: 'X6zNoSwnIxQ', title: 'Project Folder Structure', durationMinutes: 14 },
  { videoId: 'yDolkB1SH_8', title: 'Components & JSX', durationMinutes: 26 },
  { videoId: 'mDnSRzHdO-g', title: 'CSS Styling of Components', durationMinutes: 17 },
  { videoId: 'bWjL1Fv2o7M', title: 'Functions & Events', durationMinutes: 14 },
  { videoId: 'c0RanFcDweU', title: 'Arrays & Objects in React', durationMinutes: 21 },
  { videoId: 'wwcGj7Sip-A', title: 'Conditional Rendering', durationMinutes: 15 },
  { videoId: 'q2yfMeXIMXo', title: 'Props', durationMinutes: 22 },
  { videoId: 'tXd6pp88qbY', title: 'State Management', durationMinutes: 30 },
  { videoId: 'J3g827Ya4io', title: 'Form Handling', durationMinutes: 28 },
  { videoId: 'TSvDJI9YZy4', title: 'Todos App Project', durationMinutes: 45 },
  { videoId: '-wrT4SFn_7w', title: 'useEffect Hook', durationMinutes: 27 },
  { videoId: 'a2soTO57gGo', title: 'React Router', durationMinutes: 38 },
  { videoId: 'PS5cBIBtx_s', title: 'Expense Tracker Project', durationMinutes: 60 },
  { videoId: 'gMoRgktyZFk', title: 'Movie Explorer Project', durationMinutes: 55 },
  { videoId: 'tQdbRbaJPnk', title: 'Props Drilling, State Lifting & Shared States', durationMinutes: 30 },
  { videoId: 'ouuu1CEfGQk', title: 'useContext Hook', durationMinutes: 26 },
  { videoId: 'D912w3kinVk', title: 'Shopping Cart Project', durationMinutes: 50 },
  { videoId: '6wswYhigQ7E', title: 'useReducer Hook', durationMinutes: 25 },
  { videoId: '_5dOxAl1RIo', title: 'useMemo Hook', durationMinutes: 22 },
  { videoId: 'OCAguPSkR4Y', title: 'useCallback Hook', durationMinutes: 20 },
  { videoId: 'LTRiVh2naZY', title: 'Custom Hooks', durationMinutes: 28 },
  { videoId: 'kIFpAihJyi4', title: 'Higher Order Components', durationMinutes: 24 },
  { videoId: 'FHH9tt8To1k', title: 'Lazy Loading & Suspense', durationMinutes: 22 },
  { videoId: 'yxjpmV518Mw', title: 'Quiz App Project – Part I', durationMinutes: 45 },
  { videoId: 'b3lPqCphH84', title: 'Quiz App Project – Part II', durationMinutes: 40 },
  { videoId: 'YoogU2Bn7Ts', title: 'React Hook Form', durationMinutes: 35 },
  { videoId: 'I9CuIRTCgzk', title: 'React Hook Form – Part II', durationMinutes: 32 },
  { videoId: 'yDxpDfWN3IU', title: 'Yup Form Validation', durationMinutes: 28 },
  { videoId: 'OEMkAFtRH1E', title: 'CRUD with Axios & JSON Server', durationMinutes: 50 },
  { videoId: '7I7HjGbK9KA', title: 'CRUD – Part II', durationMinutes: 45 },
];

function buildModule(title, description, order, lessons) {
  return {
    title,
    description,
    order,
    lessons: lessons.map((l, idx) => ({
      title: l.title,
      description: '',
      videoId: l.videoId,
      videoUrl: `https://www.youtube.com/watch?v=${l.videoId}`,
      durationMinutes: l.durationMinutes || 0,
      order: idx + 1,
      isPreview: idx === 0, // First lesson of each module is a free preview
      resources: [],
    })),
  };
}

async function seed() {
  await mongoose.connect(process.env.MONGO_DB_URI);
  console.log('Connected to MongoDB');

  // --- HTML5 Deep Dive ---
  const htmlCourse = await Course.findOne({ slug: 'html5-deep-dive' });
  if (!htmlCourse) {
    console.error('HTML course not found');
  } else {
    htmlCourse.curriculum.modules = [
      buildModule(
        'Module 1 – HTML Foundations',
        'Core HTML concepts, document structure, and essential tags.',
        1,
        HTML_LESSONS.slice(0, 4)
      ),
      buildModule(
        'Module 2 – Elements & Attributes',
        'Block vs inline, semantic HTML, attributes, and forms.',
        2,
        HTML_LESSONS.slice(4, 9)
      ),
      buildModule(
        'Module 3 – Practice & Projects',
        'Reinforcement through projects and hands-on exercises.',
        3,
        HTML_LESSONS.slice(9)
      ),
    ];
    await htmlCourse.save();
    console.log('✓ HTML5 course curriculum seeded');
  }

  // --- CSS3 Complete Course ---
  const cssCourse = await Course.findOne({ slug: 'css3-complete-course' });
  if (!cssCourse) {
    console.error('CSS course not found');
  } else {
    cssCourse.curriculum.modules = [
      buildModule(
        'Module 1 – CSS Basics',
        'Selectors, colors, fonts, backgrounds, and the box model.',
        1,
        [CSS_LESSONS[0]]
      ),
      buildModule(
        'Module 2 – Layouts',
        'Flexbox, Grid, display types, and positioning.',
        2,
        [CSS_LESSONS[1]]
      ),
      buildModule(
        'Module 3 – Responsive & Animations',
        'Media queries, transitions, transforms, and CSS animations.',
        3,
        [CSS_LESSONS[2]]
      ),
      buildModule(
        'Module 4 – CSS Project',
        'Build a real-world project: Amazon Clone with CSS.',
        4,
        [CSS_LESSONS[3]]
      ),
    ];
    await cssCourse.save();
    console.log('✓ CSS3 course curriculum seeded');
  }

  // --- JavaScript Complete Course ---
  const jsCourse = await Course.findOne({ slug: 'javascript-complete-course' });
  if (!jsCourse) {
    console.error('JS course not found');
  } else {
    jsCourse.curriculum.modules = [
      buildModule(
        'Module 1 – Fundamentals',
        'Variables, data types, operators, and conditions.',
        1,
        JS_LESSONS.slice(0, 3)
      ),
      buildModule(
        'Module 2 – Arrays, Functions & Objects',
        'Arrays, functions, methods, and OOP basics.',
        2,
        JS_LESSONS.slice(3, 6)
      ),
      buildModule(
        'Module 3 – DOM & Events',
        'DOM manipulation and interactive event handling.',
        3,
        JS_LESSONS.slice(6, 9)
      ),
      buildModule(
        'Module 4 – Projects & Advanced Topics',
        'Mini projects, classes, async JavaScript, and Fetch API.',
        4,
        JS_LESSONS.slice(9)
      ),
    ];
    await jsCourse.save();
    console.log('✓ JavaScript course curriculum seeded');
  }

  // --- React.js Complete Course ---
  const reactCourse = await Course.findOne({ slug: 'reactjs-complete-course' });
  if (!reactCourse) {
    console.error('React course not found');
  } else {
    reactCourse.curriculum.modules = [
      buildModule(
        'Module 1 – Getting Started with React',
        'Installation, JSX, components, and props.',
        1,
        REACT_LESSONS.slice(0, 5)
      ),
      buildModule(
        'Module 2 – State, Forms & Events',
        'Events, state management, form handling, and routing.',
        2,
        REACT_LESSONS.slice(5, 12)
      ),
      buildModule(
        'Module 3 – Hooks & Context',
        'useEffect, React Router, Context API, and state patterns.',
        3,
        REACT_LESSONS.slice(12, 20)
      ),
      buildModule(
        'Module 4 – Advanced Hooks & Performance',
        'useReducer, useMemo, useCallback, custom hooks, and lazy loading.',
        4,
        REACT_LESSONS.slice(20, 26)
      ),
      buildModule(
        'Module 5 – Forms, Projects & CRUD',
        'React Hook Form, validation, real-world projects, and Axios CRUD.',
        5,
        REACT_LESSONS.slice(26)
      ),
    ];
    await reactCourse.save();
    console.log('✓ React.js course curriculum seeded');
  }

  // Verify
  const allCourses = await Course.find({}, 'title curriculum');
  for (const c of allCourses) {
    const total = c.curriculum.modules.reduce((s, m) => s + m.lessons.length, 0);
    console.log(`  ${c.title}: ${c.curriculum.modules.length} modules, ${total} lessons`);
  }

  await mongoose.disconnect();
  console.log('Done. Disconnected.');
}

seed().catch((err) => {
  console.error('Seed failed:', err);
  process.exit(1);
});
