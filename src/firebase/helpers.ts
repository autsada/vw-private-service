import { firestore } from "firebase-admin"
import axios from "axios"

import { db, auth, walletsCollection } from "./config"
import type { Wallet } from "../types"

const { FIREBASE_API_KEY } = process.env

// Verify Firebase auth id token.
export async function verifyIdToken(token: string) {
  const decodedToken = await auth.verifyIdToken(token)
  if (!decodedToken) return null

  // Get user.
  return auth.getUser(decodedToken.uid)
}

type Args<T = Record<string, any>> = {
  collectionName: string
  docId: string
  data: T
  fieldName: string
  fieldValue: any
}

/**
 * Convert Firestore snapshot to Javascript object.
 * @param snapshot Firestore snapshot
 * @returns doc object
 */
export function snapshotToDoc<T extends Record<string, any>>(
  snapshot: firestore.DocumentSnapshot<firestore.DocumentData>
) {
  const data = snapshot.data() as T & {
    createdAt: firestore.Timestamp
    updatedAt?: firestore.Timestamp
  }

  const createdAt = data?.createdAt ? data.createdAt.toDate().toString() : null
  const updatedAt = data?.updatedAt ? data.updatedAt.toDate().toString() : null

  const doc: T = {
    ...data,
    id: snapshot.id,
    createdAt,
    updatedAt,
  }

  return doc
}

/**
 * Get document by id.
 * @param input.collectionName
 * @param input.docId
 * @returns doc
 */
export async function getDocById<T extends Record<string, any>>({
  collectionName,
  docId,
}: Pick<Args, "collectionName" | "docId">) {
  const snapshot = await db.collection(collectionName).doc(docId).get()

  if (!snapshot.exists) return null

  return snapshotToDoc<T>(snapshot)
}

/**
 * Create a new doc with pre-defined id.
 * @param input.collectionName
 * @param input.docId
 * @param input.data
 * @returns
 */
export function createDocWithId<T extends Record<string, any>>({
  collectionName,
  docId,
  data,
}: Pick<Args<T>, "collectionName" | "docId" | "data">) {
  return db
    .collection(collectionName)
    .doc(docId)
    .set(
      {
        ...data,
        createdAt: new Date(),
      },
      { merge: true }
    )
}

/**
 * Update a doc of the specified id.
 * @param input.collectionName
 * @param input.docId
 * @param input.data
 * @returns
 */
export function updateDocById<T extends Record<string, any>>({
  collectionName,
  docId,
  data,
}: Pick<Args<T>, "collectionName" | "docId" | "data">) {
  return db
    .collection(collectionName)
    .doc(docId)
    .set(
      {
        ...data,
        updatedAt: new Date(),
      },
      { merge: true }
    )
}

// ===== "wallets" collection ===== //
/**
 * Get a doc from "wallets" collection.
 * @param uid {string}
 * @returns encrypted key
 */
export async function getWallet(uid: string) {
  // Get user's wallet from Firestore.
  const wallet = await getDocById<Wallet>({
    collectionName: walletsCollection,
    docId: uid,
  })
  if (!wallet) throw new Error("Forbidden")

  return wallet
}

export async function createIdTokenfromCustomToken(uid: string) {
  try {
    const customToken = await auth.createCustomToken(uid)

    const res = await axios({
      url: `https://www.googleapis.com/identitytoolkit/v3/relyingparty/verifyCustomToken?key=${FIREBASE_API_KEY}`,
      method: "post",
      data: {
        token: customToken,
        returnSecureToken: true,
      },
    })

    const idToken = res.data.idToken

    return idToken
  } catch (e) {
    console.log(e)
  }
}
