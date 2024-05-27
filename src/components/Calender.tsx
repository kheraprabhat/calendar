import { useEffect, useReducer, useState } from 'react';
import AddEvent from './AddEvent';
import EventList from './EventList';
import { Event, MoonPhase } from './types';
import { Action, State, eventsReducer } from '../store/store';
import axios, { isCancel, AxiosError } from 'axios';
import { v4 as UUID } from 'uuid';
import moment from 'moment';

import './Calender.css';

const storageKey = 'calander-events-state';

export default function TaskApp() {
  const [selectedEvent, setSelectedEvent] = useState('');

  const initialState: State = {
    events: [],
    filterDate: new Date(),
  };

  const [state, dispatch] = useReducer<(state: State, action: Action) => State, State>(
    eventsReducer,
    initialState,
    (initialState: State) => {
      const state = localStorage.getItem(storageKey);
      if (state) {
        try {
          return JSON.parse(state);
        } catch (e) {
          return initialState;
        }
      } else {
        return initialState;
      }
    }
  );

  useEffect(() => {
    localStorage.setItem(storageKey, JSON.stringify(state));
  }, [state]);

  useEffect(() => {
    let allEvents: Event[] = [];
    const year = moment(state.filterDate).year();
    fetchMoonPhases(year).then(phases => {
      phases?.forEach(phase => {
        allEvents = [...allEvents, {
          id: UUID(),
          startDate: moment.utc(phase.Date).unix(),
          endDate: moment.utc(phase.Date).add(1, 'day').unix(), // TODO: Fix end date
          title: 'Moon phase',
          description: `Moon phase: ${phase.Phase}`,
          thirdParty: true,
          type: 'moonPhase',
        }];
      });
      dispatch({
        type: 'moonPhases',
        data: allEvents
      });
    });
  }, [state.filterDate]);

  const editEvent = state.events?.find(event => event.id === selectedEvent);

  if (!state) {
    return <div>Loading...</div>;
  }

  return (
    <>
      <AddEvent
        onAddEvent={handleAddEvent}
        onEditEvent={handleChangeEvent}
        editEvent={editEvent}
        resetEventForm={() => setSelectedEvent('')}
      />
      <EventList
        events={state.events}
        filterDate={state.filterDate}
        onChangeEvent={handleChangeEvent}
        onDeleteEvent={handleDeleteEvent}
        onSelectEvent={handleSelectEvent}
        setFilterDate={setFilterDate}
      />
    </>
  );

  function handleAddEvent(event: Event) {
    dispatch({
      type: 'added',
      data: event,
    });
  }

  function handleChangeEvent(event: Event) {
    dispatch({
      type: 'changed',
      data: event
    });
    setSelectedEvent('');
  }

  function handleDeleteEvent(id: string) {
    dispatch({
      type: 'deleted',
      data: id
    });
  }

  function handleSelectEvent(id: string) {
    setSelectedEvent(id);
  }

  function setFilterDate(date: Date) {
    dispatch({
      type: 'filterDate',
      data: date
    });
  }

  async function fetchMoonPhases(year: number) {
    try {
      const response = await axios.get<MoonPhase[]>(`https://craigchamberlain.github.io/moon-data/api/moon-phase-data/${year}`);
      return response.data;
    } catch (error) {
      if (isCancel(error)) {
        console.log('Request canceled', error.message);
      } else {
        const axiosError = error as AxiosError;
        console.log('Error:', axiosError.response?.data);
      }
    }
  }
}
