import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';

const config = {
    apiKey: 'AIzaSyDckJMScU-6GUbDW2Chuot7L-xlxKvUMR8',
    authDomain: 'basic-test-firebase.firebaseapp.com',
    projectId: 'basic-test-firebase',
    storageBucket: 'basic-test-firebase.appspot.com',
    messagingSenderId: '790833568631',
    appId: '1:790833568631:web:cfa1ede316e8e591605f72',
};

export const app = initializeApp(config);

export const auth = getAuth(app);
