import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Settings, BatteryCharging } from 'lucide-react';
import { formatDisplayDate, calculateEnergy } from '../utils/dateUtils';

const Header = ({ currentDate, onChangeDate }) => {
  const [energy, setEnergy] = useState(calculateEnergy());

  useEffect(() => {
    // Update energy every minute
    const interval = setInterval(() => {
      setEnergy(calculateEnergy());
    }, 60000);
    return () => clearInterval(interval);
  }, []);

  let energyColor = 'var(--success)';
  if (energy < 50) energyColor = 'var(--warning)';
  if (energy < 20) energyColor = 'var(--danger)';

  return (
    <header className="glass-panel" style={{ 
      display: 'flex', 
      flexDirection: 'column',
      padding: '16px 20px',
      margin: '16px',
      marginBottom: '8px',
      borderRadius: 'var(--radius-lg)'
    }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <button onClick={() => onChangeDate(-1)} className="btn-icon">
            <ChevronLeft size={20} />
          </button>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <span style={{ fontSize: '12px', color: 'var(--text-secondary)', fontWeight: 500, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              오늘의 플랜
            </span>
            <h2 style={{ fontSize: '16px', fontWeight: 600, margin: 0 }}>
              {formatDisplayDate(currentDate)}
            </h2>
          </div>
          <button onClick={() => onChangeDate(1)} className="btn-icon">
            <ChevronRight size={20} />
          </button>
        </div>
        
        <button className="btn-icon" style={{ background: 'transparent', border: 'none', color: 'var(--text-tertiary)' }}>
          <Settings size={22} />
        </button>
      </div>

      {/* Energy Gauge */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        <BatteryCharging size={18} style={{ color: energyColor }} />
        <div style={{ flex: 1, height: '8px', background: 'var(--surface-border)', borderRadius: 'var(--radius-full)', overflow: 'hidden' }}>
          <div style={{ 
            width: `${energy}%`, 
            height: '100%', 
            background: energyColor,
            transition: 'width 1s ease-in-out, background-color 1s ease'
          }} />
        </div>
        <span style={{ fontSize: '12px', fontWeight: 600, color: energyColor, width: '40px', textAlign: 'right' }}>
          {energy}%
        </span>
      </div>
    </header>
  );
};

export default Header;
