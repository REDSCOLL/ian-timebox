import React, { useMemo } from 'react';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { Target, Zap, Clock, Flame, Brain } from 'lucide-react';

const COLORS = ['#10b981', '#f59e0b', '#6b7280']; // Success, Warning, Gray

const AnalyticsDashboard = ({ timebox }) => {
  const { total, completed, migrated, pending } = useMemo(() => {
    const events = timebox.dayEvents;
    const stats = { total: events.length, completed: 0, migrated: 0, pending: 0 };
    events.forEach(e => {
      if (e.status === 'completed') stats.completed++;
      else if (e.status === 'migrated') stats.migrated++;
      else stats.pending++;
    });
    return stats;
  }, [timebox.dayEvents]);

  const completionRate = total === 0 ? 0 : Math.round((completed / total) * 100);
  const { currentStreak, peakTime } = timebox.getInsights();

  const pieData = [
    { name: '완료됨', value: completed },
    { name: '미룸', value: migrated },
    { name: '대기중', value: pending },
  ];

  // Dummy data for weekly chart, but using real completion for today (Sun)
  const weeklyData = [
    { name: '월', 완료: 4, 계획: 5 },
    { name: '화', 완료: 6, 계획: 6 },
    { name: '수', 완료: 3, 계획: 7 },
    { name: '목', 완료: 8, 계획: 8 },
    { name: '금', 완료: 5, 계획: 6 },
    { name: '토', 완료: 2, 계획: 2 },
    { name: '일', 완료: completed, 계획: total },
  ];

  let comment = "일정을 추가하고 밀도있는 하루를 시작해보세요!";
  if (total > 0) {
    if (completionRate >= 80) comment = "대단한 집중력입니다! 완벽한 하루네요. 🚀";
    else if (completionRate >= 50) comment = "잘 하고 있습니다. 조금만 더 속도를 내볼까요? 💪";
    else comment = "시작이 반입니다. 하나씩 차근차근 완료해봐요! ✨";
  }

  return (
    <div className="animate-slide-up" style={{ padding: '16px', paddingBottom: '100px' }}>
      <h2 style={{ marginBottom: '8px', fontSize: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
        <Zap className="text-gradient" /> 
        <span className="text-gradient">오늘의 성과 분석</span>
      </h2>
      <p style={{ color: 'var(--text-secondary)', fontSize: '13px', marginBottom: '24px' }}>
        {comment}
      </p>

      {/* Summary Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '12px' }}>
        <div className="glass-card" style={{ padding: '16px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <Target size={24} style={{ color: 'var(--accent-1)', marginBottom: '8px' }} />
          <span style={{ fontSize: '24px', fontWeight: 700 }}>{completionRate}%</span>
          <span style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>오늘의 달성률</span>
        </div>
        <div className="glass-card" style={{ padding: '16px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <Clock size={24} style={{ color: 'var(--warning)', marginBottom: '8px' }} />
          <span style={{ fontSize: '24px', fontWeight: 700 }}>{migrated}</span>
          <span style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>미룬 일정 수</span>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '24px' }}>
        <div className="glass-card" style={{ padding: '16px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <Flame size={24} style={{ color: 'var(--danger)', marginBottom: '8px' }} />
          <span style={{ fontSize: '20px', fontWeight: 700 }}>{currentStreak}일</span>
          <span style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>연속 달성 스트릭</span>
        </div>
        <div className="glass-card" style={{ padding: '16px', display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
          <Brain size={24} style={{ color: 'var(--accent-2)', marginBottom: '8px' }} />
          <span style={{ fontSize: '16px', fontWeight: 700, lineHeight: 1.2, marginTop: '4px' }}>{peakTime}</span>
          <span style={{ fontSize: '12px', color: 'var(--text-secondary)', marginTop: '8px' }}>최적 집중 시간대</span>
        </div>
      </div>

      {/* Status Breakdown (Pie Chart) */}
      <div className="glass-panel" style={{ padding: '20px', marginBottom: '24px' }}>
        <h3 style={{ fontSize: '16px', marginBottom: '16px' }}>현재 상태 분포</h3>
        {total === 0 ? (
          <div style={{ height: '200px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-tertiary)', fontSize: '14px' }}>
            계획된 일정이 없습니다.
          </div>
        ) : (
          <div style={{ height: '200px' }}>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                  stroke="none"
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ background: 'var(--surface-2)', border: 'var(--glass-border)', borderRadius: '8px' }}
                  itemStyle={{ color: '#fff' }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>

      {/* Weekly Trend (Bar Chart) */}
      <div className="glass-panel" style={{ padding: '20px' }}>
        <h3 style={{ fontSize: '16px', marginBottom: '16px' }}>주간 달성 트렌드</h3>
        <div style={{ height: '250px' }}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={weeklyData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: 'var(--text-secondary)', fontSize: 12 }} />
              <YAxis axisLine={false} tickLine={false} tick={{ fill: 'var(--text-secondary)', fontSize: 12 }} />
              <Tooltip 
                cursor={{ fill: 'var(--surface-1)' }}
                contentStyle={{ background: 'var(--surface-2)', border: 'var(--glass-border)', borderRadius: '8px' }}
              />
              <Bar dataKey="계획" fill="var(--surface-border)" radius={[4, 4, 0, 0]} />
              <Bar dataKey="완료" fill="var(--accent-1)" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default AnalyticsDashboard;
