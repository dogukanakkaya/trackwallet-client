import { getFirestore } from 'firebase-admin/firestore'
import { initializeApp, cert } from 'firebase-admin/app';
import { getAuth } from 'firebase-admin/auth';
import fs from 'fs';

const serviceAccount = JSON.parse(fs.readFileSync(`${process.cwd()}/serviceAccountKey.json`).toString());

const config = {
    credential: cert(serviceAccount)
};

export const app = initializeApp(config);

export const auth = getAuth(app);

export const firestore = getFirestore(app);