import React, { useState } from 'react';
import Header from './components/Header';
import BottomNav from './components/BottomNav';
import TimeGrid from './components/TimeGrid';
import AnalyticsDashboard from './components/AnalyticsDashboard';
import { useTimebox } from './hooks/useTimebox';

function App() {
  const [activeTab, setActiveTab] = useState('timebox');
  const timebox = useTimebox();

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      height: '100dvh', /* mobile viewport height */
      width: '100%',
      maxWidth: '480px', /* Mobile app width limit */
      margin: '0 auto',
      position: 'relative',
      background: 'var(--bg-color)'
    }}>
      <Header currentDate={timebox.currentDate} onChangeDate={timebox.changeDate} />
      
      <main style={{
        flex: 1,
        overflowY: 'auto',
        overflowX: 'hidden',
        paddingBottom: '80px', // Space for bottom nav
        position: 'relative'
      }}>
        {activeTab === 'timebox' ? (
          <TimeGrid timebox={timebox} />
        ) : (
          <AnalyticsDashboard timebox={timebox} />
        )}
      </main>

      <BottomNav activeTab={activeTab} setActiveTab={setActiveTab} />
    </div>
  );
}

export default App;
