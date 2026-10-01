import React, { useState, useMemo } from 'react';
import { Search, Filter, X, BookOpen, SearchX, RotateCcw } from 'lucide-react';
import courses from '../data/courses';
import CourseCard from '../components/CourseCard';

export default function CourseCatalog() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDifficulty, setSelectedDifficulty] = useState('All');
  const [selectedCategory, setSelectedCategory] = useState('All');

  // Extract unique categories and difficulties from dataset
  const categories = useMemo(() => {
    const unique = Array.from(new Set(courses.map((c) => c.category)));
    return ['All', ...unique];
  }, []);

  const difficulties = ['All', 'Beginner', 'Intermediate'];

  // Filtered courses based on search, difficulty, and category
  const filteredCourses = useMemo(() => {
    return courses.filter((course) => {
      const matchesSearch =
        searchTerm.trim() === '' ||
        course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        course.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (course.icon && course.icon.toLowerCase().includes(searchTerm.toLowerCase()));

      const matchesDifficulty =
        selectedDifficulty === 'All' || course.difficulty === selectedDifficulty;

      const matchesCategory =
        selectedCategory === 'All' || course.category === selectedCategory;

      return matchesSearch && matchesDifficulty && matchesCategory;
    });
  }, [searchTerm, selectedDifficulty, selectedCategory]);

  const hasActiveFilters =
    searchTerm.trim() !== '' ||
    selectedDifficulty !== 'All' ||
    selectedCategory !== 'All';

  const resetFilters = () => {
    setSearchTerm('');
    setSelectedDifficulty('All');
    setSelectedCategory('All');
  };

  return (
    <div className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14 w-full">
      {/* Page Header */}
      <div className="border-b border-navy-800 pb-8 mb-10">
        <span className="text-xs font-semibold uppercase tracking-widest text-accent-500 mb-2 block">
          Curriculum Catalog
        </span>
        <h1 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-3">
          Explore Curated Courses
        </h1>
        <p className="text-gray-300 text-sm sm:text-base max-w-2xl leading-relaxed">
          Rigorous, structured learning tracks designed to take you from foundational concepts to production-level architectural mastery.
        </p>
      </div>

      {/* Filter and Search Controls */}
      <div className="bg-navy-800/60 border border-navy-700/70 rounded-2xl p-4 sm:p-6 mb-10 shadow-lg shadow-navy-950/20 backdrop-blur-sm">
        <div className="flex flex-col lg:flex-row gap-4 lg:items-center justify-between">
          {/* Search Bar */}
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search courses by title, topic, or keyword..."
              className="w-full pl-10 pr-10 py-2.5 bg-navy-900/90 border border-navy-700 rounded-xl text-sm text-gray-100 placeholder-gray-400 focus:outline-none focus:border-accent-500 focus:ring-1 focus:ring-accent-500 transition-colors"
            />
            {searchTerm && (
              <button
                type="button"
                onClick={() => setSearchTerm('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
                title="Clear search"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Filter Controls */}
          <div className="flex flex-wrap sm:flex-nowrap items-center gap-3">
            {/* Category / Topic Filter */}
            <div className="flex items-center gap-2 w-full sm:w-auto">
              <span className="text-xs text-gray-400 whitespace-nowrap hidden sm:inline">Topic:</span>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full sm:w-auto bg-navy-900 border border-navy-700 rounded-xl px-3 py-2.5 text-xs sm:text-sm text-gray-200 focus:outline-none focus:border-accent-500 cursor-pointer"
              >
                {categories.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat === 'All' ? 'All Topics' : cat}
                  </option>
                ))}
              </select>
            </div>

            {/* Difficulty Filter */}
            <div className="flex items-center gap-2 w-full sm:w-auto">
              <span className="text-xs text-gray-400 whitespace-nowrap hidden sm:inline">Level:</span>
              <select
                value={selectedDifficulty}
                onChange={(e) => setSelectedDifficulty(e.target.value)}
                className="w-full sm:w-auto bg-navy-900 border border-navy-700 rounded-xl px-3 py-2.5 text-xs sm:text-sm text-gray-200 focus:outline-none focus:border-accent-500 cursor-pointer"
              >
                {difficulties.map((diff) => (
                  <option key={diff} value={diff}>
                    {diff === 'All' ? 'All Difficulties' : diff}
                  </option>
                ))}
              </select>
            </div>

            {/* Reset Filters button */}
            {hasActiveFilters && (
              <button
                type="button"
                onClick={resetFilters}
                className="inline-flex items-center gap-1.5 px-3 py-2.5 rounded-xl bg-navy-900 border border-navy-700/80 hover:border-accent-500/50 text-xs sm:text-sm text-accent-400 hover:text-accent-300 transition-colors"
                title="Reset all filters"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Reset</span>
              </button>
            )}
          </div>
        </div>

        {/* Status / Count bar */}
        <div className="flex items-center justify-between text-xs text-gray-400 mt-4 pt-3 border-t border-navy-700/50">
          <span>
            Showing <strong className="text-gray-200">{filteredCourses.length}</strong> of{' '}
            <strong className="text-gray-200">{courses.length}</strong> courses
          </span>
          {hasActiveFilters && (
            <span className="text-accent-400/90 text-xs">Filters applied</span>
          )}
        </div>
      </div>

      {/* Courses Cards Grid - 2 cards per row with expanded width & generous gap */}
      {filteredCourses.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-10">
          {filteredCourses.map((course) => (
            <CourseCard
              key={course.id}
              id={course.id}
              title={course.title}
              category={course.category}
              description={course.description}
              difficulty={course.difficulty}
              rating={course.rating}
              icon={course.icon}
              image={course.image}
              resources={course.resources}
              duration={course.duration}
              topics={course.topics}
            />
          ))}
        </div>
      ) : (
        /* Empty State */
        <div className="rounded-2xl border border-navy-800 bg-navy-900/60 p-12 text-center shadow-lg">
          <SearchX className="w-12 h-12 text-accent-500/70 mx-auto mb-4" />
          <h3 className="font-display text-xl font-bold text-white mb-2">
            No matching courses found
          </h3>
          <p className="text-gray-400 text-sm max-w-md mx-auto mb-6">
            We couldn't find any courses matching your search term "{searchTerm}" or selected filters.
          </p>
          <button
            type="button"
            onClick={resetFilters}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-accent-500 hover:bg-accent-600 text-navy-950 font-semibold text-sm transition-all shadow-md"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Reset All Filters</span>
          </button>
        </div>
      )}
    </div>
  );
}
