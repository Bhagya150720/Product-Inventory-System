import React from 'react';
import { Trash2, Calendar, Box, Inbox } from 'lucide-react';
import { API_URL } from '../config.js';

export default function ProductTable({
  products,
  pagination,
  setPage,
  onProductDeleted,
}) {
  const { currentPage, totalPages, totalProducts } = pagination;

  const handleDelete = async (productId, name) => {
    if (window.confirm(`Are you sure you want to delete "${name}"?`)) {
      try {
        const response = await fetch(`${API_URL}/api/products/${productId}`, {
          method: 'DELETE',
        });
        if (response.ok) {
          onProductDeleted();
        } else {
          const data = await response.json();
          onProductDeleted(data.message || 'Failed to delete product.');
        }
      } catch (err) {
        onProductDeleted('Network error. Failed to delete product.');
      }
    }
  };

  const pageNumbers = [];
  for (let i = 1; i <= totalPages; i++) {
    pageNumbers.push(i);
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  return (
    <div className="flex flex-col bg-slate-900 border border-slate-850 rounded-xl overflow-hidden shadow-md">
      
      <div className="overflow-x-auto">
        {products.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-slate-500 gap-2">
            <Inbox size={40} className="text-slate-700" />
            <p className="font-semibold text-slate-400">No products in inventory</p>
          </div>
        ) : (
          <table className="w-full text-left text-sm border-collapse">
            <thead>
              <tr className="bg-slate-950 border-b border-slate-855 text-slate-450 uppercase tracking-wider text-xs font-semibold">
                <th className="px-6 py-4">Product Name</th>
                <th className="px-6 py-4">Categories</th>
                <th className="px-6 py-4">Stock</th>
                <th className="px-6 py-4">Added On</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {products.map((product) => (
                <tr key={product._id} className="hover:bg-slate-955/20 transition-colors">
                  
                  <td className="px-6 py-4 max-w-xs">
                    <p className="font-semibold text-slate-200 truncate">{product.name}</p>
                    {product.description && (
                      <p className="text-xs text-slate-400 mt-1 line-clamp-1 truncate">{product.description}</p>
                    )}
                  </td>

                  <td className="px-6 py-4">
                    <div className="flex flex-wrap gap-1.5">
                      {product.categories.map((category) => (
                        <span
                          key={category._id}
                          className="bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 px-2.5 py-0.5 rounded-full text-xs font-medium"
                        >
                          {category.name}
                        </span>
                      ))}
                    </div>
                  </td>

                  <td className="px-6 py-4 text-slate-200">
                    <div className="flex items-center gap-1.5">
                      <Box size={14} className="text-slate-500" />
                      <span
                        className={`font-medium ${
                          product.quantity === 0
                            ? 'text-red-400'
                            : product.quantity < 5
                            ? 'text-yellow-450'
                            : 'text-slate-200'
                        }`}
                      >
                        {product.quantity}
                      </span>
                    </div>
                  </td>

                  <td className="px-6 py-4 text-slate-400">
                    <div className="flex items-center gap-1.5">
                      <Calendar size={14} className="text-slate-500" />
                      <span>{formatDate(product.createdAt)}</span>
                    </div>
                  </td>

                  <td className="px-6 py-4 text-right">
                    <button
                      onClick={() => handleDelete(product._id, product.name)}
                      className="p-2 bg-red-500/10 hover:bg-red-500 text-red-450 hover:text-white rounded-lg transition-colors"
                      title="Delete Product"
                    >
                      <Trash2 size={15} />
                    </button>
                  </td>

                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {totalPages > 1 && (
        <div className="flex items-center justify-between border-t border-slate-800 px-6 py-4 bg-slate-950/20">
          <p className="text-xs text-slate-400">
            Showing{' '}
            <span className="font-semibold text-indigo-400">
              {totalProducts === 0 ? 0 : (currentPage - 1) * 5 + 1}
            </span>{' '}
            to{' '}
            <span className="font-semibold text-indigo-400">
              {Math.min(currentPage * 5, totalProducts)}
            </span>{' '}
            of <span className="font-semibold text-slate-200">{totalProducts}</span> products
          </p>

          <div className="flex items-center gap-1">
            <button
              onClick={() => setPage(Math.max(1, currentPage - 1))}
              disabled={currentPage === 1}
              className="px-3 py-1.5 bg-slate-900 border border-slate-800 text-slate-450 hover:text-slate-200 rounded-lg text-xs font-semibold disabled:opacity-30 transition-opacity"
            >
              Prev
            </button>

            {pageNumbers.map((number) => (
              <button
                key={number}
                onClick={() => setPage(number)}
                className={`w-8 h-8 rounded-lg text-xs font-semibold border ${
                  currentPage === number
                    ? 'bg-indigo-650 border-indigo-500 text-white shadow-md'
                    : 'bg-slate-900 border-slate-800 text-slate-450 hover:text-slate-205'
                }`}
              >
                {number}
              </button>
            ))}

            <button
              onClick={() => setPage(Math.min(totalPages, currentPage + 1))}
              disabled={currentPage === totalPages}
              className="px-3 py-1.5 bg-slate-900 border border-slate-800 text-slate-450 hover:text-slate-200 rounded-lg text-xs font-semibold disabled:opacity-30 transition-opacity"
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
}