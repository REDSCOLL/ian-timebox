import { format, startOfDay, endOfDay, eachMinuteOfInterval, isSameDay } from 'date-fns';
import { ko } from 'date-fns/locale';

export const formatTime = (date) => format(date, 'HH:mm');
export const formatDate = (date) => format(date, 'yyyy-MM-dd');
export const formatDisplayDate = (date) => format(date, 'M월 d일 (EEEE)', { locale: ko });

// Generate time blocks for a day
export const generateTimeBlocks = (date, intervalMinutes = 30) => {
  const start = startOfDay(date);
  const end = endOfDay(date);
  
  const minutes = eachMinuteOfInterval({ start, end }, { step: intervalMinutes });
  
  return minutes.map(time => ({
    time,
    timeString: formatTime(time),
    isCurrent: isSameDay(time, new Date()) && 
               time.getHours() === new Date().getHours() && 
               Math.floor(time.getMinutes() / intervalMinutes) === Math.floor(new Date().getMinutes() / intervalMinutes)
  }));
};

// Calculate today's remaining energy (Assumes active hours: 06:00 ~ 24:00)
export const calculateEnergy = () => {
  const now = new Date();
  const startHour = 6;
  const endHour = 24;
  
  const currentHour = now.getHours();
  const currentMin = now.getMinutes();
  
  if (currentHour < startHour) return 100; // Before 6 AM, full energy
  
  const totalMinutes = (endHour - startHour) * 60;
  const passedMinutes = ((currentHour - startHour) * 60) + currentMin;
  
  let percentage = 100 - ((passedMinutes / totalMinutes) * 100);
  if (percentage < 0) percentage = 0;
  
  return percentage.toFixed(1);
};
