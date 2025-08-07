

'use client';

import './search.css';
import SideBar from '@/components/SideBar';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import axiosInstance from '@/api/axiosInstance';

export default function SearchComplaintPage() {
  const router = useRouter();

useEffect (() => {
    const userData = localStorage.getItem('userData');
    if (!userData) {
      router.replace('/');
    }
  }, [router]);
  const [query, setQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [searchAttempted, setSearchAttempted] = useState(false);

  const handleViewHistory = (ticketNo) => {
    router.push(`/history/${ticketNo}`);
  };

  // const handleSearch = async () => {
  //   const q = query.trim();
  //   setSearchAttempted(true);

  //   if (!q) {
  //     alert('Please enter a complaint number, mobile number, or serial number');
  //     return;
  //   }

  //   let paramType = '';
  //   if (/^CALL-/.test(q)) paramType = 'callNumber';
  //   else if (/^[0-9]{10}$/.test(q)) paramType = 'phone';
  //   else paramType = 'serialNo';

  //   try {
  //     const response = await axiosInstance.get(`CallSearch/search`, {
  //       params: { [paramType]: q },
  //     });

  //     setSearchResults(Array.isArray(response.data) ? response.data : [response.data]);
  //   } catch (error) {
  //     console.error('Search error:', error);
  //     setSearchResults([]);
  //   }

  //   setQuery('');
  // };
  const handleSearch = async () => {
    const q = query.trim();
    setSearchAttempted(true);
  
    if (!q) {
      alert('Please enter a complaint number, mobile number, or serial number');
      return;
    }
  
    let paramType = '';
    if (/^CALL-/.test(q)) paramType = 'callNumber';
    else if (/^[0-9]{10}$/.test(q)) paramType = 'phone';
    else paramType = 'serialNo';
  
    try {
      const response = await axiosInstance.get('CallSearch/search', {
        params: { [paramType]: q },
      });
  
      setSearchResults(Array.isArray(response.data) ? response.data : [response.data]);
    } catch (error) {
      console.error('Search error:', error);
      setSearchResults([]);
    }
  
    setQuery('');
  };
  
  return (
    <div style={{ display: 'flex' }}>
      <SideBar />
      <div className="content">
        <div className="container">
          <h2 className='h2'>Search Complaint</h2>

          <div className="search-box">
            <input
              type="text"
              placeholder="Complaint No / Mobile No / Serial No"
              className="search-input"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
            <button className="search-btn" onClick={handleSearch}>
              🔍 Search
            </button>
          </div>

          {searchResults.length > 0 && (
            <div className="result-table">
              <table>
                <thead>
                  <tr>
                    <th>History</th>
                    <th>Name</th>
                    <th>Mobile No.</th>
                    <th>Service Center</th>
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
                      <td>
                        <button
                          className="action-btn"
                          onClick={() => handleViewHistory(result.callNumber)}
                        >
                          🕘 History
                        </button>
                      </td>
                      <td>{`${result.title} ${result.firstName} ${result.lastName}`}</td>
                      <td>{result.phone}</td>
                      <td>{result.serviceCenter || '—'}</td>
                      <td>{result.productCategory}</td>
                      <td>{result.model}</td>
                      <td>{result.callNumber}</td>
                      <td>{result.serialNo}</td>
                      <td>{result.callType}</td>
                      <td>{result.complaint_SubStatus || '-'}</td>
                      <td>{new Date(result.pop).toLocaleDateString()}</td>
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
