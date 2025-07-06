import { db } from '../config/firebase';
import { collection, doc, setDoc, getDocs } from 'firebase/firestore';

const plans = {
  "free-trial": {
    "id": "free-trial",
    "name": "Free Trial",
    "price": "0.00",
    "period": "7 days",
    "color": "#4caf50",
    "features": [
      "Valid for 7 days",
      "Single zone entry",
      "Standard customer support",
      "Try all basic features"
    ],
    "recommended": false
  },
  "weekly": {
    "id": "weekly",
    "name": "Weekly Pass",
    "price": "3.50",
    "period": "per week",
    "color": "#2196f3",
    "features": [
      "Valid for 7 days",
      "Single zone entry",
      "Standard customer support"
    ],
    "recommended": false
  },
  "monthly": {
    "id": "monthly",
    "name": "Monthly Pass",
    "price": "9.00",
    "period": "per month",
    "color": "#9c27b0",
    "features": [
      "Valid for 30 days",
      "Unlimited zone entries",
      "Priority customer support",
      "Email notifications"
    ],
    "recommended": true
  },
  "yearly": {
    "id": "yearly",
    "name": "Yearly Pass",
    "price": "90.00",
    "period": "per year",
    "color": "#f50057",
    "features": [
      "Valid for 365 days",
      "Unlimited zone entries",
      "Premium customer support",
      "Email notifications"
    ],
    "recommended": false
  }
};

export const migratePlansToFirestore = async () => {
  try {
    // First check if plans collection exists and has data
    const plansCollection = collection(db, 'plans');
    const existingPlans = await getDocs(plansCollection);
    
    if (!existingPlans.empty) {
      console.log('Plans collection already exists with data. Skipping migration.');
      return;
    }

    console.log('Starting plans migration to Firestore...');
    
    // Migrate each plan
    for (const [id, plan] of Object.entries(plans)) {
      try {
        await setDoc(doc(plansCollection, id), plan);
        console.log(`✓ Successfully migrated plan: ${id}`);
      } catch (error) {
        console.error(`✗ Failed to migrate plan ${id}:`, error);
      }
    }
    
    console.log('✓ Successfully completed plans migration to Firestore');
  } catch (error) {
    console.error('✗ Error during plans migration:', error);
    throw error;
  }
};

// Run the migration and handle errors
(async () => {
  try {
    await migratePlansToFirestore();
    process.exit(0);
  } catch (error) {
    console.error('Migration failed:', error);
    process.exit(1);
  }
})(); 