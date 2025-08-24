import React, { useState, useEffect } from 'react';
import Modal from './Modal';
import { apiService } from '../../lib/api';
import type { Category, Tag } from '../../types';

interface AddChannelModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

const AddChannelModal: React.FC<AddChannelModalProps> = ({ isOpen, onClose, onSuccess }) => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    category: '',
    tags: '',
    url: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  
  // Data for dropdowns and suggestions
  const [categories, setCategories] = useState<Category[]>([]);
  const [tags, setTags] = useState<Tag[]>([]);
  const [filteredTags, setFilteredTags] = useState<Tag[]>([]);
  const [showTagSuggestions, setShowTagSuggestions] = useState(false);
  const [showCategorySuggestions, setShowCategorySuggestions] = useState(false);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  
  // Keyboard navigation states
  const [categoryHighlightedIndex, setCategoryHighlightedIndex] = useState(-1);
  const [tagHighlightedIndex, setTagHighlightedIndex] = useState(-1);

  // Load categories and tags when modal opens
  useEffect(() => {
    if (isOpen) {
      loadCategories();
      loadTags();
    }
  }, [isOpen]);

  // Reset highlighted indices when dropdowns close
  useEffect(() => {
    if (!showCategorySuggestions) {
      setCategoryHighlightedIndex(-1);
    }
  }, [showCategorySuggestions]);

  useEffect(() => {
    if (!showTagSuggestions) {
      setTagHighlightedIndex(-1);
    }
  }, [showTagSuggestions]);

  // Auto-scroll to keep highlighted items visible
  useEffect(() => {
    if (categoryHighlightedIndex >= 0 && showCategorySuggestions) {
      const dropdown = document.querySelector('[data-category-dropdown]');
      const highlightedItem = dropdown?.querySelector(`[data-index="${categoryHighlightedIndex}"]`);
      if (highlightedItem) {
        highlightedItem.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
      }
    }
  }, [categoryHighlightedIndex, showCategorySuggestions]);

  useEffect(() => {
    if (tagHighlightedIndex >= 0 && showTagSuggestions) {
      const dropdown = document.querySelector('[data-tag-dropdown]');
      const highlightedItem = dropdown?.querySelector(`[data-index="${tagHighlightedIndex}"]`);
      if (highlightedItem) {
        highlightedItem.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
      }
    }
  }, [tagHighlightedIndex, showTagSuggestions]);

  const loadCategories = async () => {
    try {
      const categoriesData = await apiService.getCategories();
      setCategories(categoriesData);
    } catch (err) {
      console.error('Failed to load categories:', err);
    }
  };

  const loadTags = async () => {
    try {
      const tagsData = await apiService.getTags();
      setTags(tagsData);
    } catch (err) {
      console.error('Failed to load tags:', err);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      // Combine selected tags with manually typed tags
      const allTags = [...selectedTags];
      if (formData.tags.trim()) {
        allTags.push(...formData.tags.split(',').map(tag => tag.trim()).filter(Boolean));
      }

      await apiService.createChannel({
        name: formData.name.trim(),
        description: formData.description.trim() || undefined,
        category: formData.category,
        tags: allTags.length > 0 ? allTags.join(', ') : undefined,
        url: formData.url.trim()
      });
      
      setFormData({ name: '', description: '', category: '', tags: '', url: '' });
      setSelectedTags([]);
      onSuccess();
      onClose();
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to create channel');
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Handle tag input for suggestions
    if (name === 'tags') {
      if (value.trim()) {
        const filtered = tags.filter(tag => 
          tag.name.toLowerCase().includes(value.toLowerCase()) &&
          !selectedTags.includes(tag.name)
        );
        setFilteredTags(filtered);
        setShowTagSuggestions(filtered.length > 0);
      } else {
        setShowTagSuggestions(false);
      }
    }
    
    // Handle category input for suggestions
    if (name === 'category') {
      setShowCategorySuggestions(true);
      setCategoryHighlightedIndex(-1);
    }
  };

  const handleCategoryKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    const filteredCategories = categories.filter(category => 
      category.name.toLowerCase().includes(formData.category.toLowerCase())
    );
    
    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setShowCategorySuggestions(true);
        setCategoryHighlightedIndex(prev => 
          prev < filteredCategories.length - 1 ? prev + 1 : prev
        );
        break;
      case 'ArrowUp':
        e.preventDefault();
        setShowCategorySuggestions(true);
        setCategoryHighlightedIndex(prev => 
          prev > 0 ? prev - 1 : -1
        );
        break;
      case 'Enter':
        e.preventDefault();
        if (categoryHighlightedIndex >= 0 && filteredCategories[categoryHighlightedIndex]) {
          const selectedCategory = filteredCategories[categoryHighlightedIndex];
          setFormData(prev => ({ ...prev, category: selectedCategory.name }));
          setShowCategorySuggestions(false);
          setCategoryHighlightedIndex(-1);
        }
        break;
      case 'Escape':
        setShowCategorySuggestions(false);
        setCategoryHighlightedIndex(-1);
        break;
      case 'Tab':
        setShowCategorySuggestions(false);
        setCategoryHighlightedIndex(-1);
        break;
    }
  };

  const handleTagSelect = (tagName: string) => {
    if (!selectedTags.includes(tagName)) {
      setSelectedTags(prev => [...prev, tagName]);
      setFormData(prev => ({ ...prev, tags: '' }));
      setShowTagSuggestions(false);
    }
  };

  const removeSelectedTag = (tagName: string) => {
    setSelectedTags(prev => prev.filter(tag => tag !== tagName));
  };

  const handleTagKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    const availableOptions = filteredTags;
    
    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setShowTagSuggestions(true);
        setTagHighlightedIndex(prev => 
          prev < availableOptions.length - 1 ? prev + 1 : prev
        );
        break;
      case 'ArrowUp':
        e.preventDefault();
        setShowTagSuggestions(true);
        setTagHighlightedIndex(prev => 
          prev > 0 ? prev - 1 : prev
        );
        break;
      case 'Enter':
        e.preventDefault();
        if (tagHighlightedIndex >= 0 && availableOptions[tagHighlightedIndex]) {
          const selectedOption = availableOptions[tagHighlightedIndex];
          handleTagSelect(selectedOption.name);
          setTagHighlightedIndex(-1);
        }
        break;
      case 'Escape':
        setShowTagSuggestions(false);
        setTagHighlightedIndex(-1);
        break;
      case 'Tab':
        setShowTagSuggestions(false);
        setTagHighlightedIndex(-1);
        break;
    }
  };

  const isFormValid = formData.name.trim() && formData.category && formData.url.trim() && categories.length > 0;

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Add New Channel">
      <form onSubmit={handleSubmit} className="space-y-5">
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
            {error}
          </div>
        )}
        
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
            Channel Name *
          </label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
            placeholder="Enter channel name"
          />
        </div>

        <div>
          <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
            Description
          </label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            rows={3}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors resize-none"
            placeholder="Enter channel description (optional)"
          />
        </div>

        <div>
          <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-2">
            Category *
          </label>
          
          {/* Category Combobox */}
          <div className="relative">
            <div className="relative">
              <input
                type="text"
                id="category"
                name="category"
                value={formData.category}
                onChange={handleChange}
                onFocus={() => setShowCategorySuggestions(true)}
                onBlur={() => setTimeout(() => setShowCategorySuggestions(false), 150)}
                onKeyDown={handleCategoryKeyDown}
                placeholder="Type to search categories..."
                className="w-full px-4 py-3 pl-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                required
              />
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </div>
            
            {/* Category suggestions dropdown */}
            {showCategorySuggestions && (
              <div className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-60 overflow-auto" data-category-dropdown>
                {categories
                  .filter(category => 
                    category.name.toLowerCase().includes(formData.category.toLowerCase())
                  )
                  .map((category, index) => (
                    <button
                      key={category._id}
                      type="button"
                      onClick={() => {
                        setFormData(prev => ({ ...prev, category: category.name }));
                        setShowCategorySuggestions(false);
                        setCategoryHighlightedIndex(-1);
                      }}
                      data-index={index}
                      className={`w-full text-left px-4 py-2.5 hover:bg-gray-50 focus:bg-gray-50 focus:outline-none transition-colors ${
                        categoryHighlightedIndex === index ? 'bg-blue-50' : ''
                      }`}
                    >
                      {category.name}
                    </button>
                  ))}
                {categories.filter(category => 
                  category.name.toLowerCase().includes(formData.category.toLowerCase())
                ).length === 0 && (
                  <div className="px-4 py-2.5 text-sm text-gray-500">
                    No categories match your search
                  </div>
                )}
              </div>
            )}
          </div>
          
          {categories.length === 0 && (
            <p className="mt-2 text-sm text-amber-600">
              You need to create at least one category before adding channels.
            </p>
          )}
        </div>

        <div>
          <label htmlFor="tags" className="block text-sm font-medium text-gray-700 mb-2">
            Tags
          </label>
          
          {/* Modern Multi-tag Selection */}
          <div className="relative">
            {/* Selected tags display - Modern chip design */}
            {selectedTags.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-3 p-3 bg-gray-50 rounded-lg border border-gray-200">
                {selectedTags.map(tag => (
                  <span
                    key={tag}
                    className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-medium bg-blue-100 text-blue-800 border border-blue-200 shadow-sm hover:shadow-md transition-all duration-200"
                  >
                    <span className="flex items-center">
                      <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M17.707 9.293a1 1 0 010 1.414l-7 7a1 1 0 01-1.414 0l-7-7A.997.997 0 012 10a1 1 0 01.293-.707l7-7a1 1 0 011.414 0l7 7z" clipRule="evenodd" />
                      </svg>
                      {tag}
                    </span>
                    <button
                      type="button"
                      onClick={() => removeSelectedTag(tag)}
                      className="ml-1 inline-flex items-center justify-center w-5 h-5 rounded-full text-blue-400 hover:bg-blue-200 hover:text-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-300 transition-all duration-200"
                    >
                      <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                      </svg>
                    </button>
                  </span>
                ))}
              </div>
            )}

            {/* Tag input with modern combobox */}
            <div className="relative">
              <input
                type="text"
                id="tags"
                name="tags"
                value={formData.tags}
                onChange={handleChange}
                onFocus={() => setShowTagSuggestions(true)}
                onBlur={() => setTimeout(() => setShowTagSuggestions(false), 150)}
                onKeyDown={handleTagKeyDown}
                className="w-full px-4 py-3 pl-10 pr-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                placeholder="Type to search existing tags..."
              />
              
              {/* Search icon */}
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              
              {/* Tag icon */}
              <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                </svg>
              </div>
            </div>
            
            {/* Enhanced tag suggestions dropdown */}
            {showTagSuggestions && (
              <div className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-60 overflow-auto" data-tag-dropdown>
                {/* Existing tags section */}
                {filteredTags.length > 0 && (
                  <div className="border-b border-gray-100">
                    <div className="px-3 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wide">
                      Existing Tags
                    </div>
                    {filteredTags.map((tag, index) => (
                      <button
                        key={tag._id}
                        type="button"
                        onClick={() => handleTagSelect(tag.name)}
                        data-index={index}
                        className={`w-full text-left px-4 py-2.5 hover:bg-blue-50 focus:bg-blue-50 focus:outline-none transition-colors flex items-center ${
                          tagHighlightedIndex === index ? 'bg-blue-50' : ''
                        }`}
                      >
                        <svg className="w-4 h-4 mr-2 text-blue-500" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M17.707 9.293a1 1 0 010 1.414l-7 7a1 1 0 01-1.414 0l-7-7A.997.997 0 012 10a1 1 0 01.293-.707l7-7a1 1 0 011.414 0l7 7z" clipRule="evenodd" />
                        </svg>
                        {tag.name}
                      </button>
                    ))}
                  </div>
                )}
                
                {/* No results message */}
                {filteredTags.length === 0 && !formData.tags.trim() && (
                  <div className="px-4 py-3 text-sm text-gray-500 text-center">
                    Start typing to search tags
                  </div>
                )}
              </div>
            )}
          </div>
          
        </div>

        <div>
          <label htmlFor="url" className="block text-sm font-medium text-gray-700 mb-2">
            Channel URL *
          </label>
          <input
            type="url"
            id="url"
            name="url"
            value={formData.url}
            onChange={handleChange}
            required
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
            placeholder="https://www.youtube.com/channel/..."
          />
        </div>

        <div className="flex justify-end space-x-3 pt-2">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2.5 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
            disabled={isLoading}
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isLoading || !isFormValid}
            className="px-4 py-2.5 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? 'Creating...' : 
             categories.length === 0 ? 'Create Category First' : 
             'Create Channel'}
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default AddChannelModal;
