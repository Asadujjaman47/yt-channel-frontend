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

  // Load categories and tags when modal opens
  useEffect(() => {
    if (isOpen) {
      loadCategories();
      loadTags();
    }
  }, [isOpen]);

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
            {showCategorySuggestions && categories.length > 0 && (
              <div className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-60 overflow-auto">
                {categories
                  .filter(category => 
                    category.name.toLowerCase().includes(formData.category.toLowerCase())
                  )
                  .map(category => (
                    <button
                      key={category._id}
                      type="button"
                      onClick={() => {
                        setFormData(prev => ({ ...prev, category: category.name }));
                        setShowCategorySuggestions(false);
                      }}
                      className="w-full text-left px-4 py-2.5 hover:bg-gray-50 focus:bg-gray-50 focus:outline-none transition-colors"
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
          
          {/* Selected tags display */}
          {selectedTags.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-3">
              {selectedTags.map(tag => (
                <span
                  key={tag}
                  className="inline-flex items-center px-3 py-1.5 rounded-full text-sm font-medium bg-blue-100 text-blue-800 border border-blue-200"
                >
                  {tag}
                  <button
                    type="button"
                    onClick={() => removeSelectedTag(tag)}
                    className="ml-2 inline-flex items-center justify-center w-4 h-4 rounded-full text-blue-400 hover:bg-blue-200 hover:text-blue-600 focus:outline-none transition-colors"
                  >
                    <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                  </button>
                </span>
              ))}
            </div>
          )}

          {/* Tag input with suggestions */}
          <div className="relative">
            <input
              type="text"
              id="tags"
              name="tags"
              value={formData.tags}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
              placeholder={tags.length === 0 ? "No tags available - type to create new ones" : "Type to search tags or add new ones (comma-separated)"}
            />
            
            {/* Tag suggestions dropdown */}
            {showTagSuggestions && (
              <div className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-60 overflow-auto">
                {filteredTags.map(tag => (
                  <button
                    key={tag._id}
                    type="button"
                    onClick={() => handleTagSelect(tag.name)}
                    className="w-full text-left px-4 py-2.5 hover:bg-gray-50 focus:bg-gray-50 focus:outline-none transition-colors"
                  >
                    {tag.name}
                  </button>
                ))}
              </div>
            )}
          </div>
          {tags.length === 0 && (
            <p className="mt-2 text-sm text-blue-600">
              No tags exist yet. You can type to create new tags or create them using the "Add Tag" button.
            </p>
          )}
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
