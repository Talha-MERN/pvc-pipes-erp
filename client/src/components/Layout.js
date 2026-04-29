import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import './Layout.css';

function Layout({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();

  const navItems = [
    { path: '/', label: 'Dashboard', icon: '📊' },
    { path: '/products', label: 'Products', icon: '📦' },
    { path: '/raw-materials', label: 'Raw Materials', icon: '🧪' },
    { path: '/parties', label: 'Parties', icon: '👥' },
    { path: '/invoices', label: 'Invoices', icon: '🧾' },
    { path: '/invoices/new', label: 'New Invoice', icon: '➕' },
    { path: '/ledger', label: 'Ledger', icon: '📒' },
    { path: '/production', label: 'Production', icon: '⚙️' },
  ];

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);
  const closeSidebar = () => setSidebarOpen(false);

  return (
    <div className="layout">
      {/* Hamburger button for mobile */}
      <button className="menu-toggle" onClick={toggleSidebar}>
        ☰
      </button>

      {/* Overlay for mobile when sidebar is open */}
      {sidebarOpen && <div className="overlay" onClick={closeSidebar}></div>}

      {/* Sidebar */}
      <aside className={`sidebar ${sidebarOpen ? 'open' : ''}`}>
        <div className="sidebar-header">
          <h2>🏭 PVC ERP</h2>
        </div>
        <nav>
          <ul>
            {navItems.map(item => (
              <li key={item.path}>
                <Link
                  to={item.path}
                  className={location.pathname === item.path ? 'active' : ''}
                  onClick={closeSidebar}
                >
                  <span className="nav-icon">{item.icon}</span>
                  <span className="nav-label">{item.label}</span>
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </aside>

      {/* Main content area */}
      <main className="main-content">
        {children}
      </main>
    </div>
  );
}

export default Layout;