import { Box, Loader2, RefreshCw, AlertCircle } from 'lucide-react';
import React, { useState, useEffect } from 'react';
import ProductForm from './components/ProductForm.jsx';
import ProductsFilter from './components/ProductsFilter.jsx';
import ProductTable from './components/ProductTable.jsx';
import { API_URL } from './config.js';

export default function App() {
  // 1. Core State Declarations
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);

  // Search states (original and debounced)
  const [search, setSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalProducts, setTotalProducts] = useState(0);

  // Status flags
  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState(null);
  const [toast, setToast] = useState(null); // toast structure: { message, type }

  // 2. Helper: Toast Notification Trigger
  const triggerToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  // 3. Debounce search input keystrokes by 400ms
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search);
    }, 400);

    return () => clearTimeout(timer);
  }, [search]);

  // 4. Fetch Categories list (Runs once on mount)
  const fetchCategories = async () => {
    try {
      const response = await fetch(`${API_URL}/api/categories`);
      const data = await response.json();
      if (data.success) {
        setCategories(data.categories);
        setFetchError(null); // Clear errors if it was present
      } else {
        setFetchError(data.message || 'Failed to load categories.');
      }
    } catch (error) {
      console.error('Failed to load categories:', error);
      setFetchError('Failed to connect to the backend server. Please verify the server is running.');
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  // 5. Fetch Products (Standalone Function)
  const fetchProducts = async () => {
    setLoading(true);
    try {
      const categoriesParam = selectedCategories.join(',');
      const url = `${API_URL}/api/products?page=${currentPage}&limit=5&search=${encodeURIComponent(
        debouncedSearch
      )}&categories=${categoriesParam}`;
      
      const res = await fetch(url);
      const data = await res.json();

      if (data.success) {
        setProducts(data.products);
        setTotalPages(data.pagination.totalPages);
        setTotalProducts(data.pagination.totalProducts);
        setFetchError(null); // Clear any errors
      } else {
        setFetchError(data.message || 'Failed to query products.');
      }
    } catch (error) {
      console.error('Failed to load products:', error);
      setFetchError('Network error. Failed to retrieve products from the database.');
    } finally {
      setLoading(false);
    }
  };

  // 6. Trigger fetch when parameters change (At App component level, depending on debounced search)
  useEffect(() => {
    fetchProducts();
  }, [debouncedSearch, selectedCategories, currentPage]);

  // 7. Reset page back to 1 when filters are changed
  useEffect(() => {
    setCurrentPage(1);
  }, [debouncedSearch, selectedCategories]);

  // 8. Event Callbacks
  const handleProductAdded = () => {
    fetchProducts();
    triggerToast('Product created successfully!', 'success');
  };

  const handleProductDeleted = (errorMsg) => {
    fetchProducts();
    if (errorMsg) {
      triggerToast(errorMsg, 'error');
    } else {
      triggerToast('Product deleted successfully!', 'success');
    }
  };

  // 9. Render App Dashboard
  return (
    <div className='relative min-h-screen bg-slate-950 text-slate-100 pb-12'>
      
      {/* Dynamic Toast Notifications (Colored by Success or Error status) */}
      {toast && (
        <div className="fixed top-6 right-6 z-55">
          <div className={`border px-5 py-3 rounded-lg shadow-lg flex items-center gap-2 ${
            toast.type === 'error'
              ? 'bg-slate-900 border-red-500/30 text-red-400'
              : 'bg-slate-900 border-emerald-500/30 text-emerald-400'
          }`}>
            <span className={`w-2 h-2 rounded-full ${
              toast.type === 'error' ? 'bg-red-500 animate-pulse' : 'bg-emerald-500 animate-ping'
            }`}></span>
            <span className="text-sm font-semibold">{toast.message}</span>
          </div>
        </div>
      )}

      {/* Header */}
      <header className="border-b border-slate-800 bg-slate-900">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Box size={22} className="text-indigo-500" />
            <div>
              <h1 className="text-lg font-bold text-slate-100">StockFlow</h1>
              <p className="text-[10px] text-slate-400 uppercase tracking-wider">Inventory System</p>
            </div>
          </div>
          <button
            onClick={() => {
              fetchCategories();
              fetchProducts();
            }}
            className="p-2 text-slate-400 hover:text-slate-100 hover:bg-slate-800 rounded-lg transition-colors border border-slate-705 border-slate-700"
            title="Refresh List"
          >
            <RefreshCw size={16} />
          </button>
        </div>
      </header>

      {/* Main Grid Layout */}
      <main className="max-w-7xl mx-auto px-6 mt-8">
        
        {/* Render Global Network Fetch Errors */}
        {fetchError && (
          <div className="mb-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-red-550/10 border border-red-500/20 text-red-450 p-4 rounded-xl text-sm">
            <div className="flex items-center gap-2">
              <AlertCircle size={18} className="shrink-0" />
              <span>{fetchError}</span>
            </div>
            <button
              onClick={() => {
                setFetchError(null);
                fetchCategories();
                fetchProducts();
              }}
              className="px-3 py-1 bg-red-500/20 hover:bg-red-500 text-red-100 rounded-lg text-xs font-semibold transition-colors shrink-0"
            >
              Retry Connection
            </button>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Left Column: Product Form */}
          <div className="lg:col-span-1">
            <ProductForm categories={categories} onProductAdded={handleProductAdded} />
          </div>

          {/* Right Column: Filters and Table */}
          <div className="lg:col-span-2 flex flex-col gap-6">
            <ProductsFilter
              search={search}
              setSearch={setSearch}
              selectedCategories={selectedCategories}
              setSelectedCategories={setSelectedCategories}
              categories={categories}
            />

            {loading ? (
              <div className="flex flex-col items-center justify-center py-24 text-slate-500 gap-3">
                <Loader2 size={32} className="animate-spin text-indigo-500" />
                <span className="text-xs font-medium uppercase tracking-wider">Loading Stock...</span>
              </div>
            ) : (
              <ProductTable
                products={products}
                pagination={{ currentPage, totalPages, totalProducts }}
                setPage={setCurrentPage}
                onProductDeleted={handleProductDeleted}
              />
            )}
          </div>

        </div>
      </main>
    </div>
  );
} 