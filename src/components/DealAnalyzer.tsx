import { useState } from "react";
import { Calculator, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import type { Property, DealAnalysis } from "../types";

interface DealAnalyzerProps {
  property: Property;
  isOpen: boolean;
  onClose: () => void;
}

export default function DealAnalyzer({
  property,
  isOpen,
  onClose,
}: DealAnalyzerProps) {
  const [analysis, setAnalysis] = useState<DealAnalysis>({
    purchasePrice: property.price,
    rehabCost: 0,
    arv: 0,
    holdingCosts: 0,
    roi: 0,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showResults, setShowResults] = useState(false);

  if (!isOpen) return null;

  const calculateROI = async () => {
    setLoading(true);
    setError("");

    try {
      const response = await fetch(
        "http://localhost:5000/api/analyze-property",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            purchasePrice: analysis.purchasePrice,
            rehabCost: analysis.rehabCost,
            arv: analysis.arv,
            holdingCosts: analysis.holdingCosts,
          }),
        }
      );

      if (!response.ok) throw new Error("Failed to calculate ROI");

      const data = await response.json();
      setAnalysis((prev) => ({ ...prev, roi: data.roi }));
      setShowResults(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to calculate ROI");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 overflow-y-auto bg-black bg-opacity-50 backdrop-blur-sm"
        >
          <div className="flex items-center justify-center min-h-screen px-4">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="relative bg-white rounded-2xl max-w-lg w-full p-8 shadow-2xl"
            >
              <div className="flex justify-between items-center mb-8">
                <div className="flex items-center">
                  <Calculator className="h-8 w-8 text-indigo-600 mr-3" />
                  <h2 className="text-2xl font-bold text-gray-900">
                    Deal Analyzer
                  </h2>
                </div>
                <button
                  onClick={onClose}
                  className="text-gray-400 hover:text-gray-500 transition-colors"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>

              <div className="space-y-6">
                <div className="bg-gradient-to-r from-indigo-50 to-purple-50 p-6 rounded-xl mb-6">
                  <h3 className="font-semibold text-indigo-900 mb-2">
                    Property Details
                  </h3>
                  <p className="text-indigo-700">{property.address}</p>
                  <p className="text-indigo-700">
                    Listed Price: ${property.price.toLocaleString()}
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Purchase Price
                    </label>
                    <input
                      type="number"
                      className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                      value={analysis.purchasePrice}
                      onChange={(e) =>
                        setAnalysis({
                          ...analysis,
                          purchasePrice: Number(e.target.value),
                        })
                      }
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Estimated Rehab Cost
                    </label>
                    <input
                      type="number"
                      className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                      value={analysis.rehabCost}
                      onChange={(e) =>
                        setAnalysis({
                          ...analysis,
                          rehabCost: Number(e.target.value),
                        })
                      }
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      After Repair Value (ARV)
                    </label>
                    <input
                      type="number"
                      className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                      value={analysis.arv}
                      onChange={(e) =>
                        setAnalysis({
                          ...analysis,
                          arv: Number(e.target.value),
                        })
                      }
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Holding Costs
                    </label>
                    <input
                      type="number"
                      className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                      value={analysis.holdingCosts}
                      onChange={(e) =>
                        setAnalysis({
                          ...analysis,
                          holdingCosts: Number(e.target.value),
                        })
                      }
                    />
                  </div>
                </div>

                {error && (
                  <div className="text-red-600 text-sm bg-red-50 p-3 rounded-xl">
                    {error}
                  </div>
                )}

                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={calculateROI}
                  disabled={loading}
                  className="w-full bg-indigo-600 text-white px-6 py-3 rounded-xl hover:bg-indigo-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? (
                    <span className="flex items-center justify-center">
                      <svg
                        className="animate-spin h-5 w-5 mr-3"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                          fill="none"
                        />
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        />
                      </svg>
                      Calculating...
                    </span>
                  ) : (
                    "Calculate ROI"
                  )}
                </motion.button>

                <AnimatePresence>
                  {showResults && analysis.roi > 0 && (
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      className="mt-6 p-6 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-xl"
                    >
                      <h3 className="text-xl font-bold text-gray-900 mb-4">
                        Analysis Results
                      </h3>
                      <div className="space-y-3">
                        <div className="flex justify-between items-center">
                          <span className="text-gray-600">
                            Total Investment:
                          </span>
                          <span className="font-semibold">
                            $
                            {(
                              analysis.purchasePrice +
                              analysis.rehabCost +
                              analysis.holdingCosts
                            ).toLocaleString()}
                          </span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-gray-600">
                            Potential Profit:
                          </span>
                          <span className="font-semibold">
                            $
                            {(
                              analysis.arv -
                              (analysis.purchasePrice +
                                analysis.rehabCost +
                                analysis.holdingCosts)
                            ).toLocaleString()}
                          </span>
                        </div>
                        <div className="flex justify-between items-center text-lg">
                          <span className="text-gray-600">
                            Return on Investment:
                          </span>
                          <span className="font-bold text-indigo-600">
                            {analysis.roi.toFixed(2)}%
                          </span>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </motion.div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
