
'use client';

import { useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import SideBar from '@/components/SideBar';
import axios from 'axios';

export default function ComplaintTable() {
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const searchParams = useSearchParams();
  const status = searchParams.get('status') || 'Not found'; // default fallback
  const router = useRouter();

  const getStatusClass = (status) => {
    switch (status?.toLowerCase()) {
      case 'open': return 'bg-green-100 text-green-700';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'closed': return 'bg-gray-200 text-gray-800';
      default: return 'bg-gray-100 text-gray-600';
    }
  };

  useEffect(() => {
    const fetchComplaints = async () => {
      setLoading(true);
      try {
        const response = await axios.get(
          `https://ncapi.jainaindia.com/api/CallRegister/status/${encodeURIComponent(status)}`
        );
        setComplaints(response.data || []);
      } catch (error) {
        console.error('Error fetching complaints:', error);
        setComplaints([]);
      } finally {
        setLoading(false);
      }
    };

    fetchComplaints();
  }, [status]);

  return (
    <div className="flex min-h-screen bg-gray-100">
      <SideBar />
      <div className="w-full p-8 ml-[60px] transition-all ease-in-out">
        <div className="bg-white shadow-md rounded-lg p-8">
          <h2 className="text-2xl font-semibold text-gray-800 mb-6">
            Complaints - {status}
          </h2>

          {loading ? (
            <p className="text-gray-500">Loading complaints...</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full text-sm">
                <thead>
                  <tr className="bg-gray-100 text-gray-700 uppercase text-xs tracking-wider">
                    <th className="text-left py-3 px-4 font-semibold">Update</th>
                    <th className="text-left py-3 px-4 font-semibold">Complaint No.</th>
                    <th className="text-left py-3 px-4 font-semibold">Customer Name</th>
                    <th className="text-left py-3 px-4 font-semibold">Product</th>
                    <th className="text-left py-3 px-4 font-semibold">Call Type</th>
                    <th className="text-left py-3 px-4 font-semibold">Status</th>
                    <th className="text-left py-3 px-4 font-semibold">Sub Status</th>
                  </tr>
                </thead>
                <tbody>
                  {complaints.length === 0 ? (
                    <tr>
                      <td colSpan="7" className="text-center py-4 text-gray-500">
                        No complaints found.
                      </td>
                    </tr>
                  ) : (
                    complaints.map((item, idx) => (
                      <tr key={idx} className="hover:bg-gray-50 border-b border-gray-200">
                        <td className="py-3 px-4">
                          <button
                            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium"
                            onClick={() =>
                              router.push(`/assign-to-asc/${item.callNumber}`)
                            }
                          >
                            Update
                          </button>
                        </td>
                        <td className="py-3 px-4">{item.callNumber}</td>
                        <td className="py-3 px-4">{`${item.title || ''} ${item.firstName} ${item.lastName}`}</td>
                        <td className="py-3 px-4">{item.product}</td>
                        <td className="py-3 px-4">{item.callType}</td>
                        <td className="py-3 px-4">
                          <span
                            className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusClass(item.complaint_Status)}`}
                          >
                            {item.complaint_Status}
                          </span>
                        </td>
                        <td className="py-3 px-4">{item.complaint_SubStatus}</td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
