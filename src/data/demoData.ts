export interface Apartment {
  id: string;
  title: string;
  description: string;
  price: number;
  room_type: string;
  address: string;
  lat: number;
  lng: number;
  image_urls: string[];
  created_by: string;
  created_at: string;
}

export const demoApartments: Apartment[] = [
  {
    id: "1",
    title: "Modern Studio Near Technion",
    description: "Bright and modern studio apartment just 5 minutes walk from Technion campus. Perfect for students with all amenities included.",
    price: 2800,
    room_type: "Studio",
    address: "Neve Shaanan, Haifa",
    lat: 32.776667,
    lng: 35.023333,
    image_urls: [
      "https://images.unsplash.com/photo-1721322800607-8c38375eef04?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&h=600&fit=crop"
    ],
    created_by: "demo-user",
    created_at: "2024-01-15T10:00:00Z"
  },
  {
    id: "2",
    title: "Spacious 2-Room Near University",
    description: "Beautiful 2-room apartment with balcony and parking. Close to University of Haifa with great public transport.",
    price: 4200,
    room_type: "2-Room",
    address: "Carmel Center, Haifa",
    lat: 32.794167,
    lng: 34.989167,
    image_urls: [
      "https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1531297484001-80022131f5a1?w=800&h=600&fit=crop"
    ],
    created_by: "demo-user",
    created_at: "2024-01-14T15:30:00Z"
  },
  {
    id: "3",
    title: "Shared Apartment - Room Available",
    description: "Great room in shared apartment with 2 other students. Kitchen and living room shared. Very friendly roommates!",
    price: 1800,
    room_type: "Shared",
    address: "Hadar HaCarmel, Haifa",
    lat: 32.794444,
    lng: 34.989722,
    image_urls: [
      "https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?w=800&h=600&fit=crop"
    ],
    created_by: "demo-user",
    created_at: "2024-01-13T09:15:00Z"
  },
  {
    id: "4",
    title: "Luxury 3-Room with Sea View",
    description: "Premium apartment with stunning sea view. Fully furnished with high-end appliances. Perfect for serious students.",
    price: 6500,
    room_type: "3-Room",
    address: "German Colony, Haifa",
    lat: 32.8,
    lng: 34.99,
    image_urls: [
      "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1487058792275-0ad4aaf24ca7?w=800&h=600&fit=crop"
    ],
    created_by: "demo-user",
    created_at: "2024-01-12T14:20:00Z"
  },
  {
    id: "5",
    title: "Budget-Friendly Studio",
    description: "Affordable studio perfect for students on a budget. Basic amenities but clean and well-maintained.",
    price: 2000,
    room_type: "Studio",
    address: "Wadi Nisnas, Haifa",
    lat: 32.8125,
    lng: 34.9975,
    image_urls: [
      "https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=800&h=600&fit=crop"
    ],
    created_by: "demo-user",
    created_at: "2024-01-11T11:45:00Z"
  }
];

export const demoInstitutions = [
  {
    name: "Technion - Israel Institute of Technology",
    lat: 32.776667,
    lng: 35.023333,
    type: "university"
  },
  {
    name: "University of Haifa",
    lat: 32.794167,
    lng: 34.989167,
    type: "university"
  }
];