import { collection, writeBatch, doc } from 'firebase/firestore';
import { db } from '../firebase';
import { geohashForLocation } from 'geofire-common';

const SAMPLE_IMAGES = [
  'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?ixlib=rb-1.2.1&auto=format&fit=crop&w=1050&q=80',
  'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?ixlib=rb-1.2.1&auto=format&fit=crop&w=1050&q=80',
  'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?ixlib=rb-1.2.1&auto=format&fit=crop&w=1050&q=80',
  'https://images.unsplash.com/photo-1600596542815-2a51382030f6?ixlib=rb-1.2.1&auto=format&fit=crop&w=1050&q=80',
  'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?ixlib=rb-1.2.1&auto=format&fit=crop&w=1050&q=80'
];

const CITIES = {
  Mumbai: { lat: 19.0760, lng: 72.8777, state: 'Maharashtra' },
  Delhi: { lat: 28.7041, lng: 77.1025, state: 'Delhi' },
  Bangalore: { lat: 12.9716, lng: 77.5946, state: 'Karnataka' },
  Chennai: { lat: 13.0827, lng: 80.2707, state: 'Tamil Nadu' },
  Hyderabad: { lat: 17.3850, lng: 78.4867, state: 'Telangana' },
  Pune: { lat: 18.5204, lng: 73.8567, state: 'Maharashtra' },
  Kolkata: { lat: 22.5726, lng: 88.3639, state: 'West Bengal' },
  Jaipur: { lat: 26.9124, lng: 75.7873, state: 'Rajasthan' },
  Ahmedabad: { lat: 23.0225, lng: 72.5714, state: 'Gujarat' },
  Goa: { lat: 15.2993, lng: 74.1240, state: 'Goa' },
};

const getRandomItem = (arr: any[]) => arr[Math.floor(Math.random() * arr.length)];

