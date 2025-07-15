'use client';

import '../../components/Sidebar.css';
import './technical.css';
import SideBar from '@/components/SideBar';

const complaints = [ 
  {
    id: 'CMP-2023-001',
    name: 'John Smith',
    date: '2023-12-01',
    product: 'Product A',
    type: 'Support',
    status: 'Open',
    subStatus: 'In Progress',
  },
  {
    id: 'CMP-2023-002',
    name: 'Sarah Johnson',
    date: '2023-12-02',
    product: 'Product B',
    type: 'Inquiry',
    status: 'Pending',
    subStatus: 'Awaiting Response',
  },
  {
    id: 'CMP-2023-003',
    name: 'Michael Brown',
    date: '2023-12-03',
    product: 'Product C',
    type: 'Support',
    status: 'Closed',
    subStatus: 'Resolved',
  },
  {
    id: 'CMP-2023-004',
    name: 'Emily Davis',
    date: '2023-12-04',
    product: 'Product A',
    type: 'Complaint',
    status: 'Open',
    subStatus: 'Under Review',
  },
  {
    id: 'CMP-2023-005',
    name: 'David Wilson',
    date: '2023-12-05',
    product: 'Product B',
    type: 'Inquiry',
    status: 'Pending',
    subStatus: 'Scheduled',
  },
];

export default function ComplaintTable() {
  const getStatusClass = (status) => {
    switch (status) {
      case 'Open': return 'badge open';
      case 'Pending': return 'badge pending';
      case 'Closed': return 'badge closed';
      default: return 'badge';
    }
  };

  return (
    <div style={{ display: 'flex', minHeight: '100vh' }}>
      <SideBar />
      <div className="content-container">
        <div className="table-container">
          <h2 style={{ marginBottom: '20px', color: '#333' }}>Complaint Dashboard</h2>
          <table className="complaint-table">
            <thead>
              <tr>
                <th>Update</th>
                <th>Complaint No.</th>
                <th>Customer Name</th>
                <th>Date</th>
                <th>Product</th>
                <th>Call Type</th>
                <th>Status</th>
                <th>Sub Status</th>
              </tr>
            </thead>
            <tbody>
              {complaints.map((item, idx) => (
                <tr key={idx}>
                  <td><button className="update-btn">Update</button></td>
                  <td>{item.id}</td>
                  <td>{item.name}</td>
                  <td>{item.date}</td>
                  <td>{item.product}</td>
                  <td>{item.type}</td>
                  <td><span className={getStatusClass(item.status)}>{item.status}</span></td>
                  <td>{item.subStatus}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
