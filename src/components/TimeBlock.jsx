import React, { useState, useEffect } from 'react';
import { CheckCircle2, ArrowRightCircle, Plus, Timer } from 'lucide-react';

const TimeBlock = ({ block, events, interval = 30, onAddEvent, onUpdateStatus }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const [timeLeft, setTimeLeft] = useState('');

  const blockEvents = events.filter(e => e.timeString === block.timeString);
  const hasEvent = blockEvents.length > 0;

  useEffect(() => {
    if (!block.isCurrent) return;

    const calculateTimeLeft = () => {
      const now = new Date();
      const endTime = new Date(block.time.getTime() + interval * 60000);
      const diff = endTime.getTime() - now.getTime();
      
      if (diff <= 0) {
        setTimeLeft('종료');
        return;
      }
      
      const m = Math.floor(diff / 60000);
      const s = Math.floor((diff % 60000) / 1000);
      setTimeLeft(`${m}분 ${s}초 남음`);
    };

    calculateTimeLeft();
    const timerId = setInterval(calculateTimeLeft, 1000);
    return () => clearInterval(timerId);
  }, [block.isCurrent, block.time, interval]);

  const handleAdd = () => {
    if (inputValue.trim()) {
      onAddEvent(block.timeString, inputValue.trim());
      setInputValue('');
    }
    setIsEditing(false);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') handleAdd();
    if (e.key === 'Escape') setIsEditing(false);
  };

  return (
    <div 
      className={`glass-card ${block.isCurrent ? 'animate-pulse-border' : ''}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{
        display: 'flex',
        minHeight: '72px', // Slightly larger for better touch
        margin: '0 16px 12px 16px',
        padding: '12px',
        position: 'relative',
        overflow: 'hidden',
        borderLeft: block.isCurrent ? '4px solid var(--danger)' : '1px solid var(--surface-border)'
      }}
    >
      {/* Time Label */}
      <div style={{ 
        width: '64px', 
        borderRight: '1px solid var(--surface-border)',
        display: 'flex',
        alignItems: 'flex-start',
        paddingTop: '4px'
      }}>
        <span style={{ 
          fontSize: '14px', 
          color: block.isCurrent ? 'var(--danger)' : 'var(--text-secondary)',
          fontWeight: block.isCurrent ? 700 : 500
        }}>
          {block.timeString}
        </span>
      </div>

      {/* Content Area */}
      <div style={{ flex: 1, paddingLeft: '16px', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
        {hasEvent ? (
          blockEvents.map(event => (
            <div key={event.id} style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              background: event.status === 'completed' ? 'rgba(16, 185, 129, 0.1)' : 
                          event.status === 'migrated' ? 'rgba(245, 158, 11, 0.1)' : 'transparent',
              padding: '10px 8px', // Increased padding
              borderRadius: 'var(--radius-sm)',
              marginBottom: '4px',
              transition: 'all var(--transition-fast)'
            }}>
              <span style={{ 
                fontSize: '15px', 
                fontWeight: 500,
                textDecoration: event.status === 'completed' ? 'line-through' : 'none',
                color: event.status === 'completed' ? 'var(--success)' : 
                       event.status === 'migrated' ? 'var(--warning)' : 'var(--text-primary)'
              }}>
                {event.title}
              </span>
              
              <div style={{ display: 'flex', gap: '4px' }}>
                <button 
                  onClick={() => onUpdateStatus(event.id, event.status === 'completed' ? 'pending' : 'completed')}
                  style={{ color: event.status === 'completed' ? 'var(--success)' : 'var(--text-tertiary)', padding: '4px' }}
                >
                  <CheckCircle2 size={22} />
                </button>
                <button 
                  onClick={() => onUpdateStatus(event.id, event.status === 'migrated' ? 'pending' : 'migrated')}
                  style={{ color: event.status === 'migrated' ? 'var(--warning)' : 'var(--text-tertiary)', padding: '4px' }}
                >
                  <ArrowRightCircle size={22} />
                </button>
              </div>
            </div>
          ))
        ) : isEditing ? (
          <div style={{ display: 'flex', gap: '8px' }}>
            <input
              autoFocus
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={handleKeyDown}
              onBlur={() => { if(!inputValue) setIsEditing(false); }}
              placeholder="무엇을 할 계획인가요?"
              style={{
                flex: 1,
                background: 'rgba(0,0,0,0.2)',
                border: '1px solid var(--accent-1)',
                color: 'white',
                padding: '10px 12px',
                borderRadius: 'var(--radius-sm)',
                outline: 'none',
                fontSize: '14px'
              }}
            />
            <button onClick={handleAdd} className="btn-primary" style={{ padding: '8px 16px', borderRadius: 'var(--radius-sm)' }}>
              추가
            </button>
          </div>
        ) : (
          <div 
            onClick={() => setIsEditing(true)}
            style={{ 
              height: '100%', 
              display: 'flex', 
              alignItems: 'center', 
              cursor: 'pointer',
              color: 'var(--text-tertiary)',
              padding: '8px 0' // Touch target height increase
            }}
          >
            <span style={{ fontSize: '14px', opacity: isHovered ? 1 : 0.6, transition: 'opacity 0.2s' }}>
              <Plus size={16} style={{ display: 'inline', verticalAlign: 'middle', marginRight: '6px' }} />
              터치하여 일정 추가
            </span>
          </div>
        )}
        
        {/* Countdown for current block */}
        {block.isCurrent && (
          <div style={{ 
            marginTop: '8px', 
            fontSize: '12px', 
            color: 'var(--danger)', 
            fontWeight: 600,
            display: 'flex',
            alignItems: 'center',
            gap: '4px'
          }}>
            <Timer size={14} />
            {timeLeft}
          </div>
        )}
      </div>
    </div>
  );
};

export default TimeBlock;
