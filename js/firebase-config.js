// Firebase configuration - تم التحديث بمعلومات مشروعك
const firebaseConfig = {
    apiKey: "AIzaSyAYWo0djZQnxnjhouNmuI1cP_ZroRPJJ8c",
    authDomain: "wacelsoft.firebaseapp.com",
    projectId: "wacelsoft",
    storageBucket: "wacelsoft.firebasestorage.app",
    messagingSenderId: "1050154579007",
    appId: "1:1050154579007:web:9735db78fb564093cef48a"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);

// Initialize Firebase services
const db = firebase.firestore();
const auth = firebase.auth();
