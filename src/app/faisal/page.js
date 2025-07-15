'use client';

import { useState } from 'react';
import SideBar from '@/components/SideBar';
import './history.css';

const tabs = ['General Logs', 'Error Logs', 'User Activity', 'System Changes'];

const logData = [
  {
    id: '#12345',
    remarks: 'Network connectivity issue in Server Room A',
    status: 'Open',
    date: '2024-01-20 14:30',
    enteredBy: 'John Smith',
  },
  {
    id: '#12346',
    remarks: 'Database backup failed - Manual intervention required',
    status: 'Critical',
    date: '2024-01-20 13:15',
    enteredBy: 'Sarah Johnson',
  },
  {
    id: '#12347',
    remarks: 'User access request approved for Marketing team',
    status: 'Closed',
    date: '2024-01-20 11:45',
    enteredBy: 'Mike Wilson',
  },
  {
    id: '#12348',
    remarks: 'System update scheduled for maintenance window',
    status: 'Pending',
    date: '2024-01-20 10:20',
    enteredBy: 'Emily Brown',
  },
  {
    id: '#12349',
    remarks: 'New user account creation request',
    status: 'Open',
    date: '2024-01-20 09:30',
    enteredBy: 'David Clark',
  },
];

const StatusBadge = ({ status }) => (
  <span className={`badge ${status.toLowerCase()}`}>{status}</span>
);

export default function Page() {
  const [activeTab, setActiveTab] = useState('General Logs');

  return (
    <div className="page-wrapper">
      <SideBar />
      <div className="content-area">
        <table className="complaint-table">
          <thead>
            <tr>
              <th>Complain ID</th>
              <th>Remarks</th>
              <th>Status</th>
              <th>Entered Date</th>
              <th>Entered By</th>
            </tr>
          </thead>
          <tbody>
            {logData.map((row, index) => (
              <tr key={index}>
                <td>{row.id}</td>
                <td>{row.remarks}</td>
                <td><StatusBadge status={row.status} /></td>
                <td>{row.date}</td>
                <td>{row.enteredBy}</td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className="tab-bar">
          {tabs.map((tab) => (
            <button
              key={tab}
              className={`tab-button ${tab === activeTab ? 'active' : ''}`}
              onClick={() => setActiveTab(tab)}
            >
              {tab}
            </button>
          ))}
        </div>

        <div className="tab-content">
          {activeTab === 'General Logs' && (
            <div>
              <h3>Complaint Details</h3>
              <div className="row-content">
                <div><strong>Complain ID:</strong> #12345</div>
                <div><strong>Status:</strong> Open</div>
                <div><strong>Remarks:</strong> Network connectivity issue in Server Room A</div>
              </div>
            </div>
          )}

          {activeTab === 'Error Logs' && (
            <div>
              <h3>Product Details</h3>
              <div className="row-content">
                <div><strong>Product:</strong> Database Server</div>
                <div><strong>Issue:</strong> Backup failed</div>
                <div><strong>Action:</strong> Manual intervention</div>
              </div>
            </div>
          )}

          {activeTab === 'User Activity' && (
            <div>
              <h3>Customer Details</h3>
              <div className="row-content">
                <div><strong>Name:</strong> Sarah Johnson</div>
                <div><strong>Email:</strong> sarah@example.com</div>
                <div><strong>Phone:</strong> +91-9876543210</div>
              </div>
            </div>
          )}

          {activeTab === 'System Changes' && (
            <div>
              <h3>System Change Log</h3>
              <div className="row-content">
                <div><strong>Date:</strong> 2024-01-20 10:20</div>
                <div><strong>Change:</strong> System update scheduled</div>
                <div><strong>Performed By:</strong> Emily Brown</div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
