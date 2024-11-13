import { Building2, Star, Brain, UserCog } from 'lucide-react';
import type { Property } from '../types';

interface PropertyCardProps {
  property: Property;
  onAnalyze: (id: string) => void;
  onAskAI: (id: string) => void;
  onRequestAdvisor: (id: string) => void;
}

export default function PropertyCard({ property, onAnalyze, onAskAI, onRequestAdvisor }: PropertyCardProps) {
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden transition-transform hover:scale-[1.02]">
      <div className="relative h-48">
        <img
          src={property.images[0] || 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6'}
          alt={property.title}
          className="w-full h-full object-cover"
        />
        <div className="absolute top-2 right-2 bg-white px-2 py-1 rounded-full shadow-md">
          <div className="flex items-center">
            <Star className="h-4 w-4 text-yellow-400" />
            <span className="ml-1 text-sm font-medium">{property.iqScore}/10</span>
          </div>
        </div>
      </div>
      
      <div className="p-4">
        <h3 className="text-lg font-semibold text-gray-900 mb-1">{property.title}</h3>
        <p className="text-sm text-gray-600 mb-2">{property.address}</p>
        <div className="flex items-center mb-3">
          <Building2 className="h-4 w-4 text-gray-400" />
          <span className="ml-1 text-sm text-gray-600">{property.dealType}</span>
        </div>
        <p className="text-xl font-bold text-gray-900 mb-4">
          ${property.price.toLocaleString()}
        </p>
        
        <div className="flex space-x-2">
          <button
            onClick={() => onAnalyze(property.id)}
            className="flex-1 bg-indigo-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-indigo-700"
          >
            Analyze Deal
          </button>
          <button
            onClick={() => onAskAI(property.id)}
            className="flex items-center justify-center px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50"
          >
            <Brain className="h-4 w-4" />
          </button>
          <button
            onClick={() => onRequestAdvisor(property.id)}
            className="flex items-center justify-center px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50"
          >
            <UserCog className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
}