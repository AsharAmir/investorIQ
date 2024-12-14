import { useState, useEffect } from "react";
import { X } from "lucide-react";

interface EditPropertyModalProps {
  isOpen: boolean;
  onClose: () => void;
  property: any;
  setProperty: (property: any) => void;
  onConfirm: () => void;
}

export default function EditPropertyModal({
  isOpen,
  onClose,
  property,
  setProperty,
  onConfirm,
}: EditPropertyModalProps) {
  const [formData, setFormData] = useState(property);

  useEffect(() => {
    setFormData(property);
  }, [property]);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev: typeof formData) => ({ ...prev, [name]: value }));
    setProperty((prev: typeof property) => ({ ...prev, [name]: value }));
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black bg-opacity-50 backdrop-blur-sm">
      <div className="flex items-center justify-center min-h-screen px-4">
        <div className="relative bg-white rounded-2xl max-w-2xl w-full p-8 shadow-2xl">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-900">Edit Property</h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-500 transition-colors"
            >
              <X className="h-6 w-6" />
            </button>
          </div>

          <form className="space-y-6">
            {/* Common Fields */}
            {[
              { label: "Title", name: "title", type: "text" },
              { label: "Price", name: "price", type: "number" },
              { label: "Address", name: "address", type: "text" },
              { label: "Repair Cost", name: "repairCost", type: "number" },
              {
                label: "Profit for Selling",
                name: "profitForSelling",
                type: "number",
              },
              { label: "ROI", name: "roi", type: "number" },
              { label: "Rent", name: "rent", type: "number" },
              { label: "Net Cash Flow", name: "netCashFlow", type: "number" },
              {
                label: "Cash on Cash Return",
                name: "cashOnCashReturn",
                type: "number",
              },
              { label: "ARV", name: "arv", type: "number" },
              { label: "Property ID", name: "propertyId", type: "text" },
            ].map(({ label, name, type }) => (
              <div key={name}>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {label}
                </label>
                <input
                  type={type}
                  name={name}
                  value={formData[name] || ""}
                  onChange={handleChange}
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                />
              </div>
            ))}

            {/* Dropdown for Deal Type */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Deal Type
              </label>
              <select
                name="dealType"
                value={formData.dealType || ""}
                onChange={handleChange}
                className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
              >
                <option>Fix & Flip</option>
                <option>BRRRR</option>
              </select>
            </div>

            {/* Description Field */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Description
              </label>
              <textarea
                name="description"
                rows={4}
                value={formData.description || ""}
                onChange={handleChange}
                className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
              />
            </div>

            {/* Action Buttons */}
            <div className="flex justify-end space-x-4">
              <button
                type="button"
                onClick={onClose}
                className="px-6 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={onConfirm}
                className="px-6 py-2 text-sm font-medium text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 transition-colors"
              >
                Confirm
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
