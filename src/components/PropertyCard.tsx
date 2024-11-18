import {
  Building2,
  Star,
  Brain,
  UserCog,
  CheckCircle,
  XCircle,
  Clock,
} from "lucide-react";
import type { Property, AdvisorRequest } from "../types";

interface PropertyCardProps {
  property: Property;
  onAnalyze: (id: string) => void;
  onAskAI: (id: string) => void;
  onRequestAdvisor: (id: string) => void;
  advisorRequest?: AdvisorRequest;
}

export default function PropertyCard({
  property,
  onAnalyze,
  onAskAI,
  onRequestAdvisor,
  advisorRequest,
}: PropertyCardProps) {
  const getStatusBadge = (status: string) => {
    switch (status) {
      case "approved":
        return (
          <div className="flex items-center text-green-700 bg-green-50 px-3 py-1 rounded-full text-sm">
            <CheckCircle className="w-4 h-4 mr-1" />
            Approved
          </div>
        );
      case "rejected":
        return (
          <div className="flex items-center text-red-700 bg-red-50 px-3 py-1 rounded-full text-sm">
            <XCircle className="w-4 h-4 mr-1" />
            Rejected
          </div>
        );
      case "pending":
        return (
          <div className="flex items-center text-yellow-700 bg-yellow-50 px-3 py-1 rounded-full text-sm">
            <Clock className="w-4 h-4 mr-1" />
            Pending
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden transition-all hover:shadow-xl hover:scale-[1.02]">
      <div className="relative h-48">
        <img
          src={
            property.images.length > 0
              ? property.images[0]
              : "https://via.placeholder.com/300x200?text=No+Image+Available"
          }
          alt={property.title || "Property Image"}
          className="w-full h-full object-cover"
        />
        <div className="absolute top-4 right-4 bg-white px-3 py-1 rounded-full shadow-lg">
          <div className="flex items-center">
            <Star className="h-4 w-4 text-yellow-400" />
            <span className="ml-1 text-sm font-medium">
              {property.iqScore ?? "N/A"}/10
            </span>
          </div>
        </div>
      </div>

      <div className="p-6">
        <h3 className="text-xl font-bold text-gray-900 mb-2">
          {property.title || "Untitled Property"}
        </h3>
        <p className="text-gray-600 mb-3">{property.address || "No Address"}</p>
        <div className="flex items-center mb-4">
          <Building2 className="h-4 w-4 text-indigo-600" />
          <span className="ml-2 text-sm text-gray-600">
            {property.dealType || "N/A"}
          </span>
        </div>
        <p className="text-2xl font-bold text-indigo-600 mb-6">
          ${property.price ? property.price.toLocaleString() : "N/A"}
        </p>

        {advisorRequest && (
          <div className="mb-6">
            {getStatusBadge(advisorRequest.status)}
            {advisorRequest.response && (
              <div className="mt-4 bg-gray-50 rounded-lg p-4">
                <p className="text-sm font-medium text-gray-700">
                  Advisor Response:
                </p>
                <p className="text-sm text-gray-600 mt-1">
                  {advisorRequest.response}
                </p>
              </div>
            )}
          </div>
        )}

        <div className="flex space-x-3">
          <button
            onClick={() => onAnalyze(property.id)}
            className="flex-1 bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-indigo-700 transition-colors"
          >
            Analyze Deal
          </button>
          <button
            onClick={() => onAskAI(property.id)}
            className="flex items-center justify-center p-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            title="Ask AI"
          >
            <Brain className="h-5 w-5 text-gray-600" />
          </button>
          <button
            onClick={() => onRequestAdvisor(property.id)}
            className="flex items-center justify-center p-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            title="Request Advisor"
          >
            <UserCog className="h-5 w-5 text-gray-600" />
          </button>
        </div>
      </div>
    </div>
  );
}
