export interface Event {
  id: string;
  startDate: number;
  endDate: number;
  title: string;
  description: string;
  recurring?: boolean;
  recurringType?: 'daily' | 'weekly' | 'monthly' | 'yearly';
  allDay?: boolean;

  type?: 'moonPhase' | 'event';
  thirdParty?: boolean;
}

export interface MoonPhase {
  Date: string;
  Phase: string;
}