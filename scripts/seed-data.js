import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://ibtqysxchuqcqcafbyzo.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImlidHF5c3hjaHVxY3FjYWZieXpvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTM3MTI2ODksImV4cCI6MjA2OTI4ODY4OX0.51ABZfrIUef9YD2NM6HdMIW4SLoHnifdyUsk2TG7xXc';

const supabase = createClient(supabaseUrl, supabaseKey);

const sampleApartments = [
  {
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
    ]
  },
  {
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
    ]
  },
  {
    title: "Shared Apartment - Room Available",
    description: "Great room in shared apartment with 2 other students. Kitchen and living room shared. Very friendly roommates!",
    price: 1800,
    room_type: "Shared",
    address: "Hadar HaCarmel, Haifa",
    lat: 32.794444,
    lng: 34.989722,
    image_urls: [
      "https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?w=800&h=600&fit=crop"
    ]
  },
  {
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
    ]
  },
  {
    title: "Budget-Friendly Studio",
    description: "Affordable studio perfect for students on a budget. Basic amenities but clean and well-maintained.",
    price: 2000,
    room_type: "Studio",
    address: "Wadi Nisnas, Haifa",
    lat: 32.8125,
    lng: 34.9975,
    image_urls: [
      "https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=800&h=600&fit=crop"
    ]
  }
];

async function seedData() {
  try {
    console.log('🌱 Starting to seed data...');

    // Insert apartments
    const { data: apartments, error: apartmentsError } = await supabase
      .from('apartments')
      .insert(sampleApartments)
      .select();

    if (apartmentsError) {
      console.error('❌ Error inserting apartments:', apartmentsError);
      return;
    }

    console.log(`✅ Successfully inserted ${apartments.length} apartments`);

    // Check if institutions already exist
    const { data: existingInstitutions } = await supabase
      .from('institutions')
      .select('*');

    if (!existingInstitutions || existingInstitutions.length === 0) {
      const sampleInstitutions = [
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

      const { data: institutions, error: institutionsError } = await supabase
        .from('institutions')
        .insert(sampleInstitutions)
        .select();

      if (institutionsError) {
        console.error('❌ Error inserting institutions:', institutionsError);
        return;
      }

      console.log(`✅ Successfully inserted ${institutions.length} institutions`);
    } else {
      console.log('ℹ️ Institutions already exist, skipping...');
    }

    console.log('🎉 Data seeding completed successfully!');
  } catch (error) {
    console.error('❌ Error seeding data:', error);
  }
}

seedData(); 