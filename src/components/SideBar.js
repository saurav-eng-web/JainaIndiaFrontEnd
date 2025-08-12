
'use client';

import './Sidebar.css';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useDispatch } from 'react-redux';
import { logout } from '@/redux/slices/authSlice';

export default function SideBar() {
  const router = useRouter();
  const dispatch = useDispatch();

  const handleLogout = () => {
    dispatch(logout()); // Clear Redux state + localStorage
    router.push('/login'); // Redirect
  };

  return (
    <nav className="mainMenu">
      <ul>
        <li className="logo">
          <Link href="#">
            <div className="logoContainer">
              <Image
                src="/logo.jpg"
                alt="Dashboard Logo"
                width={190}
                height={60}
                className="logoImg"
              />
            </div>
          </Link>
        </li>
        <li>
          <Link href="/test">
            <i className="fa fa-home fa-2x"></i>
            <span className="navText">Dashboard</span>
          </Link>
        </li>
        <li>
          <Link href="/call">
            <i className="fa fa-phone fa-2x"></i>
            <span className="navText">Call Registration</span>
          </Link>
        </li>
        <li>
          <Link href="/warrantyregisteration">
            <i className="fa fa-certificate fa-2x"></i>
            <span className="navText">Warranty Registration</span>
          </Link>
        </li>
        <li>
          <Link href="/technicalApproval">
            <i className="fa fa-wrench fa-2x"></i>
            <span className="navText">Technical Approval</span>
          </Link>
        </li>
       
     
    
     
      </ul>

      <ul className="logout">
        <li onClick={handleLogout} style={{ cursor: 'pointer' }}>
          <div>
            <i className="fa fa-power-off fa-2x"></i>
            <span className="navText">Logout</span>
          </div>
        </li>
      </ul>
    </nav>
  );
}
