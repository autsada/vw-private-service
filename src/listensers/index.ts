import { subscribeToMessage } from "./pubsub"
import { notificationsCollection, updatesCollection } from "../firebase/config"
import { updateDocById, deleteDoc } from "../firebase/helpers"

const {
  PUBLISH_PROCESSING_SUBSCRIPTION,
  PUBLISH_DELETION_SUBSCRIPTION,
  NEW_NOTIFICATION_SUBSCRIPTION,
} = process.env

function listenToPublishProcessing() {
  const onPublishProcessed = async (message: any) => {
    const docId = `${message?.data}`
    // Update the doc in `updates` collection in Firestore
    await updateDocById({
      collectionName: updatesCollection,
      docId,
      data: {},
    })
  }

  subscribeToMessage(PUBLISH_PROCESSING_SUBSCRIPTION!, onPublishProcessed)
}

function listenToPublishDeletion() {
  const onPublishDeleted = async (message: any) => {
    const docId = `${message?.data}`
    // Delete the doc in Firestore
    await deleteDoc({
      collectionName: updatesCollection,
      docId,
    })
  }

  subscribeToMessage(PUBLISH_DELETION_SUBSCRIPTION!, onPublishDeleted)
}

function listenToNewNotification() {
  const onNewNotification = async (message: any) => {
    const docId = `${message?.data}`
    // Update the doc in `notifications` collection in Firestore
    await updateDocById({
      collectionName: notificationsCollection,
      docId,
      data: {},
    })
  }

  subscribeToMessage(NEW_NOTIFICATION_SUBSCRIPTION!, onNewNotification)
}

function main() {
  listenToPublishProcessing()
  listenToPublishDeletion()
  listenToNewNotification()
}

main()
