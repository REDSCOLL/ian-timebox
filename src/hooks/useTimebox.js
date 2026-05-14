import { useState, useEffect } from 'react';
import { formatDate } from '../utils/dateUtils';
import { isSameDay, subDays, parseISO } from 'date-fns';

const STORAGE_KEY = 'ian_timebox_data';
const SETTINGS_KEY = 'ian_timebox_settings';

export const useTimebox = (initialDate = new Date()) => {
  const [currentDate, setCurrentDate] = useState(initialDate);
  const [events, setEvents] = useState({});
  const [settings, setSettings] = useState({
    interval: 30, 
  });

  useEffect(() => {
    const savedEvents = localStorage.getItem(STORAGE_KEY);
    const savedSettings = localStorage.getItem(SETTINGS_KEY);
    
    if (savedEvents) {
      try { setEvents(JSON.parse(savedEvents)); } catch (e) { console.error(e); }
    }
    if (savedSettings) {
      try { setSettings(JSON.parse(savedSettings)); } catch (e) { console.error(e); }
    }
  }, []);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(events));
  }, [events]);

  useEffect(() => {
    localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
  }, [settings]);

  const dateKey = formatDate(currentDate);
  const dayEvents = events[dateKey] || [];

  const addEvent = (timeString, title, duration = settings.interval) => {
    const newEvent = {
      id: Date.now().toString(),
      timeString,
      title,
      duration,
      status: 'pending', 
      createdAt: new Date().toISOString()
    };

    setEvents(prev => ({
      ...prev,
      [dateKey]: [...(prev[dateKey] || []), newEvent]
    }));
  };

  const updateEventStatus = (eventId, status) => {
    setEvents(prev => ({
      ...prev,
      [dateKey]: (prev[dateKey] || []).map(ev => 
        ev.id === eventId ? { ...ev, status } : ev
      )
    }));
  };

  const deleteEvent = (eventId) => {
    setEvents(prev => ({
      ...prev,
      [dateKey]: (prev[dateKey] || []).filter(ev => ev.id !== eventId)
    }));
  };

  const changeInterval = (interval) => {
    setSettings(prev => ({ ...prev, interval }));
  };

  const changeDate = (days) => {
    const newDate = new Date(currentDate);
    newDate.setDate(newDate.getDate() + days);
    setCurrentDate(newDate);
  };

  // V2: Insights Calculation
  const getInsights = () => {
    let currentStreak = 0;
    let checkDate = new Date(); // Start checking from today
    
    // Calculate Streak
    while (true) {
      const dKey = formatDate(checkDate);
      const dEvents = events[dKey];
      if (!dEvents || dEvents.length === 0) {
        if (isSameDay(checkDate, new Date())) {
          // If today has no events, check yesterday
          checkDate = subDays(checkDate, 1);
          continue; 
        } else {
          break; // Break streak if a past day has no events
        }
      }
      
      const completed = dEvents.filter(e => e.status === 'completed').length;
      const rate = completed / dEvents.length;
      
      if (rate >= 0.5) {
        currentStreak++;
        checkDate = subDays(checkDate, 1);
      } else {
        if (isSameDay(checkDate, new Date())) {
           // It's okay if today is not > 50% yet, check yesterday
           checkDate = subDays(checkDate, 1);
        } else {
           break; // Broken streak
        }
      }
    }

    // Calculate Peak Focus Time
    const hourCounts = {};
    Object.values(events).flat().forEach(ev => {
      if (ev.status === 'completed') {
        const hour = parseInt(ev.timeString.split(':')[0], 10);
        hourCounts[hour] = (hourCounts[hour] || 0) + 1;
      }
    });
    
    let peakHour = null;
    let maxCount = 0;
    Object.entries(hourCounts).forEach(([hour, count]) => {
      if (count > maxCount) {
        maxCount = count;
        peakHour = parseInt(hour, 10);
      }
    });

    let peakTimeStr = '아직 데이터가 부족합니다';
    if (peakHour !== null) {
      if (peakHour < 12) peakTimeStr = `오전 ${peakHour}시`;
      else if (peakHour === 12) peakTimeStr = `낮 12시`;
      else peakTimeStr = `오후 ${peakHour - 12}시`;
    }

    return {
      currentStreak,
      peakTime: peakTimeStr
    };
  };

  return {
    currentDate,
    dateKey,
    dayEvents,
    allEvents: events,
    settings,
    changeDate,
    addEvent,
    updateEventStatus,
    deleteEvent,
    changeInterval,
    getInsights
  };
};