export const seedDatabase = async () => {
  console.log('Starting Seed...');

  // Create a batch
  const batch = writeBatch(db);

  const properties = [
    // 1. Mumbai Apartment Sale
    {
      title: 'Luxury Sea View Apartment in Bandra',
      description: 'Stunning 3BHK apartment with direct sea view, modern amenities, and prime location.',
      city: 'Mumbai',
      type: 'Apartment',
      status: 'For Sale',
      price: 45000000, // 4.5 Cr
      size: 1800,
      bedrooms: 3,
      bathrooms: 3,
      amenities: ['Pool', 'Gym', 'Parking', 'Security'],
    },
    // 2. Delhi House Rent
    {
      title: 'Spacious Independent Floor in South Delhi',
      description: 'Newly built 4BHK floor near metro station, park facing.',
      city: 'Delhi',
      type: 'House',
      status: 'For Rent',
      price: 85000,
      size: 2500,
      bedrooms: 4,
      bathrooms: 4,
      amenities: ['Parking', 'Park View', 'Lift', 'Power Backup'],
    },
    // 3. Bangalore Villa Sale
    {
      title: 'Modern Villa in Whitefield',
      description: 'Gated community villa with private garden and clubhouse access.',
      city: 'Bangalore',
      type: 'Villa',
      status: 'For Sale',
      price: 25000000, // 2.5 Cr
      size: 3200,
      bedrooms: 4,
      bathrooms: 5,
      amenities: ['Clubhouse', 'Pool', 'Garden', 'Security', 'Gym'],
    },
    // 4. Chennai Commercial Rent
    {
      title: 'Prime Office Space in OMR',
      description: 'Fully furnished office space suitable for IT companies, 50 seats.',
      city: 'Chennai',
      type: 'Commercial',
      status: 'For Rent',
      price: 150000,
      size: 4000,
      bedrooms: 0,
      bathrooms: 2,
      amenities: ['Central AC', 'Parking', 'Cafeteria', 'Security'],
    },
    // 5. Hyderabad PG Rent
    {
      title: 'Luxury PG for Gents in Gachibowli',
      description: 'Single and cleaning sharing rooms with food and maintenance included.',
      city: 'Hyderabad',
      type: 'PG',
      status: 'For Rent',
      price: 12000,
      size: 200,
      bedrooms: 1,
      bathrooms: 1,
      amenities: ['Wifi', 'Food', 'Cleaning', 'Laundry'],
    },
    // 6. Pune Apartment Sale
    {
      title: '2BHK in Hinjewadi Phase 1',
      description: 'Close to IT park, ready to move in, great ROI.',
      city: 'Pune',
      type: 'Apartment',
      status: 'For Sale',
      price: 6500000, // 65 Lakh
      size: 950,
      bedrooms: 2,
      bathrooms: 2,
      amenities: ['Pool', 'Gym', 'Clubhouse'],
    },
    // 7. Kolkata House Sale
    {
      title: 'Traditional House in Salt Lake',
      description: 'Well maintained independent house in a peaceful locality.',
      city: 'Kolkata',
      type: 'House',
      status: 'For Sale',
      price: 18000000, // 1.8 Cr
      size: 2100,
      bedrooms: 4,
      bathrooms: 3,
      amenities: ['Parking', 'Garden', 'Water Storage'],
    },
    // 8. Jaipur Villa Sale
    {
      title: 'Royal Villa near C-Scheme',
      description: 'Heritage style villa with modern interiors.',
      city: 'Jaipur',
      type: 'Villa',
      status: 'For Sale',
      price: 35000000, // 3.5 Cr
      size: 4500,
      bedrooms: 5,
      bathrooms: 6,
      amenities: ['Pool', 'Garden', 'Servant Quarter', 'Parking'],
    },
    // 9. Ahmedabad Commercial Sale
    {
      title: 'Shop on SG Highway',
      description: 'Road facing shop, high footfall area, excellent visibility.',
      city: 'Ahmedabad',
      type: 'Commercial',
      status: 'For Sale',
      price: 12000000, // 1.2 Cr
      size: 600,
      bedrooms: 0,
      bathrooms: 0,
      amenities: ['Parking', 'Security'],
    },
    // 10. Goa Villa Rent
    {
      title: 'Beachside Villa in Anjuna',
      description: 'Walking distance to the beach, private pool, perfect for vacations.',
      city: 'Goa',
      type: 'Villa',
      status: 'For Rent',
      price: 250000, // Per month maybe? Or holiday rental structure. Assuming monthly.
      size: 3000,
      bedrooms: 3,
      bathrooms: 3,
      amenities: ['Pool', 'Beach View', 'Wifi', 'Housekeeping'],
    },
    // 11. Mumbai Apartment Rent
    {
      title: 'Compact 1BHK in Andheri West',
      description: 'Near metro, semi-furnished, ideal for bachelors or couples.',
      city: 'Mumbai',
      type: 'Apartment',
      status: 'For Rent',
      price: 35000,
      size: 450,
      bedrooms: 1,
      bathrooms: 1,
      amenities: ['Lift', 'Security'],
    },
    // 12. Bangalore Plot Sale
    {
      title: 'Residential Plot in North Bangalore',
      description: 'BIAAPA approved plot, near airport road, great investment.',
      city: 'Bangalore',
      type: 'Plot',
      status: 'For Sale',
      price: 4500000,
      size: 1200,
      bedrooms: 0,
      bathrooms: 0,
      amenities: ['Water Connection', 'Electricity', 'Gated Community'],
    },
    // 13. Delhi Commercial Rent
    {
      title: 'Co-working Space in Connaught Place',
      description: 'Premium desk space with high-speed internet and meeting rooms.',
      city: 'Delhi',
      type: 'Commercial',
      status: 'For Rent',
      price: 15000, // per seat
      size: 100, // per seat area approx
      bedrooms: 0,
      bathrooms: 0,
      amenities: ['Wifi', 'Coffee', 'Meeting Rooms'],
    },
    // 14. Pune House Rent
    {
      title: 'Row House in Koregaon Park',
      description: 'Premium row house in posh locality, furnished.',
      city: 'Pune',
      type: 'House',
      status: 'For Rent',
      price: 75000,
      size: 1800,
      bedrooms: 3,
      bathrooms: 3,
      amenities: ['Parking', 'Garden', 'Security'],
    },
    // 15. Hyderabad Apartment Sale
    {
      title: 'High-rise Apartment in Financial District',
      description: '25th floor with city view, brand new construction.',
      city: 'Hyderabad',
      type: 'Apartment',
      status: 'For Sale',
      price: 15000000, // 1.5 Cr
      size: 1650,
      bedrooms: 3,
      bathrooms: 3,
      amenities: ['Pool', 'Gym', 'Sky Deck', 'Clubhouse'],
    },
    // 16. Chennai Villa Sale
    {
      title: 'Luxury Villa in ECR',
      description: 'East Coast Road, sea facing, calm and serene environment.',
      city: 'Chennai',
      type: 'Villa',
      status: 'For Sale',
      price: 55000000, // 5.5 Cr
      size: 5000,
      bedrooms: 5,
      bathrooms: 6,
      amenities: ['Pool', 'Garden', 'Home Theater', 'Gym'],
    },
    // 17. Kolkata Apartment Rent
    {
      title: '2BHK near Park Street',
      description: 'Central location, heritage building, renovated interiors.',
      city: 'Kolkata',
      type: 'Apartment',
      status: 'For Rent',
      price: 25000,
      size: 800,
      bedrooms: 2,
      bathrooms: 1,
      amenities: ['Lift', 'Security'],
    },
    // 18. Jaipur House Rent
    {
      title: 'Independent House in Vaishali Nagar',
      description: 'Double storey house, ample parking, near market.',
      city: 'Jaipur',
      type: 'House',
      status: 'For Rent',
      price: 22000,
      size: 1500,
      bedrooms: 3,
      bathrooms: 2,
      amenities: ['Parking', 'Water Storage'],
    },
    // 19. Ahmedabad Plot Sale
    {
      title: 'Industrial Plot in Sanand',
      description: 'GIDC approved industrial land, wide road access.',
      city: 'Ahmedabad',
      type: 'Plot',
      status: 'For Sale',
      price: 8000000,
      size: 5000,
      bedrooms: 0,
      bathrooms: 0,
      amenities: ['Water', 'Electricity', 'Gas Connection'],
    },
    // 20. Goa Apartment Sale.
    {
      title: 'Studio Apartment in Candolim',
      description: 'Invest in holiday home, high rental yield potential.',
      city: 'Goa',
      type: 'Apartment',
      status: 'For Sale',
      price: 4500000,
      size: 550,
      bedrooms: 1,
      bathrooms: 1,
      amenities: ['Pool', 'Security', 'Furnished'],
    }
  ];

  for (const p of properties) {
    const cityData = CITIES[p.city as keyof typeof CITIES];

    // Add some random variation to lat/lng so they don't stack perfectly
    const lat = cityData.lat + (Math.random() - 0.5) * 0.05;
    const lng = cityData.lng + (Math.random() - 0.5) * 0.05;
    const geohash = geohashForLocation([lat, lng]);

    const docData: any = {
      ownerId: 'SEED_USER_123',
      createdAt: new Date(),
      updatedAt: new Date(),
      basic: {
        title: p.title,
        description: p.description,
        propertyType: p.type,
        saleOrRent: p.status, // Match store filter expectation "For Sale"/"For Rent"
        city: p.city,
        state: cityData.state,
        pincode: '000000', // Dummy
        size: p.size,
        sizeUnit: 'sq. ft.',
        bedrooms: p.bedrooms,
        bathrooms: p.bathrooms,
        lat: lat,
        lng: lng,
        geohash: geohash
      },
      pricing: {
        price: p.price,
        maintenance: 0
      },
      features: {
        amenities: p.amenities,
        furnishing: 'Semi-Furnished'
      },
      media: {
        // Assign random image
        photos: [{ previewUrl: getRandomItem(SAMPLE_IMAGES) }],
        videos: []
      },
      contact: {
        name: 'Demo User',
        email: 'demo@example.com',
        phone: '9876543210',
        contactMethod: 'Phone'
      }
    };

    // Use addDoc directly for auto-ID
    const docRef = doc(collection(db, 'properties'));
    batch.set(docRef, docData);
  }

  try {
    await batch.commit();
    console.log('✅ Successfully seeded 20 properties!');
    // alert('Seeding Complete! 20 Properties Added.');
  } catch (e) {
    console.error('Error seeding data:', e);
    // alert('Error seeding data. Check console.');
  }
};
