import React, { useState, useEffect } from 'react';
import { calendarFetcher } from '../../../api/student';

export default function StudentCalendarPage() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedEvent, setSelectedEvent] = useState(null);

  useEffect(() => {
    async function loadCalendar() {
      try {
        setLoading(true);
        const res = await calendarFetcher.getEvents();
        if (res.success) {
          setEvents(res.data || []);
        }
      } catch (err) {
        console.error('Error fetching calendar events', err);
      } finally {
        setLoading(false);
      }
    }
    loadCalendar();
  }, []);

  const daysInMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).getDate();
  const firstDayIndex = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1).getDay();

  const prevMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  };

  const nextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
  };

  const monthName = currentDate.toLocaleString('default', { month: 'long', year: 'numeric' });

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <h1 style={{ fontSize: '26px', fontWeight: 700, margin: '0 0 6px', color: '#f8fafc' }}>
            Unified Academic & Event Calendar
          </h1>
          <p style={{ margin: 0, color: '#94a3b8', fontSize: '14px' }}>
            Syncing practical lab classes, assignments, tests, exams, holidays, and payment due dates.
          </p>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <button
            onClick={prevMonth}
            style={{ background: '#1e293b', color: '#f8fafc', border: '1px solid #334155', borderRadius: '8px', padding: '8px 14px', cursor: 'pointer', fontWeight: 600 }}
          >
            ← Prev
          </button>
          <div style={{ fontSize: '16px', fontWeight: 700, color: '#f59e0b', minWidth: '160px', textAlign: 'center' }}>
            {monthName}
          </div>
          <button
            onClick={nextMonth}
            style={{ background: '#1e293b', color: '#f8fafc', border: '1px solid #334155', borderRadius: '8px', padding: '8px 14px', cursor: 'pointer', fontWeight: 600 }}
          >
            Next →
          </button>
        </div>
      </div>

      {/* Calendar Grid */}
      <div style={{ background: '#1e293b', borderRadius: '16px', border: '1px solid #334155', overflow: 'hidden' }}>
        {/* Days Header */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', background: '#0f172a', borderBottom: '1px solid #334155', textAlign: 'center', padding: '12px 0', fontSize: '13px', fontWeight: 700, color: '#94a3b8' }}>
          <div>SUN</div>
          <div>MON</div>
          <div>TUE</div>
          <div>WED</div>
          <div>THU</div>
          <div>FRI</div>
          <div>SAT</div>
        </div>

        {/* Days Cells */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', minHeight: '520px' }}>
          {Array.from({ length: firstDayIndex }).map((_, i) => (
            <div key={`empty-${i}`} style={{ background: 'rgba(15, 23, 42, 0.4)', borderRight: '1px solid #334155', borderBottom: '1px solid #334155', padding: '10px' }} />
          ))}

          {Array.from({ length: daysInMonth }).map((_, i) => {
            const dayNum = i + 1;
            const isToday = new Date().getDate() === dayNum && new Date().getMonth() === currentDate.getMonth() && new Date().getFullYear() === currentDate.getFullYear();
            
            // Sample simulated events for demo if empty
            const dayEvents = events.filter(e => {
              const d = new Date(e.date);
              return d.getDate() === dayNum && d.getMonth() === currentDate.getMonth();
            });

            return (
              <div
                key={`day-${dayNum}`}
                style={{
                  borderRight: '1px solid #334155',
                  borderBottom: '1px solid #334155',
                  padding: '8px',
                  background: isToday ? 'rgba(245, 158, 11, 0.05)' : 'transparent',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '4px',
                  position: 'relative'
                }}
              >
                <div style={{
                  fontSize: '12px',
                  fontWeight: isToday ? 800 : 600,
                  color: isToday ? '#f59e0b' : '#94a3b8',
                  marginBottom: '4px'
                }}>
                  {dayNum} {isToday && '• Today'}
                </div>

                {/* Day's Event Badges */}
                {dayEvents.slice(0, 3).map((ev, eIdx) => (
                  <div
                    key={eIdx}
                    onClick={() => setSelectedEvent(ev)}
                    style={{
                      fontSize: '11px',
                      padding: '3px 6px',
                      borderRadius: '4px',
                      background: ev.type === 'EXAM' ? '#ef4444' : ev.type === 'DUE' ? '#f59e0b' : '#3b82f6',
                      color: '#fff',
                      fontWeight: 600,
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap',
                      cursor: 'pointer'
                    }}
                  >
                    {ev.title || 'Practical Lab'}
                  </div>
                ))}
              </div>
            );
          })}
        </div>
      </div>

      {/* Selected Event Modal */}
      {selectedEvent && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100 }}>
          <div style={{ background: '#1e293b', border: '1px solid #334155', borderRadius: '12px', padding: '24px', maxWidth: '440px', width: '90%' }}>
            <h3 style={{ margin: '0 0 10px', color: '#f8fafc' }}>{selectedEvent.title}</h3>
            <div style={{ fontSize: '13px', color: '#f59e0b', marginBottom: '8px', fontWeight: 600 }}>Type: {selectedEvent.type || 'Event'}</div>
            <p style={{ fontSize: '13px', color: '#94a3b8', lineHeight: 1.5 }}>
              {selectedEvent.description || 'Mandatory scheduled academic session. Please arrive on time at the assigned workstation.'}
            </p>
            <button
              onClick={() => setSelectedEvent(null)}
              style={{ marginTop: '16px', background: '#334155', color: '#f8fafc', padding: '8px 16px', borderRadius: '6px', border: 'none', cursor: 'pointer', fontWeight: 600 }}
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
