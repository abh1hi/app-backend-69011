import { collection, addDoc, getDocs } from 'firebase/firestore';
import { db } from '../firebase';
export const seedDatabase = async () => {
    const propertiesCollection = collection(db, 'properties');
    const snapshot = await getDocs(propertiesCollection);
    // Only seed if the collection is empty
    if (snapshot.empty) {
        console.log('Database is empty. Seeding with dummy data...');
        const dummyProperties = [
            // Property 1
            {
                basic: {
                    propertyType: 'Apartment',
                    saleOrRent: 'For Sale',
                    title: 'Stunning Apartment with Ocean View',
                    description: 'A breathtaking apartment with panoramic ocean views, modern amenities, and a prime location.',
                    location: 'Santa Monica',
                    state: 'California',
                    size: 1500,
                    bedrooms: 3,
                    bathrooms: 2,
                    floor: '10',
                    age: '2 years'
                },
                pricing: {
                    price: 1200000,
                    maintenance: '600',
                    deposit: '50000',
                    paymentTerms: 'Flexible'
                },
                features: {
                    furnishing: 'Furnished',
                    parking: 'Available',
                    security: '24/7 Surveillance',
                    amenities: ['Pool', 'Gym', 'Sauna']
                },
                mediaUrls: {
                    photos: ['https://picsum.photos/seed/p1/800/600', 'https://picsum.photos/seed/p2/800/600'],
                    videos: []
                },
                contact: {
                    name: 'Jane Smith',
                    email: 'jane.smith@example.com',
                    phone: '987-654-3210',
                    contactMethod: 'Email'
                },
                legal: {
                    ownershipDocs: 'Clear',
                    registration: 'Done'
                },
                ownerId: 'dummy-owner-1',
                createdAt: new Date()
            },
            // Property 2
            {
                basic: {
                    propertyType: 'House',
                    saleOrRent: 'For Rent',
                    title: 'Cozy Family Home in the Suburbs',
                    description: 'A charming house with a beautiful garden, perfect for a family. Located in a quiet and friendly neighborhood.',
                    location: 'Austin',
                    state: 'Texas',
                    size: 2000,
                    bedrooms: 4,
                    bathrooms: 3,
                    floor: '2',
                    age: '5 years'
                },
                pricing: {
                    price: 3500, // Rent per month
                    maintenance: 'Included',
                    deposit: '3500',
                    paymentTerms: 'Monthly'
                },
                features: {
                    furnishing: 'Semi-Furnished',
                    parking: 'Available',
                    security: 'Neighborhood Watch',
                    amenities: ['Garden', 'Patio']
                },
                mediaUrls: {
                    photos: ['https://picsum.photos/seed/p3/800/600', 'https://picsum.photos/seed/p4/800/600'],
                    videos: []
                },
                contact: {
                    name: 'Robert Johnson',
                    email: 'robert.j@example.com',
                    phone: '555-123-4567',
                    contactMethod: 'Phone'
                },
                legal: {
                    ownershipDocs: 'Verified',
                    registration: 'Complete'
                },
                ownerId: 'dummy-owner-2',
                createdAt: new Date()
            },
            // Property 3
            {
                basic: {
                    propertyType: 'Commercial',
                    saleOrRent: 'For Sale',
                    title: 'Prime Commercial Space in Manhattan',
                    description: 'An excellent opportunity to own a commercial space in one of the busiest streets of Manhattan.',
                    location: 'New York',
                    state: 'New York',
                    size: 3000,
                    bedrooms: 0,
                    bathrooms: 2,
                    floor: '1',
                    age: '10 years'
                },
                pricing: {
                    price: 5000000,
                    maintenance: '1500',
                    deposit: '250000',
                    paymentTerms: 'Negotiable'
                },
                features: {
                    furnishing: 'Unfurnished',
                    parking: 'Not Available',
                    security: 'Alarm System',
                    amenities: []
                },
                mediaUrls: {
                    photos: ['https://picsum.photos/seed/p5/800/600', 'https://picsum.photos/seed/p6/800/600'],
                    videos: []
                },
                contact: {
                    name: 'Michael Williams',
                    email: 'michael.w@example.com',
                    phone: '222-333-4444',
                    contactMethod: 'Email'
                },
                legal: {
                    ownershipDocs: 'Available',
                    registration: 'Pending'
                },
                ownerId: 'dummy-owner-3',
                createdAt: new Date()
            },
            // Property 4
            {
                basic: {
                    propertyType: 'Apartment',
                    saleOrRent: 'For Rent',
                    title: 'Modern Loft in Chicago',
                    description: 'A stylish and modern loft with high ceilings and large windows, offering plenty of natural light.',
                    location: 'Chicago',
                    state: 'Illinois',
                    size: 1000,
                    bedrooms: 1,
                    bathrooms: 1,
                    floor: '5',
                    age: '3 years'
                },
                pricing: {
                    price: 2500, // Rent per month
                    maintenance: '200',
                    deposit: '2500',
                    paymentTerms: 'Monthly'
                },
                features: {
                    furnishing: 'Furnished',
                    parking: 'Available',
                    security: 'Key Card Access',
                    amenities: ['Gym', 'Rooftop Deck']
                },
                mediaUrls: {
                    photos: ['https://picsum.photos/seed/p7/800/600', 'https://picsum.photos/seed/p8/800/600'],
                    videos: []
                },
                contact: {
                    name: 'Sarah Davis',
                    email: 'sarah.d@example.com',
                    phone: '777-888-9999',
                    contactMethod: 'Phone'
                },
                legal: {
                    ownershipDocs: 'Clear',
                    registration: 'Done'
                },
                ownerId: 'dummy-owner-4',
                createdAt: new Date()
            },
            // Property 5
            {
                basic: {
                    propertyType: 'House',
                    saleOrRent: 'For Sale',
                    title: 'Spacious Villa in Miami',
                    description: 'A luxurious villa with a private pool and a large backyard. Perfect for those who love to entertain.',
                    location: 'Miami',
                    state: 'Florida',
                    size: 4000,
                    bedrooms: 5,
                    bathrooms: 5,
                    floor: '2',
                    age: '1 year'
                },
                pricing: {
                    price: 2500000,
                    maintenance: '1000',
                    deposit: '125000',
                    paymentTerms: 'Negotiable'
                },
                features: {
                    furnishing: 'Furnished',
                    parking: 'Available',
                    security: 'Gated Community',
                    amenities: ['Pool', 'Garden', 'Home Theater']
                },
                mediaUrls: {
                    photos: ['https://picsum.photos/seed/p9/800/600', 'https://picsum.photos/seed/p10/800/600'],
                    videos: []
                },
                contact: {
                    name: 'David Martinez',
                    email: 'david.m@example.com',
                    phone: '111-222-3333',
                    contactMethod: 'Email'
                },
                legal: {
                    ownershipDocs: 'Verified',
                    registration: 'Complete'
                },
                ownerId: 'dummy-owner-5',
                createdAt: new Date()
            }
        ];
        for (const property of dummyProperties) {
            await addDoc(propertiesCollection, property);
        }
        console.log('Dummy data seeded successfully!');
    }
    else {
        console.log('Database already contains data. Skipping seed.');
    }
};
