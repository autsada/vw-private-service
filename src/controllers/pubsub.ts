import type { Request, Response, NextFunction } from "express"

import { notificationsCollection, updatesCollection } from "../firebase/config"
import { deleteDoc, updateDocById } from "../firebase/helpers"

export async function onPublishDeleted(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    if (!req.body) {
      const msg = "no Pub/Sub message received"
      console.error(`error: ${msg}`)
      res.status(400).send(`Bad Request: ${msg}`)
      return
    }
    if (!req.body.message) {
      const msg = "invalid Pub/Sub message format"
      console.error(`error: ${msg}`)
      res.status(400).send(`Bad Request: ${msg}`)
      return
    }

    // Get the publish id from the message
    const pubSubMessage = req.body.message
    const publishId = pubSubMessage.data
      ? Buffer.from(pubSubMessage.data, "base64").toString().trim()
      : undefined

    if (!publishId) {
      const msg = "no data found"
      console.error(`error: ${msg}`)
      res.status(400).send(`Bad Request: ${msg}`)
      return
    }

    // Delete the doc in Firestore
    await deleteDoc({
      collectionName: updatesCollection,
      docId: publishId,
    })

    res.status(204).send()
  } catch (error) {
    next(error)
  }
}

export async function onPublishProcessed(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    if (!req.body) {
      const msg = "no Pub/Sub message received"
      console.error(`error: ${msg}`)
      res.status(400).send(`Bad Request: ${msg}`)
      return
    }
    if (!req.body.message) {
      const msg = "invalid Pub/Sub message format"
      console.error(`error: ${msg}`)
      res.status(400).send(`Bad Request: ${msg}`)
      return
    }

    // Get the publish id from the message
    const pubSubMessage = req.body.message
    const publishId = pubSubMessage.data
      ? Buffer.from(pubSubMessage.data, "base64").toString().trim()
      : undefined

    if (!publishId) {
      const msg = "no data found"
      console.error(`error: ${msg}`)
      res.status(400).send(`Bad Request: ${msg}`)
      return
    }

    // Update the doc in `updates` collection in Firestore
    await updateDocById({
      collectionName: updatesCollection,
      docId: publishId,
      data: {},
    })

    res.status(204).send()
  } catch (error) {
    next(error)
  }
}

export async function onNotificationCreated(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    if (!req.body) {
      const msg = "no Pub/Sub message received"
      console.error(`error: ${msg}`)
      res.status(400).send(`Bad Request: ${msg}`)
      return
    }
    if (!req.body.message) {
      const msg = "invalid Pub/Sub message format"
      console.error(`error: ${msg}`)
      res.status(400).send(`Bad Request: ${msg}`)
      return
    }

    // Get the publish id from the message
    const pubSubMessage = req.body.message
    const docId = pubSubMessage.data
      ? Buffer.from(pubSubMessage.data, "base64").toString().trim()
      : undefined

    if (!docId) {
      const msg = "no data found"
      console.error(`error: ${msg}`)
      res.status(400).send(`Bad Request: ${msg}`)
      return
    }

    // Update the doc in `notifications` collection in Firestore
    await updateDocById({
      collectionName: notificationsCollection,
      docId,
      data: {},
    })

    res.status(204).send()
  } catch (error) {
    next(error)
  }
}
