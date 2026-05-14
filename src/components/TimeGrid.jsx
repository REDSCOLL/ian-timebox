import React, { useMemo, useEffect, useRef } from 'react';
import TimeBlock from './TimeBlock';
import { generateTimeBlocks } from '../utils/dateUtils';

const TimeGrid = ({ timebox }) => {
  const scrollRef = useRef(null);
  const blocks = useMemo(() => 
    generateTimeBlocks(timebox.currentDate, timebox.settings.interval), 
  [timebox.currentDate, timebox.settings.interval]);

  // Scroll to current time on mount if it's today
  useEffect(() => {
    const currentBlockIndex = blocks.findIndex(b => b.isCurrent);
    if (currentBlockIndex > 0 && scrollRef.current) {
      const targetBlock = scrollRef.current.children[Math.max(0, currentBlockIndex - 2)];
      if (targetBlock) {
        targetBlock.scrollIntoView({ behavior: 'smooth' });
      }
    }
  }, [blocks]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      {/* Interval Selector */}
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        gap: '8px', 
        padding: '0 16px 16px 16px',
        position: 'sticky',
        top: 0,
        background: 'var(--bg-color)',
        zIndex: 10
      }}>
        {[15, 30, 60].map(interval => (
          <button
            key={interval}
            onClick={() => timebox.changeInterval(interval)}
            style={{
              padding: '8px 20px', // Increased touch target
              borderRadius: 'var(--radius-full)',
              fontSize: '13px',
              fontWeight: timebox.settings.interval === interval ? 600 : 400,
              background: timebox.settings.interval === interval ? 'var(--accent-1)' : 'var(--surface-1)',
              color: timebox.settings.interval === interval ? 'white' : 'var(--text-secondary)',
              border: '1px solid',
              borderColor: timebox.settings.interval === interval ? 'var(--accent-1)' : 'var(--surface-border)',
              transition: 'all var(--transition-fast)'
            }}
          >
            {interval === 60 ? '1시간' : `${interval}분`}
          </button>
        ))}
      </div>

      {/* Grid */}
      <div ref={scrollRef} style={{ flex: 1, paddingBottom: '32px' }} className="animate-fade-in">
        {blocks.map(block => (
          <TimeBlock 
            key={block.timeString} 
            block={block} 
            events={timebox.dayEvents}
            interval={timebox.settings.interval}
            onAddEvent={timebox.addEvent}
            onUpdateStatus={timebox.updateEventStatus}
          />
        ))}
      </div>
    </div>
  );
};

export default TimeGrid;
