export interface SportsEvent {
  id: string;
  date: string;
  year: number;
  title: string;
  location: string;
  description: string;
  image?: string;
  achievement?: string;
  distance?: string;
  time?: string;
}

export const sportsTimeline: SportsEvent[] = [
  {
    id: 'green-city-marathon-2017',
    date: 'August 6, 2017',
    year: 2017,
    title: 'Green City Marathon Zürich',
    location: 'Zürich, Switzerland',
    description:
      'I liked this initiative, and together with my brother we did the entire course. We switched running and cycling throughout the race, and it was a great experience sharing this challenge as a team.',
    image: '/personal-life/sports-green-city-marathon-2017.jpg',
    distance: '42.195 km',
    achievement: 'Family team marathon completion',
  },
  {
    id: 'gigathlon-2017',
    date: 'July 8, 2017',
    year: 2017,
    title: 'Gigathlon 2017',
    location: 'Switzerland',
    description: 'Multi-stage endurance event across Switzerland with experience report shared.',
    image: '/personal-life/sports-gigathlon-2017.jpg',
    achievement: 'Multi-day endurance completion',
  },
  {
    id: 'zurich-marathon-2017',
    date: 'April 9, 2017',
    year: 2017,
    title: 'Zürich Marathon',
    location: 'Zürich, Switzerland',
    description:
      'On my birthday, I finished the Zürich Marathon. My goal was to maintain a 5:30 pace, which I achieved. It was a mental challenge, but I was ready and recovered quickly afterward.',
    image: '/personal-life/sports-zurich-marathon-2017.jpg',
    distance: '42.195 km',
    time: '5:30 pace',
    achievement: 'Birthday marathon with perfect pacing',
  },
  {
    id: 'swissman-2016',
    date: 'October 2, 2016',
    year: 2016,
    title: 'Swissman Triathlon',
    location: 'Switzerland',
    description:
      'A long day with many experiences, together with all my supporters at Swissman 2016. Due to thunderstorms, the swim was cancelled turning it into a duathlon. Despite overcoming a previous muscle fiber tear, I cycled challenging mountain passes including Gotthard, Furka, and Grimsel, then completed a demanding 42.2km marathon. The beauty of such competitions is not the goal, but the journey there.',
    image: '/personal-life/sports-swissman-2016.jpg',
    distance: '4km run + 180km bike + 42.2km run',
    achievement: 'Completed extreme duathlon in challenging conditions',
  },
  {
    id: 'transruinaulta-2015',
    date: 'October 24, 2015',
    year: 2015,
    title: 'Transruinaulta Marathon',
    location: 'Switzerland',
    description:
      'Mountain marathon with significant elevation gain through scenic Swiss landscapes.',
    image: '/personal-life/sports-transruinaulta-marathon-2015.jpg',
    distance: '42.195 km',
    achievement: 'Mountain marathon completion',
  },
  {
    id: 'cologne-triathlon-2015',
    date: 'October 15, 2015',
    year: 2015,
    title: 'Cologne Triathlon Weekend',
    location: 'Cologne, Germany',
    description: 'Participated just two weeks after the Inferno Triathlon.',
    image: '/personal-life/sports-cologne-triathlon-2015.jpg',
    achievement: 'Back-to-back triathlon completion',
  },
  {
    id: 'inferno-2015',
    date: 'August 29, 2015',
    year: 2015,
    title: 'Inferno Triathlon',
    location: 'Switzerland',
    description:
      'Reaching the Schilthorn for the second time, I focused on finding inner peace and setting clear goals. This race emphasized the importance of mental preparation and having support from the people around me during these extreme challenges.',
    image: '/personal-life/sports-inferno-triathlon.png',
    achievement: 'Second Inferno with mental mastery',
    distance: 'Olympic+ distance with extreme elevation',
  },
  {
    id: 'ironman-frankfurt-2015',
    date: 'July 6, 2015',
    year: 2015,
    title: 'Ironman Frankfurt',
    location: 'Frankfurt, Germany',
    description:
      'After internal debate about attempting a long-distance triathlon, I found myself satisfied with my previous performances and saw the 140.6-mile race as an intriguing challenge. Despite extensive preparation and commitment to the full Ironman distance, I did not finish this race.',
    distance: '3.8km swim, 180km bike, 42.2km run',
    achievement: 'DNF - Did not finish',
  },
  {
    id: 'jungfrau-marathon-2014',
    date: 'September 15, 2014',
    year: 2014,
    title: 'Jungfrau Marathon',
    location: 'Interlaken, Switzerland',
    description:
      'For my first marathon, I chose quite a challenge. Thanks to Martin, I got one of the coveted starting spots for the Jungfrau Marathon. The day before, I still had ankle pain - a slight irritation of the posterior tibial tendon, but I completed this demanding mountain course.',
    image: '/personal-life/sports-jungfrau-marathon-2014.jpg',
    distance: '42.195 km',
    achievement: 'First marathon despite injury',
  },
  {
    id: 'inferno-2014',
    date: 'August 27, 2014',
    year: 2014,
    title: 'Inferno Triathlon',
    location: 'Switzerland',
    description:
      'Two years after first encountering triathlon at the Uster Triathlon 2012, where I rode a route with what seemed like an incredible number of elevation meters in a relay, I never would have thought what would come next in my athletic journey. This marked the beginning of my serious triathlon pursuits.',
    image: '/personal-life/sports-inferno-triathlon.png',
    achievement: 'First Inferno completion - journey begins',
    distance: 'Olympic+ distance with extreme elevation',
  },
];
