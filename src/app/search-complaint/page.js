

// 'use client';

// import './search.css';
// import SideBar from '@/components/SideBar';
// import { useEffect, useState } from 'react';
// import axios from 'axios';
// import { useRouter } from 'next/navigation';
// import axiosInstance from '@/api/axiosInstance';

// export default function SearchComplaintPage() {
//   const router = useRouter();

// useEffect (() => {
//     const userData = localStorage.getItem('userData');
//     if (!userData) {
//       router.replace('/');
//     }
//   }, [router]);
//   const [query, setQuery] = useState('');
//   const [searchResults, setSearchResults] = useState([]);
//   const [searchAttempted, setSearchAttempted] = useState(false);

//   const handleViewHistory = (ticketNo) => {
//     sessionStorage.setItem('currentTicket', ticketNo);
//     router.push('/history'); // ✅ No ticket number in URL
//   };
//   const handleSearch = async () => {
//     const q = query.trim();
  
//     if (!q) {
//       alert('Please enter a complaint number, mobile number, or serial number');
//       return;
//     }
  
//     let paramType = '';
//     if (/^[0-9]{10}$/.test(q)) {
//       paramType = 'phone';
//     } else if (/^[A-Za-z0-9-]+$/.test(q)) {
//       paramType = 'callNumber'; // ✅ treat everything else as ticket number
//     } else {
//       paramType = 'serialNo'; // fallback
//     }
//     try {
//       const response = await axiosInstance.get('CallSearch/search', {
//         params: { [paramType]: q },
//       });
  
//       const results = Array.isArray(response.data) ? response.data : [response.data];
//       setSearchResults(results);
//       setSearchAttempted(true); // ✅ Only set after getting results
//     } catch (error) {
//       console.error('Search error:', error);
//       setSearchResults([]);
//       setSearchAttempted(true); // ✅ Also set here for errors
//     }
  
//     setQuery('');
//   };
  
  
//   return (
//     <div style={{ display: 'flex' }}>
//       <SideBar />
//       <div className="content">
//         <div className="container">
//           <h2 className='h2'>Search Complaint</h2>

//           <div className="search-box">
//   <input
//     type="text"
//     placeholder="Complaint No / Mobile No / Serial No"
//     className="search-input"
//     value={query}
//     onChange={(e) => setQuery(e.target.value)}
//   />
//   <div className="search-buttons">
//     <button className="search-btn" onClick={handleSearch}>
//       Search
//     </button>
//     {/* <button className="search-btn" onClick={() => router.push('/call')}>
//       New Registration
//     </button> */}
//   </div>
// </div>
//           {searchResults.length > 0 && (
//             <div className="result-table">
//               <table>
//                 <thead>
//                   <tr>
//                     <th>History</th>
//                     <th>Name</th>
//                     <th>Mobile No.</th>
//                     {/* <th>Service Center</th> */}
//                     <th>Product</th>
//                     <th>Model</th>
//                     <th>Complaint No.</th>
//                     <th>Serial No.</th>
//                     <th>Call Type</th>
//                     <th>Sub Status</th>
//                     <th>Date</th>
//                   </tr>
//                 </thead>
//                 <tbody>
//                   {searchResults.map((result, index) => (
//                     <tr key={index}>
//                       <td>
//                         <button
//                           className="action-btn"
//                           onClick={() => handleViewHistory(result.tickeT_NO)}
//                         >
//                           History
//                         </button>
//                       </td>
//                       <td>{`${result.salutation} ${result.firstname} ${result.lastname}`}</td>
//                       <td>{result.mobile}</td>
//                       {/* <td>{result.serviceCenter || '—'}</td> */}
//                       <td>{result.category || '-'}</td>
//                       <td>{result.model || '-'}</td>
//                       <td>{result.tickeT_NO || '-'}</td>
//                       <td>{result.seriaL_NO || '-'}</td>
//                       <td>{result.calL_TYPE || '-'}</td>
//                       <td>{result.complainT_SUBSTATUS || '-'}</td>
//                       <td>{new Date(result.pop).toLocaleDateString() || '-'}</td>
//                     </tr>
//                   ))}
//                 </tbody>
//               </table>
//             </div>
//           )}

