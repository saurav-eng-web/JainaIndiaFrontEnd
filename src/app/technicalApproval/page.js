
'use client';

import { useEffect, useState } from 'react';
import '../../components/Sidebar.css';
import './technical.css';
import SideBar from '@/components/SideBar';
import axios from 'axios';

export default function ComplaintTable() {
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);

  const getStatusClass = (status) => {
    switch (status?.toLowerCase()) {
      case 'open': return 'badge open';
      case 'pending': return 'badge pending';
      case 'closed': return 'badge closed';
      default: return 'badge';
    }
  };

  useEffect(() => {
    const fetchComplaints = async () => {
      try {
        const response = await axios.get(
          'https://ncapi.jainaindia.com/api/CallRegister/status/Techical Approval'
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
  }, []);

  return (
    <div style={{ display: 'flex', minHeight: '100vh' }}>
      <SideBar />
      <div className="content-container">
        <div className="table-container">
          <h2 style={{ marginBottom: '20px', color: '#333' }}>
            Complaint Dashboard
          </h2>

          {loading ? (
            <p>Loading complaints...</p>
          ) : (
            <table className="complaint-table">
              <thead>
                <tr>
                  <th>Update</th>
                  <th>Complaint No.</th>
                  <th>Customer Name</th>
                  <th>Product</th>
                  <th>Call Type</th>
                  <th>Status</th>
                  <th>Sub Status</th>
                </tr>
              </thead>
              <tbody>
                {complaints.length === 0 ? (
                  <tr>
                    <td colSpan="7">No complaints found.</td>
                  </tr>
                ) : (
                  complaints.map((item, idx) => (
                    <tr key={idx}>
                      <td>
                        <button className="update-btn">Update</button>
                      </td>
                      <td>{item.callNumber}</td>
                      <td>{`${item.title || ''} ${item.firstName} ${item.lastName}`}</td>
                      <td>{item.product}</td>
                      <td>{item.callType}</td>
                      <td>
                        <span className={getStatusClass(item.complaint_Status)}>
                          {item.complaint_Status}
                        </span>
                      </td>
                      <td>{item.complaint_SubStatus}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}
