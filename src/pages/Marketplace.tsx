import { useState, useEffect } from "react";
import { Plus, Search } from "lucide-react";
import {
  collection,
  onSnapshot,
  query,
  where,
  addDoc,
  serverTimestamp,
} from "firebase/firestore";
import { db } from "../lib/firebase";
import { useAuthStore } from "../store/authStore";
import PropertyCard from "../components/PropertyCard";
import AddPropertyModal from "../components/AddPropertyModal";
import DealAnalyzer from "../components/DealAnalyzer";
import AskAIModal from "../components/AskAIModal";
import RequestAdvisorModal from "../components/RequestAdvisorModal";
import type { Property, AdvisorRequest } from "../types";

export default function Marketplace() {
  const [properties, setProperties] = useState<Property[]>([]);
  const [advisorRequests, setAdvisorRequests] = useState<AdvisorRequest[]>([]);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(
    null
  );
  const [isAnalyzerOpen, setIsAnalyzerOpen] = useState(false);
  const [isAIModalOpen, setIsAIModalOpen] = useState(false);
  const [isAdvisorModalOpen, setIsAdvisorModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const { user } = useAuthStore();

  useEffect(() => {
    if (!user) return;

    // Simplified query without ordering to avoid index requirement
    const propertiesQuery = query(
      collection(db, "properties"),
      where("userId", "==", user.id)
    );

    const unsubscribeProperties = onSnapshot(propertiesQuery, (snapshot) => {
      const propertyList: Property[] = [];
      snapshot.forEach((doc) => {
        propertyList.push({
          id: doc.id,
          ...doc.data(),
          createdAt:
            doc.data().createdAt?.toDate?.().toISOString() ||
            new Date().toISOString(),
        } as Property);
      });
      // Sort in memory instead of using orderBy
      propertyList.sort((a, b) => b.createdAt.localeCompare(a.createdAt));
      setProperties(propertyList);
    });

    const requestsQuery = query(
      collection(db, "advisor_requests"),
      where("userId", "==", user.id)
    );

    const unsubscribeRequests = onSnapshot(requestsQuery, (snapshot) => {
      const requestList: AdvisorRequest[] = [];
      snapshot.forEach((doc) => {
        requestList.push({
          id: doc.id,
          ...doc.data(),
          createdAt:
            doc.data().createdAt?.toDate?.().toISOString() ||
            new Date().toISOString(),
        } as AdvisorRequest);
      });
      // Sort in memory
      requestList.sort((a, b) => b.createdAt.localeCompare(a.createdAt));
      setAdvisorRequests(requestList);
    });

    return () => {
      unsubscribeProperties();
      unsubscribeRequests();
    };
  }, [user]);

  const handleAddProperty = async (data: any) => {
    if (!user) return;

    try {
      const propertyData = {
        ...data,
        userId: user.id,
        createdAt: serverTimestamp(),
        iqScore: Math.floor(Math.random() * 5) + 5,
      };

      await addDoc(collection(db, "properties"), propertyData);
      setIsAddModalOpen(false);
    } catch (error) {
      console.error("Error adding property:", error);
    }
  };

  const filteredProperties = properties.filter(
    (property) =>
      property.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      property.address.toLowerCase().includes(searchTerm.toLowerCase()) ||
      property.dealType.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getAdvisorRequest = (propertyId: string) => {
    return advisorRequests.find((request) => request.propertyId === propertyId);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 space-y-4 sm:space-y-0">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">My Properties</h1>
            <p className="mt-1 text-sm text-gray-500">
              Manage and analyze your real estate investments
            </p>
          </div>
          <button
            onClick={() => setIsAddModalOpen(true)}
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            <Plus className="h-5 w-5 mr-2" />
            Add Property
          </button>
        </div>

        <div className="mb-6">
          <div className="relative">
            <input
              type="text"
              placeholder="Search properties..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-4 py-2 pl-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            />
            <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
          </div>
        </div>

        {filteredProperties.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">
              No properties found. Add your first property to get started!
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProperties.map((property) => (
              <PropertyCard
                key={property.id}
                property={property}
                advisorRequest={getAdvisorRequest(property.id)}
                onAnalyze={() => {
                  setSelectedProperty(property);
                  setIsAnalyzerOpen(true);
                }}
                onAskAI={() => {
                  setSelectedProperty(property);
                  setIsAIModalOpen(true);
                }}
                onRequestAdvisor={() => {
                  setSelectedProperty(property);
                  setIsAdvisorModalOpen(true);
                }}
              />
            ))}
          </div>
        )}

        {selectedProperty && (
          <>
            <DealAnalyzer
              property={selectedProperty}
              isOpen={isAnalyzerOpen}
              onClose={() => setIsAnalyzerOpen(false)}
            />
            <AskAIModal
              property={selectedProperty}
              isOpen={isAIModalOpen}
              onClose={() => setIsAIModalOpen(false)}
            />
            <RequestAdvisorModal
              property={selectedProperty}
              isOpen={isAdvisorModalOpen}
              onClose={() => setIsAdvisorModalOpen(false)}
            />
          </>
        )}

        <AddPropertyModal
          isOpen={isAddModalOpen}
          onClose={() => setIsAddModalOpen(false)}
          onSubmit={handleAddProperty}
        />
      </div>
    </div>
  );
}
