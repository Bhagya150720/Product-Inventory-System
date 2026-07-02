import React, { useState } from 'react';
import { Plus, AlertCircle } from 'lucide-react';

export default function ProductForm({ categories, onProductAdded }) {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [quantity, setQuantity] = useState('');
  const [selectedCats, setSelectedCats] = useState([]);
  
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleCategoryToggle = (id) => {
    if (selectedCats.includes(id)) {
      setSelectedCats(selectedCats.filter((catId) => catId !== id));
    } else {
      setSelectedCats([...selectedCats, id]);
    }
  };

  const validateForm = () => {
    const tempErrors = {};
    if (!name.trim()) {
      tempErrors.name = 'Product name is required';
    }
    
    if (quantity === '') {
      tempErrors.quantity = 'Quantity is required';
    } else {
      const num = Number(quantity);
      if (isNaN(num) || !Number.isInteger(num) || num < 0) {
        tempErrors.quantity = 'Quantity must be a positive whole number';
      }
    }

    if (selectedCats.length === 0) {
      tempErrors.categories = 'Select at least one category';
    }

    setErrors(tempErrors);
    return Object.keys(tempErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsSubmitting(true);
    setErrors({});

    try {
      const response = await fetch('http://localhost:5000/api/products', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: name.trim(),
          description: description.trim(),
          quantity: parseInt(quantity, 10),
          categories: selectedCats,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        if (data.errors) {
          setErrors(data.errors);
        } else {
          setErrors({ form: data.message || 'An error occurred.' });
        }
      } else {
        setName('');
        setDescription('');
        setQuantity('');
        setSelectedCats([]);
        onProductAdded();
      }
    } catch (err) {
      setErrors({ form: 'Network error. Please make sure the backend is running.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-slate-900 border border-slate-800 p-6 rounded-xl flex flex-col gap-4 shadow-md"
    >
      <h2 className="text-md font-bold flex items-center gap-2 text-indigo-400">
        <Plus size={18} />
        Add New Product
      </h2>

      {errors.form && (
        <div className="flex items-center gap-2 bg-red-500/10 border border-red-500/20 text-red-400 p-3 rounded-lg text-sm">
          <AlertCircle size={16} className="shrink-0" />
          <span>{errors.form}</span>
        </div>
      )}

      <div>
        <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
          Product Name
        </label>
        <input
          type="text"
          placeholder="e.g. Wireless Mouse"
          value={name}
          onChange={(e) => {
            setName(e.target.value);
            if (errors.name) setErrors({ ...errors, name: '' });
          }}
          className={`w-full bg-slate-950 border ${
            errors.name ? 'border-red-500 focus:ring-red-500/30' : 'border-slate-800 focus:border-indigo-500'
          } rounded-lg px-4 py-2 text-sm text-slate-100 transition-all outline-none focus:ring-1`}
        />
        {errors.name && <p className="text-red-400 text-xs mt-1">{errors.name}</p>}
      </div>

      <div>
        <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
          Description (Optional)
        </label>
        <textarea
          placeholder="Product details..."
          rows="2"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="w-full bg-slate-950 border border-slate-800 focus:border-indigo-500 rounded-lg px-4 py-2 text-sm text-slate-100 transition-all outline-none focus:ring-1 focus:ring-indigo-500 resize-none"
        ></textarea>
      </div>

      <div>
        <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
          Stock Quantity
        </label>
        <input
          type="number"
          placeholder="0"
          min="0"
          value={quantity}
          onChange={(e) => {
            setQuantity(e.target.value);
            if (errors.quantity) setErrors({ ...errors, quantity: '' });
          }}
          className={`w-full bg-slate-950 border ${
            errors.quantity ? 'border-red-500 focus:ring-red-500/30' : 'border-slate-800 focus:border-indigo-500'
          } rounded-lg px-4 py-2 text-sm text-slate-100 transition-all outline-none focus:ring-1`}
        />
        {errors.quantity && <p className="text-red-400 text-xs mt-1">{errors.quantity}</p>}
      </div>

      <div>
        <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
          Categories (Select Multiple)
        </label>
        <div className="flex flex-wrap gap-2 max-h-36 overflow-y-auto bg-slate-950 border border-slate-800 rounded-lg p-3">
          {categories.map((category) => {
            const isSelected = selectedCats.includes(category._id);
            return (
              <button
                type="button"
                key={category._id}
                onClick={() => {
                  handleCategoryToggle(category._id);
                  if (errors.categories) setErrors({ ...errors, categories: '' });
                }}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-all ${
                  isSelected
                    ? 'bg-indigo-600/20 text-indigo-300 border-indigo-500/50'
                    : 'bg-slate-900 text-slate-400 border-slate-850 hover:border-slate-700'
                }`}
              >
                {category.name}
              </button>
            );
          })}
        </div>
        {errors.categories && <p className="text-red-400 text-xs mt-1">{errors.categories}</p>}
      </div>

      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full bg-indigo-650 hover:bg-indigo-600 disabled:opacity-50 text-white font-medium py-2.5 rounded-lg transition-colors shadow-md mt-2"
      >
        {isSubmitting ? 'Creating Product...' : 'Create Product'}
      </button>
    </form>
  );
}