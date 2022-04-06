import { initializeApp } from 'firebase-admin';
import { cert } from 'firebase-admin/app';
import { getAuth } from 'firebase-admin/auth';
import { readFileSync } from 'fs';

const serviceAccount = JSON.parse(readFileSync(`${process.cwd()}/serviceAccountKey.json`).toString());

const config = {
    credential: cert(serviceAccount)
};

export const app = initializeApp(config);

export const auth = getAuth(app);