import { useState } from 'react';
import { Brain, X } from 'lucide-react';
import type { Property } from '../types';

interface AskAIModalProps {
  property: Property;
  isOpen: boolean;
  onClose: () => void;
}

export default function AskAIModal({ property, isOpen, onClose }: AskAIModalProps) {
  const [question, setQuestion] = useState('');
  const [response, setResponse] = useState('');

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // In a real app, this would make an API call to your AI service
    setResponse('AI analysis coming soon...');
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen px-4">
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75" onClick={onClose} />
        
        <div className="relative bg-white rounded-lg max-w-lg w-full p-6">
          <div className="flex justify-between items-center mb-6">
            <div className="flex items-center">
              <Brain className="h-6 w-6 text-indigo-600 mr-2" />
              <h2 className="text-xl font-semibold text-gray-900">Ask AI About This Property</h2>
            </div>
            <button onClick={onClose} className="text-gray-400 hover:text-gray-500">
              <X className="h-6 w-6" />
            </button>
          </div>

          <div className="mb-6">
            <h3 className="text-sm font-medium text-gray-700 mb-2">Property Details</h3>
            <div className="bg-gray-50 p-3 rounded-md">
              <p className="text-sm text-gray-600">{property.address}</p>
              <p className="text-sm text-gray-600">${property.price.toLocaleString()}</p>
              <p className="text-sm text-gray-600">Deal Type: {property.dealType}</p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Your Question</label>
              <textarea
                rows={3}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                placeholder="Ask about investment potential, neighborhood insights, or rehab estimates..."
                value={question}
                onChange={e => setQuestion(e.target.value)}
              />
            </div>

            <button
              type="submit"
              className="w-full bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700"
            >
              Get AI Analysis
            </button>
          </form>

          {response && (
            <div className="mt-6">
              <h3 className="text-sm font-medium text-gray-700 mb-2">AI Response</h3>
              <div className="bg-gray-50 p-4 rounded-md">
                <p className="text-sm text-gray-600">{response}</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}