//           {searchAttempted && searchResults.length === 0 && (
//             <p style={{ marginTop: '20px', color: 'red' }}>No results found.</p>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// }


'use client';

import './search.css';
import SideBar from '@/components/SideBar';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import axiosInstance from '@/api/axiosInstance';

export default function SearchComplaintPage() {
  const router = useRouter();

  useEffect(() => {
    const userData = localStorage.getItem('userData');
    if (!userData) {
      router.replace('/');
    }
  }, [router]);

  const [query, setQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [searchAttempted, setSearchAttempted] = useState(false);

  const handleViewHistory = (ticketNo) => {
    sessionStorage.setItem('currentTicket', ticketNo);
    router.push('/history'); // ✅ No ticket number in URL
  };

  const handleSearch = async () => {
    const q = query.trim();

    if (!q) {
      alert('Please enter a complaint number, mobile number, or serial number');
      return;
    }

    let paramType = '';
    if (/^[0-9]{10}$/.test(q)) {
      paramType = 'phone';
    } else if (/^[A-Za-z0-9-]+$/.test(q)) {
      paramType = 'callNumber'; // ✅ treat everything else as ticket number
    } else {
      paramType = 'serialNo'; // fallback
    }
    try {
      const response = await axiosInstance.get('CallSearch/search', {
        params: { [paramType]: q },
      });

      const results = Array.isArray(response.data) ? response.data : [response.data];
      setSearchResults(results);
      setSearchAttempted(true);
    } catch (error) {
      console.error('Search error:', error);
      setSearchResults([]);
      setSearchAttempted(true);
    }

    setQuery('');
  };

  return (
    <div style={{ display: 'flex' }}>
      <SideBar />
      <div className="content">
        <div className="container">
          <h2 className="h2">Search Complaint</h2>

          <div className="search-box">
            <input
              type="text"
              placeholder="Complaint No / Mobile No / Serial No"
              className="search-input"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
            <div className="search-buttons">
              <button className="search-btn" onClick={handleSearch}>
                Search
              </button>
            </div>
          </div>

          {searchResults.length > 0 && (
            <div className="result-table">
              <table>
                <thead>
                  <tr>
                    <th>History</th>
                    <th>Name</th>
                    <th>Mobile No.</th>
                    {/* <th>Service Center</th> */}
                    <th>Product</th>
                    <th>Model</th>
                    <th>Complaint No.</th>
                    <th>Serial No.</th>
                    <th>Call Type</th>
                    <th>Sub Status</th>
                    <th>Date</th>
                  </tr>
                </thead>
                <tbody>
  {searchResults.map((result, index) => (
    <tr key={index}>
      {/* History button column */}
      <td>
        <button
          className="action-btn"
          onClick={() => handleViewHistory(result.tickeT_NO)}
        >
          History
        </button>
      </td>

      {/* New Registration button column (only if OK/Cancel) */}
      <td>
        {(result.complainT_SUBSTATUS?.toLowerCase() === 'ok' ||
          result.complainT_SUBSTATUS?.toLowerCase() === 'cancel') && (
          <button
            className="action-btn"
            style={{
              backgroundColor: '#714b67',
              color: '#fff',
            }}
            onClick={() => router.push('/call')}
          > 
            Registration
          </button>
        )}
      </td>

      {/* Other details */}
      <td>{`${result.salutation} ${result.firstname} ${result.lastname}`}</td>
      <td>{result.mobile}</td>
      {/* <td>{result.serviceCenter || '—'}</td> */}
      <td>{result.category || '-'}</td>
      <td>{result.model || '-'}</td>
      <td>{result.tickeT_NO || '-'}</td>
      <td>{result.seriaL_NO || '-'}</td>
      <td>{result.calL_TYPE || '-'}</td>
      <td>{result.complainT_SUBSTATUS || '-'}</td>
      <td>{result.pop ? new Date(result.pop).toLocaleDateString() : '-'}</td>
    </tr>
  ))}
</tbody>
              </table>
            </div>
          )}

          {searchAttempted && searchResults.length === 0 && (
            <p style={{ marginTop: '20px', color: 'red' }}>No results found.</p>
          )}
        </div>
      </div>
    </div>
  );
}
