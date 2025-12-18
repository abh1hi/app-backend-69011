import { doc, setDoc } from 'firebase/firestore';
import { db } from '../firebase';

export const PROPERTY_TYPES = [
    'Apartment',
    'House',
    'Villa',
    'Plot',
    'Commercial',
    'Agricultural Land',
    'Farmhouse',
    'PG for Boys',
    'PG for Girls',
    'PG Co-ed',
    'Studio Apartment',
    'Builder Floor',
    'Penthouse',
    'Office Space',
    'Shop/Showroom',
    'Warehouse',
    'Industrial Shed',
    'Co-working Space'
];

export const MEASUREMENT_UNITS = [
    'sq. ft.',
    'sq. yards',
    'sq. meters',
    'acres',
    'bigha',
    'hectares',
    'marla',
    'kanal',
    'biswa',
    'ground',
    'cent',
    'guntha',
    'chatak',
    'katha'
];

export const seedPropertyConfig = async () => {
    console.log('[Seeding] Starting property config seed...');
    const configRef = doc(db, 'app_config', 'property_options');

    try {
        const data = {
            types: PROPERTY_TYPES,
            units: MEASUREMENT_UNITS,
            lastUpdated: new Date()
        };

        // If force is true, we overwrite. 
        // If force is false, the caller usually checks existence first, but setDoc with merge:true is safe too if we want to ensure latest options.
        // Here we use setDoc (overwrite/create) to ensure the DB reflects these code constants.

        await setDoc(configRef, data, { merge: true });
        console.log('[Seeding] Property config seeded successfully.');
        return data;
    } catch (error) {
        console.error('[Seeding] Error seeding property config:', error);
        throw error;
    }
};
