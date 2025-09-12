import { Work, School, Star, Build, Assignment, Person } from '@mui/icons-material';
import GenericTimeline from '../../components/common/Timeline/GenericTimeline';
import type { TimelineEvent, FilterOption } from '../../components/common/Timeline/GenericTimeline';
import { timelineEvents } from './data/timelineData';

const TimelineSection = () => {
  // Transform working life events to timeline events
  const workingLifeEvents: TimelineEvent[] = timelineEvents.map((event) => ({
    id: event.id,
    year: parseInt(event.year),
    title: event.title,
    company: event.company,
    description: event.description,
    type: event.type,
    skills: event.skills,
    achievements: event.achievements,
    image: event.image,
  }));

  const filterOptions: FilterOption[] = [
    { value: 'all', label: 'All', count: timelineEvents.length },
    {
      value: 'work',
      label: 'Work',
      count: timelineEvents.filter((e) => e.type === 'work').length,
    },
    {
      value: 'education',
      label: 'Education',
      count: timelineEvents.filter((e) => e.type === 'education').length,
    },
    {
      value: 'project',
      label: 'Projects',
      count: timelineEvents.filter((e) => e.type === 'project').length,
    },
    {
      value: 'certification',
      label: 'Certifications',
      count: timelineEvents.filter((e) => e.type === 'certification').length,
    },
    {
      value: 'personal',
      label: 'Personal',
      count: timelineEvents.filter((e) => e.type === 'personal').length,
    },
  ];

  const getIcon = (type: string) => {
    switch (type) {
      case 'education':
        return <School />;
      case 'achievement':
        return <Star />;
      case 'project':
        return <Build />;
      case 'certification':
        return <Assignment />;
      case 'personal':
        return <Person />;
      default:
        return <Work />;
    }
  };

  const getColor = (
    type: string
  ): 'primary' | 'secondary' | 'error' | 'info' | 'success' | 'warning' => {
    switch (type) {
      case 'education':
        return 'secondary';
      case 'achievement':
        return 'warning';
      case 'project':
        return 'info';
      case 'certification':
        return 'success';
      case 'personal':
        return 'error';
      default:
        return 'primary';
    }
  };

  return (
    <GenericTimeline
      title="Career Timeline"
      events={workingLifeEvents}
      getIcon={getIcon}
      getColor={getColor}
      filterOptions={filterOptions}
      showCompany={true}
      showSkills={true}
      showAchievements={true}
      showDistance={false}
      showTime={false}
      showAchievement={false}
    />
  );
};

export default TimelineSection;
