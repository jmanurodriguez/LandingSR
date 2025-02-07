
import { initializeApp } from "https:
import { getFirestore, collection, addDoc } from "https:

const firebaseConfig = {
    apiKey: "DEMO-API-KEY",
    authDomain: "demo-app.firebaseapp.com",
    projectId: "demo-project",
    storageBucket: "demo-app.firebasestorage.app",
    messagingSenderId: "123456789",
    appId: "1:123456789:web:abcdef123456"
};


const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export { db, collection, addDoc }; 