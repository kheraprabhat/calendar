import { Event as EventType } from './types';
import moment from 'moment';
import DatePicker from 'react-datepicker';

export default function EventList({
  events,
  filterDate,
  onChangeEvent,
  onDeleteEvent,
  onSelectEvent,
  setFilterDate,
}: {
  events: EventType[];
  filterDate: Date;
  onChangeEvent: (event: EventType) => void;
  onDeleteEvent: (id: string) => void;
  onSelectEvent: (id: string) => void;
  setFilterDate: (date: Date) => void;
}) {
  const filteredEvents = events?.filter(event => {
    // TODO: fix date filter
    // filterDate is complete date so 
    // filterDateMoment.isSame(startDateMoment, 'day') and
    // filterDateMoment.isSame(endDateMoment, 'day') are required below
    const filterDateMoment = moment(filterDate);
    const startDateMoment = moment.unix(event.startDate);
    const endDateMoment = moment.unix(event.endDate);
    return filterDateMoment.isSame(startDateMoment, 'day')
      || filterDateMoment.isBetween(startDateMoment, endDateMoment)
      || filterDateMoment.isSame(endDateMoment, 'day');
  }) || [];

  const sortedEvents = filteredEvents.sort((a, b) => a.startDate - b.startDate);

  return (
    <div className='events'>
      <h2>Events</h2>
      <div className='events__filter'>
        <DatePicker
          placeholderText='Filter by date'
          selected={filterDate}
          onChange={(date) => {
            date && setFilterDate(date)
          }}
          dateFormat={'MMMM d, yyyy'}
        />
      </div>
      <div className='events__count'>
        {sortedEvents.length} events
      </div>
      <ul className='events__list'>
        {sortedEvents.map(event => (
          <li key={event.id}>
            <Event
              event={event}
              onChange={onChangeEvent}
              onDelete={onDeleteEvent}
              onSelect={onSelectEvent}
            />
          </li>
        ))}
      </ul>
    </div>
  );
}

function Event({ event, onDelete, onSelect }:
  {
    event: EventType;
    onChange: (event: EventType) => void;
    onDelete: (id: string) => void;
    onSelect: (id: string) => void;
  }
) {
  const taskContent = <div className='event'>
    {`${moment.unix(event.startDate).format('LT')}-${moment.unix(event.endDate).format('LT')}`}
    <div className='event__title'>{event.title}</div>
    <div className='event__desc'>{event.description}</div>
  </div>;

  return (
    <div>
      {taskContent}

      {!event.thirdParty && <>
        <button onClick={() => onSelect(event.id)} className='events__btn-edit'>
          Edit
        </button>
        <button onClick={() => onDelete(event.id)} className='events__btn-del'>
          Delete
        </button>
      </>}
    </div>
  );
}