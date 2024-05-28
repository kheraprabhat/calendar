import axios, { AxiosError, isCancel } from 'axios';
import { MoonPhase, Event } from '../types';
import { useQuery } from '@tanstack/react-query';
import moment from 'moment';
import { v4 as UUID } from 'uuid';

export function useMoonPhasesEvents(year: number) {
  return useQuery({ queryKey: ['moon-phases', year], queryFn: () => fetchMoonPhasesEvents(year) });
}

export async function fetchMoonPhasesEvents(year: number) {
  try {
    const response = await axios.get<MoonPhase[]>(`https://craigchamberlain.github.io/moon-data/api/moon-phase-data/${year}`);
    const moonPhases = response.data.map(phase => {
      const moonPhase: Event = {
        id: UUID(),
        startDate: moment.utc(phase.Date).unix(),
        endDate: moment.utc(phase.Date).add(1, 'day').unix(), // TODO: Fix end date
        title: 'Moon phase',
        description: `Moon phase: ${phase.Phase}`,
        thirdParty: true,
        type: 'moonPhase',
      }
      return moonPhase;
    });
    return moonPhases;
  } catch (error) {
    if (isCancel(error)) {
      console.log('Request canceled', error.message);
    } else {
      const axiosError = error as AxiosError;
      console.log('Error:', axiosError.response?.data);
    }
  }
}