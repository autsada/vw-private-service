import admin from "firebase-admin"
import {
  initializeApp,
  getApps,
  getApp,
  applicationDefault,
} from "firebase-admin/app"
import { getAuth } from "firebase-admin/auth"
import { getFirestore } from "firebase-admin/firestore"

const {
  FIREBASE_PROJECT_ID,
  FIREBASE_PRIVATE_KEY,
  FIREBASE_CLIENT_EMAIL,
  NODE_ENV,
} = process.env

function initializeFirebaseAdmin() {
  return !getApps().length
    ? initializeApp({
        credential:
          NODE_ENV === "production" || NODE_ENV === "staging"
            ? applicationDefault()
            : admin.credential.cert({
                projectId: FIREBASE_PROJECT_ID,
                privateKey: FIREBASE_PRIVATE_KEY?.replace(/\\n/g, "\n"),
                clientEmail: FIREBASE_CLIENT_EMAIL,
              }),
      })
    : getApp()
}

const firebaseApp = initializeFirebaseAdmin()
export const db = getFirestore(firebaseApp)
export const auth = getAuth(firebaseApp)

// Collections
export const walletsCollection = "wallets"
// export const uploadsCollection = "uploads"
// export const publishesCollection = "publishes"
