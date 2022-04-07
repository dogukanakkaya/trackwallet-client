import * as firebaseAdmin from 'firebase-admin';
import { getAuth } from 'firebase-admin/auth';
import fs from 'fs';

const serviceAccount = JSON.parse(fs.readFileSync(`${process.cwd()}/serviceAccountKey.json`).toString());

const config = {
    credential: firebaseAdmin.credential.cert(serviceAccount)
};

export const app = firebaseAdmin.initializeApp(config);

export const auth = getAuth(app);

export const firestore = firebaseAdmin.firestore();