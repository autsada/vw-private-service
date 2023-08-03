import { subscribeToMessage } from "./pubsub"
import { updatesCollection } from "../firebase/config"
import { updateDocById, deleteDoc } from "../firebase/helpers"

const { PUBLISH_PROCESSING_SUBSCRIPTION, PUBLISH_DELETION_SUBSCRIPTION } =
  process.env

function listenToPublishProcessing() {
  const onPublishProcessed = async (message: any) => {
    const docId = `${message?.data}`
    // Update the doc in Firestore
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

function main() {
  listenToPublishProcessing()
  listenToPublishDeletion()
}

main()
