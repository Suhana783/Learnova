import htmlImg from '../../assets/HTML-Image.png';
import cssImg from '../../assets/CSS-Image.png';
import jsImg from '../../assets/JavaScript-Image.png';
import reactImg from '../../assets/React-Image.png';

/**
 * Learnova Curated Course Catalog
 * Category: Frontend Development Track
 */
export const courses = [
  {
    id: 'html5-deep-dive',
    title: 'HTML5 Deep Dive',
    category: 'Frontend Development',
    description:
      'Build semantic structure, modern DOM hierarchies, accessible page layouts, and resilient web skeletons designed for high-performance applications.',
    longDescription:
      'Master the foundational architecture of the modern web through semantic markup, document accessibility, and standard DOM structuring. Learn to construct accessible, resilient page skeletons that search engines and assistive technologies parse effortlessly. Designed for builders who demand precision in the document layer.',
    difficulty: 'Beginner',
    rating: 4.8,
    icon: 'HTML5',
    image: htmlImg,
    duration: 'Single Masterclass',
    topics: ['Semantic Tags', 'DOM Hierarchy', 'Accessibility (a11y)', 'Forms & Validation'],
    resources: {
      videoUrl: 'https://www.youtube.com/watch?v=HcOc7P5BMi4',
      videoType: 'single',
      notesUrl: 'https://drive.google.com/drive/folders/1PmcAPvTZMopb3CwPfVVktiKtwtKFDIJp',
    },
  },
  {
    id: 'responsive-css-grid-flexbox',
    title: 'Responsive CSS, Grid & Flexbox',
    category: 'Frontend Development',
    description:
      'Craft elegant layouts that adapt to all screens. Master modern Flexbox alignments, 2D CSS Grid systems, fluid responsive typography, and layout engineering.',
    longDescription:
      'Unravel the intricacies of modern CSS layout engines, from two-dimensional Grid assemblies to fluid Flexbox alignments. Cultivate an intuitive command of fluid typography, responsive container queries, and robust viewport adaptation without relying on heavy utility bloat. Form and function engineered into pixel-perfect harmony.',
    difficulty: 'Beginner',
    rating: 4.9,
    icon: 'CSS3',
    image: cssImg,
    duration: 'Complete Guide',
    topics: ['CSS Grid 2D', 'Flexbox Alignments', 'Fluid Typography', 'Responsive Breakpoints'],
    resources: {
      videoUrl: 'https://www.youtube.com/watch?v=ESnrn1kAD4E',
      videoType: 'single',
      notesUrl: 'https://drive.google.com/drive/folders/1aUkX1itCHXsYgoRdC-RIJgloZmz2eC-F',
    },
  },
  {
    id: 'js-fundamentals-es6',
    title: 'JS Fundamentals & ES6+',
    category: 'Frontend Development',
    description:
      'The core engine of modern web interactivity. Master ES6+ syntax, asynchronous JavaScript, closures, event loops, and dynamic DOM manipulation.',
    longDescription:
      'Dive deep into the mechanical core of JavaScript, exploring execution contexts, event loops, lexical closures, and contemporary ES6+ paradigms. Develop the architectural muscle required to manipulate asynchronous workflows, state transformations, and DOM lifecycles with absolute clarity. The definitive bridge between static documents and reactive systems.',
    difficulty: 'Intermediate',
    rating: 4.9,
    icon: 'JS',
    image: jsImg,
    duration: 'Full Playlist',
    topics: ['ES6+ Syntaxes', 'Promises & Async', 'Closures & Scopes', 'DOM Manipulations'],
    resources: {
      videoUrl: 'https://www.youtube.com/watch?v=ajdRvxDWH4w&list=PLGjplNEQ1it_oTvuLRNqXfz_v_0pq6unW',
      videoType: 'playlist',
      notesUrl: 'https://drive.google.com/drive/folders/1nweZ9gZBRqqgPfdPCLJbJPrfuAARV_8e',
    },
  },
  {
    id: 'component-architecture-react',
    title: 'Component Architecture with React',
    category: 'Frontend Development',
    description:
      'Build dynamic, data-driven user interfaces. Master JSX syntax, reusable component composition, custom hooks orchestration, and state synchronization.',
    longDescription:
      "Architect modular, performant web applications leveraging React's declarative component model and unidirectional data flow. Explore compositional patterns, custom hooks orchestration, and state synchronization while preserving render velocity and clean component boundaries. Elevate your interface development from scattered views to an enterprise-grade UI foundation.",
    difficulty: 'Intermediate',
    rating: 4.85,
    icon: 'React',
    image: reactImg,
    duration: 'Full Playlist',
    topics: ['Component Architecture', 'Custom Hooks', 'State Management', 'UI Flow'],
    resources: {
      videoUrl: 'https://www.youtube.com/watch?v=d4LvlpMhKgk&list=PL0b6OzIxLPbzGtrDFaF6uoC33cPNHDmeV',
      videoType: 'playlist',
      notesUrl: 'https://react.dev/learn',
    },
  },
];

export default courses;
