

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
    } else if (/^[A-Za-z]{2,}\d+$/.test(q)) {
      // starts with letters + numbers → serialNo
      paramType = 'serialNo';
    } else {
      // fallback → complaint number
      paramType = 'callNumber';
    }
    try {
      const response = await axiosInstance.get('CallSearch/search', {
        params: {
          phone: /^[0-9]{10}$/.test(q) ? q : '',
          callNumber: q,
          serialNo: q
        },
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
          {/* ✅ Conditionally render Registration column */}
          {searchResults.some(
            (result) =>
              result.complainT_SUBSTATUS?.toLowerCase() === 'ok' ||
              result.complainT_SUBSTATUS?.toLowerCase() === 'cancel'
          ) && <th>Registration</th>}
          <th>Name</th>
          <th>Mobile No.</th>
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
        {searchResults.map((result, index) => {
          const showRegistration =
            result.complainT_SUBSTATUS?.toLowerCase() === 'ok' ||
            result.complainT_SUBSTATUS?.toLowerCase() === 'cancel';

          return (
            <tr key={index}>
              {/* History button */}
              <td>
                <button
                  className="action-btn"
                  onClick={() => handleViewHistory(result.tickeT_NO)}
                >
                  History
                </button>
              </td>

              {/* ✅ Registration button cell only if header exists */}
              {searchResults.some(
                (r) =>
                  r.complainT_SUBSTATUS?.toLowerCase() === 'ok' ||
                  r.complainT_SUBSTATUS?.toLowerCase() === 'cancel'
              ) && (
                <td>
                  {showRegistration && (
                  <button
                  className="action-btn"
                  style={{ backgroundColor: '#714b67', color: '#fff' }}
                  onClick={() => {
                    const params = new URLSearchParams({
                      title: result.salutation || "",
                      firstName: result.firstname || "",
                      lastName: result.lastname || "",
                      phone: result.hmph || result.mobile || "",
                      altPhone: result.wkph || "",
                      customerAddress: result.addresS1 || "",
                      landmark: result.landmark || "",
                      pincode: result.pincode || "",
                      state: result.state || "",
                      city: result.city || "",
                      locality: result.locality || "",
                      localityId: result.localitY_ID?.toString() || "",
                      modelID: result.modeL_ID?.toString() || "",
                      cityId: result.citY_ID?.toString() || "",
                      serialNo: result.seriaL_NO || "",
                      productCategory: result.category || "",
                      brand: result.brand || "",
                      pop: result.purchasE_DATE || "",
                      product: result.product || "",
                      productID: result.producT_ID?.toString() || "",
                      model: result.model || "",
                      warranty: result.warranty || "",
                      callType: result.calL_TYPE || "",
                      faultVoc: result.remarks || "",
                      availableTime: result.promisE_TIME || ""
                    });
              
                    router.push(`/call?${params.toString()}`);
                  }}
                >
                  New Reg.
                </button>
                  )}
                </td>
              )}

              {/* Other details */}
              <td>{`${result.salutation} ${result.firstname} ${result.lastname}`}</td>
              <td>{result.mobile}</td>
              <td>{result.category || '-'}</td>
              <td>{result.model || '-'}</td>
              <td>{result.tickeT_NO || '-'}</td>
              <td>{result.seriaL_NO || '-'}</td>
              <td>{result.calL_TYPE || '-'}</td>
              <td>{result.complainT_SUBSTATUS || '-'}</td>
              <td>{result.pop ? new Date(result.pop).toLocaleDateString() : '-'}</td>
            </tr>
          );
        })}
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
