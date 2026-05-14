import React from 'react';
import { Clock, BarChart2 } from 'lucide-react';

const BottomNav = ({ activeTab, setActiveTab }) => {
  return (
    <nav className="glass-panel" style={{
      position: 'fixed',
      bottom: '16px',
      left: '16px',
      right: '16px',
      display: 'flex',
      justifyContent: 'space-around',
      padding: '12px',
      borderRadius: 'var(--radius-full)',
      zIndex: 100
    }}>
      <button 
        onClick={() => setActiveTab('timebox')}
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '4px',
          color: activeTab === 'timebox' ? 'var(--accent-1)' : 'var(--text-tertiary)',
          transition: 'all var(--transition-fast)',
          width: '80px' // Increased touch target
        }}
      >
        <div style={{
          padding: '8px 24px',
          borderRadius: 'var(--radius-full)',
          background: activeTab === 'timebox' ? 'rgba(99, 102, 241, 0.1)' : 'transparent',
        }}>
          <Clock size={24} />
        </div>
        <span style={{ fontSize: '12px', fontWeight: activeTab === 'timebox' ? 600 : 500 }}>타임박스</span>
      </button>

      <button 
        onClick={() => setActiveTab('analytics')}
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '4px',
          color: activeTab === 'analytics' ? 'var(--accent-1)' : 'var(--text-tertiary)',
          transition: 'all var(--transition-fast)',
          width: '80px' // Increased touch target
        }}
      >
        <div style={{
          padding: '8px 24px',
          borderRadius: 'var(--radius-full)',
          background: activeTab === 'analytics' ? 'rgba(99, 102, 241, 0.1)' : 'transparent',
        }}>
          <BarChart2 size={24} />
        </div>
        <span style={{ fontSize: '12px', fontWeight: activeTab === 'analytics' ? 600 : 500 }}>인사이트</span>
      </button>
    </nav>
  );
};

export default BottomNav;
