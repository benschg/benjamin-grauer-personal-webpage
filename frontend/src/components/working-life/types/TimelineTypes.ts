export type TimelineEventType = 'work' | 'education' | 'achievement' | 'project' | 'certification' | 'personal';

export interface TimelineEvent {
  id: string;
  year: string;
  title: string;
  company: string;
  description: string;
  type: TimelineEventType;
  skills?: string[];
  achievements?: string[];
}