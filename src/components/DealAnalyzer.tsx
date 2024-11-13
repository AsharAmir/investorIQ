import { useState } from 'react';
import { Calculator, X } from 'lucide-react';
import type { Property, DealAnalysis } from '../types';

interface DealAnalyzerProps {
  property: Property;
  isOpen: boolean;
  onClose: () => void;
}

export default function DealAnalyzer({ property, isOpen, onClose }: DealAnalyzerProps) {
  const [analysis, setAnalysis] = useState<DealAnalysis>({
    purchasePrice: property.price,
    rehabCost: 0,
    arv: 0,
    holdingCosts: 0,
    roi: 0,
  });

  if (!isOpen) return null;

  const calculateROI = () => {
    const totalInvestment = analysis.purchasePrice + analysis.rehabCost + analysis.holdingCosts;
    const profit = analysis.arv - totalInvestment;
    const roi = (profit / totalInvestment) * 100;
    setAnalysis({ ...analysis, roi });
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen px-4">
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75" onClick={onClose} />
        
        <div className="relative bg-white rounded-lg max-w-lg w-full p-6">
          <div className="flex justify-between items-center mb-6">
            <div className="flex items-center">
              <Calculator className="h-6 w-6 text-indigo-600 mr-2" />
              <h2 className="text-xl font-semibold text-gray-900">Deal Analyzer</h2>
            </div>
            <button onClick={onClose} className="text-gray-400 hover:text-gray-500">
              <X className="h-6 w-6" />
            </button>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Purchase Price</label>
              <input
                type="number"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                value={analysis.purchasePrice}
                onChange={e => setAnalysis({ ...analysis, purchasePrice: Number(e.target.value) })}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Estimated Rehab Cost</label>
              <input
                type="number"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                value={analysis.rehabCost}
                onChange={e => setAnalysis({ ...analysis, rehabCost: Number(e.target.value) })}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">After Repair Value (ARV)</label>
              <input
                type="number"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                value={analysis.arv}
                onChange={e => setAnalysis({ ...analysis, arv: Number(e.target.value) })}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Holding Costs</label>
              <input
                type="number"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                value={analysis.holdingCosts}
                onChange={e => setAnalysis({ ...analysis, holdingCosts: Number(e.target.value) })}
              />
            </div>

            <button
              onClick={calculateROI}
              className="w-full bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700"
            >
              Calculate ROI
            </button>

            {analysis.roi > 0 && (
              <div className="mt-4 p-4 bg-gray-50 rounded-md">
                <h3 className="text-lg font-medium text-gray-900">Analysis Results</h3>
                <div className="mt-2 space-y-2">
                  <p className="text-sm text-gray-600">
                    Total Investment: ${(analysis.purchasePrice + analysis.rehabCost + analysis.holdingCosts).toLocaleString()}
                  </p>
                  <p className="text-sm text-gray-600">
                    Potential Profit: ${(analysis.arv - (analysis.purchasePrice + analysis.rehabCost + analysis.holdingCosts)).toLocaleString()}
                  </p>
                  <p className="text-lg font-semibold text-indigo-600">
                    ROI: {analysis.roi.toFixed(2)}%
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}