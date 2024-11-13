import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { supabase } from '../lib/supabase';
import type { AdvisorRequest } from '../types';

export default function AdminDashboard() {
  const [requests, setRequests] = useState<AdvisorRequest[]>([]);
  const { user } = useAuthStore();
  const navigate = useNavigate();

  useEffect(() => {
    if (!user || user.role !== 'admin') {
      navigate('/');
      return;
    }

    const fetchRequests = async () => {
      const { data, error } = await supabase
        .from('advisor_requests')
        .select(`
          *,
          property:properties(*),
          user:users(*)
        `)
        .eq('status', 'pending')
        .order('created_at', { ascending: false });

      if (!error && data) {
        setRequests(data);
      }
    };

    fetchRequests();
  }, [user, navigate]);

  const handleRequest = async (requestId: string, status: 'approved' | 'rejected') => {
    const { error } = await supabase
      .from('advisor_requests')
      .update({ status })
      .eq('id', requestId);

    if (!error) {
      setRequests(requests.filter(r => r.id !== requestId));
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Admin Dashboard</h1>
      
      <div className="bg-white shadow overflow-hidden sm:rounded-md">
        <ul className="divide-y divide-gray-200">
          {requests.map((request) => (
            <li key={request.id} className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-medium text-gray-900">
                    {request.property.title}
                  </h3>
                  <p className="text-sm text-gray-500">
                    Requested by: {request.user.name}
                  </p>
                  <p className="text-sm text-gray-500">
                    Message: {request.message}
                  </p>
                </div>
                <div className="flex space-x-2">
                  <button
                    onClick={() => handleRequest(request.id, 'approved')}
                    className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
                  >
                    Approve
                  </button>
                  <button
                    onClick={() => handleRequest(request.id, 'rejected')}
                    className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
                  >
                    Reject
                  </button>
                </div>
              </div>
            </li>
          ))}
          {requests.length === 0 && (
            <li className="p-4 text-center text-gray-500">
              No pending advisor requests
            </li>
          )}
        </ul>
      </div>
    </div>
  );
}