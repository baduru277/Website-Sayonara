'use client';

import { useState } from 'react';
import Header from '../../components/Header';
import Footer from '../../components/Footer';

export default function AddItemPage() {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '',
    condition: '',
    tradeFor: '',
    location: '',
    images: [] as File[]
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const categories = [
    'Electronics',
    'Fashion',
    'Sports',
    'Music',
    'Books',
    'Home & Garden',
    'Collectibles',
    'Tools',
    'Other'
  ];

  const conditions = [
    'Like New',
    'Excellent',
    'Very Good',
    'Good',
    'Fair'
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Basic validation
    const newErrors: Record<string, string> = {};
    
    if (!formData.title) newErrors.title = 'Title is required';
    if (!formData.description) newErrors.description = 'Description is required';
    if (!formData.category) newErrors.category = 'Category is required';
    if (!formData.condition) newErrors.condition = 'Condition is required';
    if (!formData.tradeFor) newErrors.tradeFor = 'Trade preference is required';
    if (!formData.location) newErrors.location = 'Location is required';

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    // Handle form submission
    console.log('Adding item:', formData);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files);
      setFormData(prev => ({
        ...prev,
        images: [...prev.images, ...files]
      }));
    }
  };

  const removeImage = (index: number) => {
    setFormData(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index)
    }));
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 bg-gradient-to-br from-purple-100 via-white to-purple-50 py-12 px-2 flex items-center justify-center">
        <div className="w-full max-w-2xl mx-auto">
          <div className="backdrop-blur-lg bg-white/80 border-2 border-purple-200 rounded-3xl shadow-2xl p-10 md:p-12 transition-all duration-300">
            <div className="mb-8 text-center">
              <h1 className="text-4xl font-extrabold text-purple-700 mb-2 flex items-center justify-center gap-2">
                <svg className="w-8 h-8 text-purple-400" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" /></svg>
                Add New Item
              </h1>
              <p className="text-purple-500 font-medium">List an item you&apos;d like to trade on Sayonara</p>
            </div>
            <form onSubmit={handleSubmit} className="space-y-8">
              {/* Basic Information */}
              <div>
                <h2 className="text-2xl font-bold text-purple-700 mb-4 flex items-center gap-2">
                  <svg className="w-6 h-6 text-purple-400" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M9 17v-6a2 2 0 012-2h2a2 2 0 012 2v6" /></svg>
                  Basic Information
                </h2>
                <div className="space-y-6">
                  {/* Title */}
                  <div className="relative">
                    <input
                      type="text"
                      id="title"
                      name="title"
                      value={formData.title}
                      onChange={handleChange}
                      className={`peer w-full px-4 py-3 bg-white/80 border-2 rounded-xl outline-none transition-all duration-200 focus:border-purple-500 focus:bg-white/90 shadow-sm ${errors.title ? 'border-red-400' : 'border-gray-200'} ${formData.title && !errors.title ? 'border-green-400' : ''}`}
                      placeholder=" "
                      autoComplete="off"
                    />
                    <label htmlFor="title" className="absolute left-4 top-3 text-gray-500 pointer-events-none transition-all duration-200 peer-focus:-top-5 peer-focus:text-xs peer-focus:text-purple-700 peer-placeholder-shown:top-3 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-500 -top-5 text-xs bg-white/80 px-1">Item Title *</label>
                    {errors.title && <span className="absolute right-3 top-3 text-red-500 text-lg">*</span>}
                    {formData.title && !errors.title && <span className="absolute right-3 top-3 text-green-500 text-lg">✔</span>}
                  </div>
                  {/* Description */}
                  <div className="relative">
                    <textarea
                      id="description"
                      name="description"
                      rows={3}
                      value={formData.description}
                      onChange={handleChange}
                      className={`peer w-full px-4 py-3 bg-white/80 border-2 rounded-xl outline-none transition-all duration-200 focus:border-purple-500 focus:bg-white/90 shadow-sm resize-none ${errors.description ? 'border-red-400' : 'border-gray-200'} ${formData.description && !errors.description ? 'border-green-400' : ''}`}
                      placeholder=" "
                      autoComplete="off"
                    />
                    <label htmlFor="description" className="absolute left-4 top-3 text-gray-500 pointer-events-none transition-all duration-200 peer-focus:-top-5 peer-focus:text-xs peer-focus:text-purple-700 peer-placeholder-shown:top-3 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-500 -top-5 text-xs bg-white/80 px-1">Description *</label>
                    {errors.description && <span className="absolute right-3 top-3 text-red-500 text-lg">*</span>}
                    {formData.description && !errors.description && <span className="absolute right-3 top-3 text-green-500 text-lg">✔</span>}
                  </div>
                  {/* Category & Condition */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="relative">
                      <select
                        id="category"
                        name="category"
                        value={formData.category}
                        onChange={handleChange}
                        className={`peer w-full px-4 py-3 bg-white/80 border-2 rounded-xl outline-none transition-all duration-200 focus:border-purple-500 focus:bg-white/90 shadow-sm ${errors.category ? 'border-red-400' : 'border-gray-200'} ${formData.category && !errors.category ? 'border-green-400' : ''}`}
                      >
                        <option value="" disabled>Select category</option>
                        {categories.map(category => (
                          <option key={category} value={category}>{category}</option>
                        ))}
                      </select>
                      <label htmlFor="category" className="absolute left-4 top-3 text-gray-500 pointer-events-none transition-all duration-200 peer-focus:-top-5 peer-focus:text-xs peer-focus:text-purple-700 peer-placeholder-shown:top-3 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-500 -top-5 text-xs bg-white/80 px-1">Category *</label>
                      {errors.category && <span className="absolute right-3 top-3 text-red-500 text-lg">*</span>}
                      {formData.category && !errors.category && <span className="absolute right-3 top-3 text-green-500 text-lg">✔</span>}
                    </div>
                    <div className="relative">
                      <select
                        id="condition"
                        name="condition"
                        value={formData.condition}
                        onChange={handleChange}
                        className={`peer w-full px-4 py-3 bg-white/80 border-2 rounded-xl outline-none transition-all duration-200 focus:border-purple-500 focus:bg-white/90 shadow-sm ${errors.condition ? 'border-red-400' : 'border-gray-200'} ${formData.condition && !errors.condition ? 'border-green-400' : ''}`}
                      >
                        <option value="" disabled>Select condition</option>
                        {conditions.map(condition => (
                          <option key={condition} value={condition}>{condition}</option>
                        ))}
                      </select>
                      <label htmlFor="condition" className="absolute left-4 top-3 text-gray-500 pointer-events-none transition-all duration-200 peer-focus:-top-5 peer-focus:text-xs peer-focus:text-purple-700 peer-placeholder-shown:top-3 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-500 -top-5 text-xs bg-white/80 px-1">Condition *</label>
                      {errors.condition && <span className="absolute right-3 top-3 text-red-500 text-lg">*</span>}
                      {formData.condition && !errors.condition && <span className="absolute right-3 top-3 text-green-500 text-lg">✔</span>}
                    </div>
                  </div>
                </div>
              </div>
              {/* Trade Preferences */}
              <div>
                <h2 className="text-2xl font-bold text-purple-700 mb-4 flex items-center gap-2">
                  <svg className="w-6 h-6 text-purple-400" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 10h16M4 14h16M4 18h16" /></svg>
                  Trade Preferences
                </h2>
                <div className="relative">
                  <input
                    type="text"
                    id="tradeFor"
                    name="tradeFor"
                    value={formData.tradeFor}
                    onChange={handleChange}
                    className={`peer w-full px-4 py-3 bg-white/80 border-2 rounded-xl outline-none transition-all duration-200 focus:border-purple-500 focus:bg-white/90 shadow-sm ${errors.tradeFor ? 'border-red-400' : 'border-gray-200'} ${formData.tradeFor && !errors.tradeFor ? 'border-green-400' : ''}`}
                    placeholder=" "
                    autoComplete="off"
                  />
                  <label htmlFor="tradeFor" className="absolute left-4 top-3 text-gray-500 pointer-events-none transition-all duration-200 peer-focus:-top-5 peer-focus:text-xs peer-focus:text-purple-700 peer-placeholder-shown:top-3 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-500 -top-5 text-xs bg-white/80 px-1">What would you like to trade for? *</label>
                  {errors.tradeFor && <span className="absolute right-3 top-3 text-red-500 text-lg">*</span>}
                  {formData.tradeFor && !errors.tradeFor && <span className="absolute right-3 top-3 text-green-500 text-lg">✔</span>}
                </div>
              </div>
              {/* Location */}
              <div>
                <h2 className="text-2xl font-bold text-purple-700 mb-4 flex items-center gap-2">
                  <svg className="w-6 h-6 text-purple-400" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a2 2 0 01-2.828 0l-4.243-4.243a8 8 0 1111.314 0z" /><circle cx="12" cy="11" r="3" /></svg>
                  Location
                </h2>
                <div className="relative">
                  <input
                    type="text"
                    id="location"
                    name="location"
                    value={formData.location}
                    onChange={handleChange}
                    className={`peer w-full px-4 py-3 bg-white/80 border-2 rounded-xl outline-none transition-all duration-200 focus:border-purple-500 focus:bg-white/90 shadow-sm ${errors.location ? 'border-red-400' : 'border-gray-200'} ${formData.location && !errors.location ? 'border-green-400' : ''}`}
                    placeholder=" "
                    autoComplete="off"
                  />
                  <label htmlFor="location" className="absolute left-4 top-3 text-gray-500 pointer-events-none transition-all duration-200 peer-focus:-top-5 peer-focus:text-xs peer-focus:text-purple-700 peer-placeholder-shown:top-3 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-500 -top-5 text-xs bg-white/80 px-1">Location *</label>
                  {errors.location && <span className="absolute right-3 top-3 text-red-500 text-lg">*</span>}
                  {formData.location && !errors.location && <span className="absolute right-3 top-3 text-green-500 text-lg">✔</span>}
                </div>
              </div>
              {/* Image Upload */}
              <div>
                <h2 className="text-2xl font-bold text-purple-700 mb-4 flex items-center gap-2">
                  <svg className="w-6 h-6 text-purple-400" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V7" /><path strokeLinecap="round" strokeLinejoin="round" d="M16 3v4H8V3" /></svg>
                  Images
                </h2>
                <div className="mb-4">
                  <label htmlFor="images" className="block text-sm font-medium text-gray-700 mb-2">Upload Images</label>
                  <div className="relative flex flex-col items-center justify-center border-2 border-dashed border-purple-400 rounded-2xl bg-purple-50/40 py-8 px-4 transition-all duration-200 hover:bg-purple-100/60 cursor-pointer">
                    <input
                      id="images"
                      name="images"
                      type="file"
                      accept="image/*"
                      multiple
                      onChange={handleImageUpload}
                      className="absolute inset-0 opacity-0 cursor-pointer"
                    />
                    <svg className="w-10 h-10 text-purple-400 mb-2" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" /></svg>
                    <span className="text-purple-700 font-semibold">Drag & drop or click to upload</span>
                    <span className="text-xs text-purple-400">(Up to 5 images, JPG/PNG/GIF)</span>
                  </div>
                  {/* Image Previews */}
                  {formData.images.length > 0 && (
                    <div className="flex flex-wrap gap-4 mt-4">
                      {formData.images.map((file, idx) => (
                        <div key={idx} className="relative group">
                          <img
                            src={URL.createObjectURL(file)}
                            alt={`Preview ${idx + 1}`}
                            className="w-24 h-24 object-cover rounded-xl border-2 border-purple-200 shadow-md"
                          />
                          <button
                            type="button"
                            onClick={() => removeImage(idx)}
                            className="absolute -top-2 -right-2 bg-white border border-purple-400 text-purple-700 rounded-full w-7 h-7 flex items-center justify-center shadow hover:bg-purple-100 transition-all"
                            aria-label="Remove image"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
              {/* Submit Button */}
              <div className="pt-4">
                <button
                  type="submit"
                  className="w-full py-4 rounded-full font-extrabold text-lg bg-gradient-to-r from-purple-600 to-purple-400 text-white shadow-xl hover:scale-105 hover:from-purple-700 hover:to-purple-500 transition-all duration-200 flex items-center justify-center gap-2"
                >
                  Add Item
                  <svg className="w-6 h-6 ml-1" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
                </button>
              </div>
            </form>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
} 