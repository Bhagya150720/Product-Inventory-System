import React, { useState, useEffect, useRef } from 'react';
import { ChevronDown, Search, X } from "lucide-react";

export default function ProductsFilter({
  search,
  setSearch,
  selectedCategories,
  setSelectedCategories,
  categories,
}) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);


  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleCategoryToggle = (categoryId) => {
    if (selectedCategories.includes(categoryId)) {
      setSelectedCategories(selectedCategories.filter((id) => id !== categoryId));
    } else {
      setSelectedCategories([...selectedCategories, categoryId]);
    }
  };

  const handleRemoveCategory = (categoryId) => {
    setSelectedCategories(selectedCategories.filter((id) => id !== categoryId));
  };

  return (
    // relative z-50 to place it on a higher layer than the table below
    <div className="relative z-50 flex flex-col md:flex-row gap-4 items-stretch md:items-center justify-between bg-slate-900 border border-slate-800 p-4 rounded-xl shadow-md">
      
      {/* 1. Name Search */}
      <div className="relative flex-1">
        <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-500 pointer-events-none">
          <Search size={18} />
        </span>
        <input
          type="text"
          placeholder="Search Product by name"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full bg-slate-955 bg-slate-950 border border-slate-800 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 text-slate-100 pl-10 pr-10 py-2.5 rounded-lg text-sm transition-all outline-none"
        />
        {search && (
          <button
            onClick={() => setSearch('')}
            className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-500 hover:text-slate-300"
          >
            <X size={16} />
          </button>
        )}
      </div>

      {/* 2. Custom Category Selector */}
      <div className="relative md:w-72" ref={dropdownRef}>
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className="w-full flex items-center justify-between bg-slate-955 bg-slate-950 border border-slate-800 hover:border-slate-700 text-slate-200 px-4 py-2.5 rounded-lg text-sm transition-all outline-none"
        >
          <span className="truncate">
            {selectedCategories.length === 0
              ? 'Filter by Categories'
              : `Selected (${selectedCategories.length})`}
          </span>
          <ChevronDown
            size={18}
            className={`text-slate-400 transition-transform ${isOpen ? 'rotate-180' : ''}`}
          />
        </button>

        {isOpen && (
          <div className="absolute right-0 left-0 mt-2 bg-slate-900 border border-slate-800 rounded-lg shadow-xl z-55 py-2 max-h-60 overflow-y-auto">
            {categories.length === 0 ? (
              <div className="text-slate-500 text-center py-2 text-xs">No categories found</div>
            ) : (
              categories.map((category) => {
                const isChecked = selectedCategories.includes(category._id);
                return (
                  <label
                    key={category._id}
                    className="flex items-center gap-3 px-4 py-2 hover:bg-slate-800 cursor-pointer transition-colors text-sm"
                  >
                    <input
                      type="checkbox"
                      checked={isChecked}
                      onChange={() => handleCategoryToggle(category._id)}
                      className="rounded border-slate-800 bg-slate-950 text-indigo-500 h-4 w-4 accent-indigo-500"
                    />
                    <span className={isChecked ? 'text-indigo-400 font-medium' : 'text-slate-300'}>
                      {category.name}
                    </span>
                  </label>
                );
              })
            )}
          </div>
        )}
      </div>

      {/* Category Selection Chips (Shown on Mobile when dropdown is closed) */}
      <div className="flex flex-wrap gap-1.5 md:hidden mt-2">
        {selectedCategories.map((id) => {
          const cat = categories.find((c) => c._id === id);
          return (
            cat && (
              <span
                key={id}
                className="inline-flex items-center gap-1 bg-indigo-550/10 text-indigo-450 border border-indigo-550/20 px-2 py-0.5 rounded-full text-xs"
              >
                {cat.name}
                <button onClick={() => handleRemoveCategory(id)} className="hover:text-indigo-250">
                  <X size={12} />
                </button>
              </span>
            )
          );
        })}
      </div>
      
    </div>
  );
}