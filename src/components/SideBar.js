'use client';

import './Sidebar.css';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function SideBar() {
  const router = useRouter();

  const handleLogout = () => {
    localStorage.removeItem('userData');
    router.push('/login');
  };

  return (
    <nav className="mainMenu">
      <ul>
        {/* <li className="logo">
          <Link href="#">
            <Image
              src="/jainalogologin.jpg"
              alt="Dashboard Logo"
              width={40}
              height={40}
              className="logoImg"
            />
          </Link>
        </li> */}
        <li className="logo">
  <Link href="#">
    <div className="logoContainer">
      <Image
        src="/jainalogologin.jpg"
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
        <li>
          <Link href="#">
            <i className="fa fa-film fa-2x"></i>
            <span className="navText">Surveying Tutorials</span>
          </Link>
        </li>
        <li>
          <Link href="#">
            <i className="fa fa-book fa-2x"></i>
            <span className="navText">Surveying Jobs</span>
          </Link>
        </li>
        <li>
          <Link href="#">
            <i className="fa fa-cogs fa-2x"></i>
            <span className="navText">Tools & Resources</span>
          </Link>
        </li>
        <li>
          <Link href="#">
            <i className="fa fa-map-marker fa-2x"></i>
            <span className="navText">Member Map</span>
          </Link>
        </li>
        <li>
          <Link href="#">
            <i className="fa fa-info fa-2x"></i>
            <span className="navText">Documentation</span>
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
