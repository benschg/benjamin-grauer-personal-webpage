import { DirectionsRun, EmojiEvents, FitnessCenter } from '@mui/icons-material';
import GenericTimeline from '../../components/common/Timeline/GenericTimeline';
import type { TimelineEvent, FilterOption } from '../../components/common/Timeline/GenericTimeline';
import { sportsTimeline } from './data/sportsTimelineData';

const SportsTimelineSection = () => {
  // Transform sports events to timeline events
  const timelineEvents: TimelineEvent[] = sportsTimeline.map((event) => ({
    id: event.id,
    year: event.year,
    title: event.title,
    location: event.location,
    description: event.description,
    type: getEventType(event.title),
    image: event.image,
    distance: event.distance,
    time: event.time,
    achievement: event.achievement,
  }));

  // Categorize events
  function getEventType(title: string): string {
    if (title.toLowerCase().includes('triathlon')) return 'triathlon';
    if (title.toLowerCase().includes('marathon')) return 'marathon';
    if (title.toLowerCase().includes('training')) return 'training';
    return 'competition';
  }

  const filterOptions: FilterOption[] = [
    { value: 'all', label: 'All Events', count: timelineEvents.length },
    {
      value: 'triathlon',
      label: 'Triathlon',
      count: timelineEvents.filter((e) => e.type === 'triathlon').length,
    },
    {
      value: 'marathon',
      label: 'Marathon',
      count: timelineEvents.filter((e) => e.type === 'marathon').length,
    },
    {
      value: 'training',
      label: 'Training',
      count: timelineEvents.filter((e) => e.type === 'training').length,
    },
    {
      value: 'competition',
      label: 'Competitions',
      count: timelineEvents.filter((e) => e.type === 'competition').length,
    },
  ];

  const getIcon = (type: string) => {
    switch (type) {
      case 'triathlon':
        return <DirectionsRun />;
      case 'marathon':
        return <DirectionsRun />;
      case 'training':
        return <FitnessCenter />;
      case 'competition':
        return <EmojiEvents />;
      default:
        return <DirectionsRun />;
    }
  };

  const getColor = (
    type: string
  ): 'primary' | 'secondary' | 'error' | 'info' | 'success' | 'warning' => {
    switch (type) {
      case 'triathlon':
        return 'primary';
      case 'marathon':
        return 'secondary';
      case 'training':
        return 'info';
      case 'competition':
        return 'success';
      default:
        return 'primary';
    }
  };

  return (
    <GenericTimeline
      title="Sports Timeline"
      events={timelineEvents}
      getIcon={getIcon}
      getColor={getColor}
      filterOptions={filterOptions}
      showCompany={false}
      showSkills={false}
      showAchievements={false}
      showDistance={true}
      showTime={true}
      showAchievement={true}
    />
  );
};

export default SportsTimelineSection;
