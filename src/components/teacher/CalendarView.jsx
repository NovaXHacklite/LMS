import React, { useState } from 'react';
import { Calendar, dateFnsLocalizer } from 'react-big-calendar';
import format from 'date-fns/format';
import parse from 'date-fns/parse';
import startOfWeek from 'date-fns/startOfWeek';
import getDay from 'date-fns/getDay';
import 'react-big-calendar/lib/css/react-big-calendar.css';

const locales = {
  'en-US': require('date-fns/locale/en-US'),
};

const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek,
  getDay,
  locales,
});

const CalendarView = ({ userId }) => {
  const [events, setEvents] = useState([]);
  const [reminderText, setReminderText] = useState('');
  const [selectedDate, setSelectedDate] = useState(null);

  const handleSelectSlot = ({ start }) => {
    setSelectedDate(start);
  };

  const handleAddReminder = () => {
    if (reminderText && selectedDate) {
      const newEvent = {
        title: reminderText,
        start: selectedDate,
        end: selectedDate,
        allDay: true,
      };
      setEvents([...events, newEvent]);
      setReminderText('');
      setSelectedDate(null);
    }
  };

  return (
    <div className="dashboard">
      <h2 className="text-2xl font-semibold mb-4">Calendar</h2>
      <p className="mb-6">Manage your teaching schedule and reminders. (User ID: {userId})</p>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2">
          <Calendar
            localizer={localizer}
            events={events}
            startAccessor="start"
            endAccessor="end"
            selectable
            onSelectSlot={handleSelectSlot}
            style={{ height: 500 }}
          />
        </div>

        <div className="bg-gray-50 p-4 rounded-md shadow-md">
          <h3 className="text-lg font-semibold mb-2">Add Reminder</h3>
          {selectedDate && (
            <p className="text-sm mb-2">Selected Date: {selectedDate.toDateString()}</p>
          )}
          <textarea
            className="w-full p-2 border border-gray-300 rounded-md mb-2"
            rows="4"
            placeholder="Type your reminder..."
            value={reminderText}
            onChange={(e) => setReminderText(e.target.value)}
          />
          <button
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            onClick={handleAddReminder}
          >
            Add Reminder
          </button>
        </div>
      </div>
    </div>
  );
};

export default CalendarView;
