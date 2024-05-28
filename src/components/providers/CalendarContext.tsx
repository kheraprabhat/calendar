import { createContext, useReducer, ReactNode, useEffect, useContext } from 'react';
import { Event } from '../types';

const storageKey = 'calandar-events-state';

export interface Action {
  type: string;
  data: Event | Event[] | Date | string;
}

export interface State {
  events: Event[];
  filterDate: Date;
  selectedEvent?: string;
}

export const CalendarContext = createContext({} as { state: State, dispatch: (action: Action) => void });

export function useCalendar() {
  return useContext(CalendarContext);
}

export function calendarReducer(state: State, action: Action): State {
  switch (action.type) {
    case 'ADD_EVENT': {
      const event = {
        ...action.data as Event,
      };
      return {
        ...state,
        events: [...state.events, event]
      };
    }
    case 'EDIT_EVENT': {
      return {
        ...state,
        events: [...state.events.map(e => {
          if (e.id === (action.data as Event)?.id) {
            return action.data as Event;
          } else {
            return e;
          }
        })]
      };
    }
    case 'DELETE_EVENT': {
      return {
        ...state,
        events: [...state.events.filter(e => e.id !== action.data as string)]
      };
    }
    case 'FILTER_DATE': {
      return {
        ...state,
        filterDate: action.data as Date
      };
    }
    case 'SELECT_EVENT': {
      return {
        ...state,
        selectedEvent: action.data as string
      };
    }
    default: {
      throw Error('Unknown action: ' + action.type);
    }
  }
}

export function CalendarProvider({ children }: { children: ReactNode }) {
  const initialState: State = {
    events: [],
    filterDate: new Date(),
  };

  const [state, dispatch] = useReducer<(state: State, action: Action) => State, State>(
    calendarReducer,
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

  return (
    <CalendarContext.Provider value={{
      state,
      dispatch,
    }}>
        { children }
    </CalendarContext.Provider>
  );
}