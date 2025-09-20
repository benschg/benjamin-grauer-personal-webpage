export interface Artwork {
  id: string;
  title: string;
  filename: string;
  description?: string;
  medium?: string;
  year?: string;
  category: 'Painting' | 'Digital Art' | 'Crafts' | 'Mixed Media' | 'Abstract';
  featured?: boolean;
}

export const artworkGallery: Artwork[] = [
  {
    id: 'jupiter',
    title: 'Jupiter',
    filename: 'jupiter.jpg',
    description:
      'A cosmic representation of the gas giant Jupiter with swirling atmospheric patterns',
    medium: 'Digital/Mixed Media',
    year: '2020',
    category: 'Digital Art',
    featured: true,
  },
  {
    id: 'fire',
    title: 'Fire',
    filename: 'fire.jpg',
    description: 'Dynamic fire elements with intense colors and movement',
    medium: 'Digital/Mixed Media',
    year: '2020',
    category: 'Digital Art',
    featured: true,
  },
  {
    id: 'black-hole',
    title: 'Black Hole',
    filename: 'black-hole.jpg',
    description: 'A mesmerizing representation of a black hole with gravitational effects',
    medium: 'Digital/Mixed Media',
    year: '2020',
    category: 'Digital Art',
    featured: true,
  },
  {
    id: 'heart',
    title: 'Heart',
    filename: 'heart.jpg',
    description: 'An artistic interpretation of the human heart',
    medium: 'Mixed Media',
    year: '2020',
    category: 'Mixed Media',
  },
  {
    id: 'golden-clothing',
    title: 'Golden Clothing',
    filename: 'golden-clothing.jpg',
    description: 'Elegant golden fabric textures and clothing designs',
    medium: 'Digital Art',
    year: '2020',
    category: 'Digital Art',
  },
  {
    id: 'white',
    title: 'White',
    filename: 'white.jpg',
    description: 'Minimalist white composition with subtle textures',
    medium: 'Digital/Mixed Media',
    year: '2020',
    category: 'Abstract',
  },
  {
    id: 'virus-sides',
    title: 'Virus Sides',
    filename: 'virus-sides.jpg',
    description: 'Scientific-artistic representation of viral structures',
    medium: 'Digital Art',
    year: '2020',
    category: 'Digital Art',
  },
  {
    id: 'equipment',
    title: 'Art Equipment',
    filename: 'equipment.jpg',
    description: 'Collection of art supplies and creative tools',
    medium: 'Photography',
    year: '2020',
    category: 'Crafts',
  },
  {
    id: 'the-initial',
    title: 'The Initial',
    filename: 'the-initial.jpg',
    description: 'An artistic initial or letter design',
    medium: 'Mixed Media',
    year: '2020',
    category: 'Mixed Media',
  },
  {
    id: 'covid',
    title: 'COVID',
    filename: 'covid.jpg',
    description: 'Artistic expression during the COVID-19 pandemic',
    medium: 'Digital/Mixed Media',
    year: '2020',
    category: 'Digital Art',
  },
  {
    id: 'a-whales-diareah',
    title: "A Whale's Dilemma",
    filename: 'a-whales-diareah.jpg',
    description: 'Marine life artistic interpretation',
    medium: 'Mixed Media',
    year: '2020',
    category: 'Mixed Media',
  },
  {
    id: 'blubbers',
    title: 'Blubbers',
    filename: 'blubbers.jpg',
    description: 'Bubble-like formations and textures',
    medium: 'Digital Art',
    year: '2020',
    category: 'Abstract',
  },
  {
    id: 'childs-bunneys',
    title: "Child's Bunnies",
    filename: 'childs-bunneys.jpg',
    description: "Playful bunny characters in a children's art style",
    medium: 'Mixed Media',
    year: '2020',
    category: 'Mixed Media',
  },
  {
    id: 'flow',
    title: 'Flow',
    filename: 'flow.jpg',
    description: 'Fluid dynamics and movement patterns',
    medium: 'Digital Art',
    year: '2020',
    category: 'Abstract',
  },
  {
    id: 'flow-2',
    title: 'Flow 2',
    filename: 'flow-2.jpg',
    description: 'Continued exploration of fluid movements',
    medium: 'Digital Art',
    year: '2020',
    category: 'Abstract',
  },
  {
    id: 'glitzer',
    title: 'Glitzer',
    filename: 'glitzer.jpg',
    description: 'Sparkling, glittery textures and effects',
    medium: 'Mixed Media',
    year: '2020',
    category: 'Mixed Media',
  },
  {
    id: 'gold',
    title: 'Gold',
    filename: 'gold.jpg',
    description: 'Rich golden textures and metallic effects',
    medium: 'Digital Art',
    year: '2020',
    category: 'Digital Art',
  },
  {
    id: 'king-s',
    title: "King's",
    filename: 'king-s.jpg',
    description: 'Royal-themed artistic composition',
    medium: 'Mixed Media',
    year: '2020',
    category: 'Mixed Media',
  },
  {
    id: 'twins',
    title: 'Twins',
    filename: 'twins.jpg',
    description: 'Dual or mirrored artistic elements',
    medium: 'Mixed Media',
    year: '2020',
    category: 'Mixed Media',
  },
  {
    id: 'wifes-work',
    title: "Wife's Work",
    filename: 'wifes-work.jpg',
    description: 'Collaborative or family artwork',
    medium: 'Mixed Media',
    year: '2020',
    category: 'Mixed Media',
  },
  {
    id: 'colors',
    title: 'Colors',
    filename: 'colors.jpg',
    description: 'Vibrant color exploration and composition',
    medium: 'Painting',
    year: '2020',
    category: 'Painting',
  },
  {
    id: 'bad',
    title: 'Bad',
    filename: 'bad.jpg',
    description: 'Dark or edgy artistic expression',
    medium: 'Mixed Media',
    year: '2020',
    category: 'Mixed Media',
  },
  {
    id: 'cubes',
    title: 'Cubes',
    filename: 'cubes.jpg',
    description: 'Geometric cube arrangements and patterns',
    medium: 'Digital Art',
    year: '2020',
    category: 'Digital Art',
  },
  {
    id: 'sun',
    title: 'Sun',
    filename: 'sun.jpg',
    description: 'Solar-inspired artwork with radiant energy',
    medium: 'Digital Art',
    year: '2020',
    category: 'Digital Art',
  },
  {
    id: 'topfern',
    title: 'Töpfern',
    filename: 'töpfern.jpg',
    description: 'Pottery and ceramic work',
    medium: 'Ceramics',
    year: '2020',
    category: 'Crafts',
  },
  {
    id: 'topfernzapfen',
    title: 'Töpfernzapfen',
    filename: 'töpfernzapfen.jpg',
    description: 'Ceramic cone or vessel creation',
    medium: 'Ceramics',
    year: '2020',
    category: 'Crafts',
  },
  {
    id: 'effects',
    title: 'Effects',
    filename: 'effects.jpg',
    description: 'Special visual effects and techniques',
    medium: 'Digital Art',
    year: '2020',
    category: 'Digital Art',
  },
];

export const getArtworkCategories = (): string[] => {
  const categories = new Set<string>();
  artworkGallery.forEach((artwork) => {
    categories.add(artwork.category);
  });
  return Array.from(categories).sort();
};

export const filterArtwork = (
  artworks: Artwork[],
  category?: string,
  medium?: string
): Artwork[] => {
  return artworks.filter((artwork) => {
    if (category && artwork.category !== category) return false;
    if (medium && artwork.medium !== medium) return false;
    return true;
  });
};
