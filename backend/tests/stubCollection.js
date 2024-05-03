import StubCollections from 'meteor/hwillson:stub-collections'

export const stubCollection = (collection) => {
  StubCollections.stub(Array.isArray(collection)
  ? collection
  : [collection])
}

export const restoreCollections = () => StubCollections.restore()
