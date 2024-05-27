import { Event } from "../components/types";

export interface Action {
  type: string;
  data: Event | Event[] | Date | string;
}

export interface State {
  events: Event[];
  filterDate: Date;
}

export function eventsReducer(state: State, action: Action): State { // TODO: Add type for action
  switch (action.type) {
    case 'added': {
      const event = {
        ...action.data as Event,
      };
      return {
        ...state,
        events: [...state.events, event]
      };
    }
    case 'changed': {
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
    case 'deleted': {
      return {
        ...state,
        events: [...state.events.filter(e => e.id !== action.data as string)]
      };
    }
    case 'moonPhases': {
      const events: Event[] = [];
      const moonPhases = action.data as Event[];
      moonPhases.forEach(moonPhase => {
        const isExists = state.events.find(e => e.type === moonPhase.type && e.startDate === moonPhase.startDate);
        if (!isExists) {
          events.push(moonPhase);
        }
      });
      return {
        ...state,
        events: [...state.events, ...events]
      };
    }
    case 'filterDate': {
      return {
        ...state,
        filterDate: action.data as Date
      };
    }
    default: {
      throw Error('Unknown action: ' + action.type);
    }
  }
}
