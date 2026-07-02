import { Box, Loader2, RefreshCw } from 'lucide-react';
import React, { useState, useEffect } from 'react';
import ProductForm from './components/ProductForm.jsx';
import ProductsFilter from './components/ProductsFilter.jsx';
import ProductTable from './components/ProductTable.jsx';

export default function App() {
  // 1. State Declarations
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);

  const [search, setSearch] = useState('');
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalProducts, setTotalProducts] = useState(0);

  const [loading, setLoading] = useState(true);
  const [toastMessage, setToastMessage] = useState('');

  // 2. Helper: Toast Notification Trigger
  const triggerToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(''), 3000);
  };

  // 3. Fetch Categories (Runs once on mount)
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/categories");
        const data = await response.json();
        if (data.success) {
          setCategories(data.categories);
        }
      } catch (error) {
        console.error('Failed to load categories:', error);
      }
    };
    fetchCategories();
  }, []);

  // 4. Fetch Products (Standalone Function)
  const fetchProducts = async () => {
    setLoading(true);
    try {
      const categoriesParam = selectedCategories.join(',');
      const url = `http://localhost:5000/api/products?page=${currentPage}&limit=5&search=${encodeURIComponent(
        search
      )}&categories=${categoriesParam}`;
      
      const res = await fetch(url);
      const data = await res.json();

      if (data.success) {
        setProducts(data.products);
        setTotalPages(data.pagination.totalPages);
        setTotalProducts(data.pagination.totalProducts);
      }
    } catch (error) {
      console.error('Failed to load products:', error);
    } finally {
      setLoading(false);
    }
  };

  // 5. Trigger fetch when parameters change (At App component level)
  useEffect(() => {
    fetchProducts();
  }, [search, selectedCategories, currentPage]);

  // 6. Reset page back to 1 when filters are changed
  useEffect(() => {
    setCurrentPage(1);
  }, [search, selectedCategories]);

  // 7. Operations Callbacks (At App component level)
  const handleProductAdded = () => {
    fetchProducts();
    triggerToast('Product added successfully!');
  };

  const handleProductDeleted = () => {
    fetchProducts();
    triggerToast('Product deleted successfully!');
  };

  // 8. Render App Dashboard
  return (
    <div className='relative min-h-screen pb-12'>
      {/* Toast Alert */}
      {toastMessage && (
        <div className="fixed top-6 right-6 z-50">
          <div className="bg-slate-900 border border-emerald-500/30 text-emerald-400 px-5 py-3 rounded-xl shadow-2xl flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-555 animate-ping"></span>
            <span className="text-sm font-semibold">{toastMessage}</span>
          </div>
        </div>
      )}

      {/* Background Effect */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#0f172a_1px,transparent_1px),linear-gradient(to_bottom,#0f172a_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] pointer-events-none"></div>

      {/* Header */}
      <header className="border-b border-slate-900 bg-slate-950/80 backdrop-blur-md sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-indigo-650/20 p-2.5 rounded-xl border border-indigo-500/20">
              <Box size={20} className="text-indigo-400" />
            </div>
            <div>
              <h1 className="text-base font-bold bg-clip-text text-transparent bg-gradient-to-r from-slate-100 to-slate-400">
                StockFlow
              </h1>
              <p className="text-[10px] text-slate-500 tracking-wider">Product Inventory Manager</p>
            </div>
          </div>
          <button
            onClick={fetchProducts}
            className="p-2 text-slate-400 hover:text-indigo-400 hover:bg-slate-900/50 rounded-lg transition-colors border border-slate-800"
          >
            <RefreshCw size={15} />
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 mt-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          <div className="lg:col-span-1">
            <ProductForm categories={categories} onProductAdded={handleProductAdded} />
          </div>

          <div className="lg:col-span-2 flex flex-col gap-6">
            <ProductsFilter
              search={search}
              setSearch={setSearch}
              selectedCategories={selectedCategories}
              setSelectedCategories={setSelectedCategories}
              categories={categories}
            />

            {loading ? (
              <div className="flex flex-col items-center justify-center py-24 text-indigo-400 gap-3">
                <Loader2 size={32} className="animate-spin text-indigo-500" />
                <span className="text-[10px] text-slate-500 font-semibold tracking-widest uppercase">
                  Loading stock data...
                </span>
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