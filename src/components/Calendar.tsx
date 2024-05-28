import AddEvent from './AddEvent';
import EventList from './EventList';
import { CalendarProvider } from './providers/CalendarContext';

import './Calendar.css';

export default function CalendarApp() {
  return (
    <CalendarProvider>
      <AddEvent />
      <EventList />
    </CalendarProvider>
  );
}
