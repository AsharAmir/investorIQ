import { useState, useEffect } from "react";
import { Plus } from "lucide-react";
import {
  collection,
  onSnapshot,
  query,
  orderBy,
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
import type { Property } from "../types";

export default function Marketplace() {
  const [properties, setProperties] = useState<Property[]>([]);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(
    null
  );
  const [isAnalyzerOpen, setIsAnalyzerOpen] = useState(false);
  const [isAIModalOpen, setIsAIModalOpen] = useState(false);
  const [isAdvisorModalOpen, setIsAdvisorModalOpen] = useState(false);
  const { user } = useAuthStore();

  useEffect(() => {
    if (!user) return;

    // Using a simple query first to avoid index requirements
    const q = query(
      collection(db, "properties"),
      where("userId", "==", user.id)
    );

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
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
        // Sort the properties in memory instead of using orderBy
        propertyList.sort((a, b) => b.createdAt.localeCompare(a.createdAt));
        setProperties(propertyList);
      },
      (error) => {
        console.error("Error fetching properties:", error);
      }
    );

    return () => unsubscribe();
  }, [user]);

  const handleAddProperty = async (data: any) => {
    if (!user) return;

    try {
      const propertyData = {
        ...data,
        userId: user.id,
        createdAt: serverTimestamp(),
        iqScore: Math.floor(Math.random() * 5) + 5, // Placeholder IQ score calculation
      };

      const docRef = await addDoc(collection(db, "properties"), propertyData);
      console.log("Property added with ID:", docRef.id);
      setIsAddModalOpen(false);
    } catch (error) {
      console.error("Error adding property:", error);
      // You might want to show an error message to the user here
    }
  };

  const handleAnalyze = (id: string) => {
    const property = properties.find((p) => p.id === id);
    if (property) {
      setSelectedProperty(property);
      setIsAnalyzerOpen(true);
    }
  };

  const handleAskAI = (id: string) => {
    const property = properties.find((p) => p.id === id);
    if (property) {
      setSelectedProperty(property);
      setIsAIModalOpen(true);
    }
  };

  const handleRequestAdvisor = (id: string) => {
    const property = properties.find((p) => p.id === id);
    if (property) {
      setSelectedProperty(property);
      setIsAdvisorModalOpen(true);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">My Properties</h1>
        <button
          onClick={() => setIsAddModalOpen(true)}
          className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700"
        >
          <Plus className="h-5 w-5 mr-2" />
          Add Property
        </button>
      </div>

      {properties.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500">
            No properties found. Add your first property to get started!
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {properties.map((property) => (
            <PropertyCard
              key={property.id}
              property={property}
              onAnalyze={handleAnalyze}
              onAskAI={handleAskAI}
              onRequestAdvisor={handleRequestAdvisor}
            />
          ))}
        </div>
      )}

      <AddPropertyModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSubmit={handleAddProperty}
      />

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
    </div>
  );
}
