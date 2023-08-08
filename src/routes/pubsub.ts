/**
 * The Router for endpoints that will be called by pubsub subscriptions
 */

import express from "express"

import {
  onPublishDeleted,
  onPublishProcessed,
  onNotificationCreated,
} from "../controllers/pubsub"

export const pubsubRouter = express.Router()

pubsubRouter.post("/publish-deleted", onPublishDeleted)
pubsubRouter.post("/publish-processed", onPublishProcessed)
pubsubRouter.post("/notification", onNotificationCreated)
