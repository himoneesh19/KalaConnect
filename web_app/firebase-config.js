// Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyDtqbMxryn36YivT9UGwfL0n5eKp0cMmkM",
    authDomain: "genai-9bcd4.web.app",
    projectId: "genai-9bcd4",
    storageBucket: "genai-9bcd4.firebasestorage.app",
    messagingSenderId: "427413800157",
    appId: "1:427413800157:web:ba2c08d235a12d5a9f0734",
    measurementId: "G-GTNH1VEHP4"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);

// Initialize Firebase services
const auth = firebase.auth();
const db = firebase.firestore();
const storage = firebase.storage();

// Export for use in other modules
window.firebaseConfig = firebaseConfig;
