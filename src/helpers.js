import { VectorStorage } from 'vector-storage'

export function withVectorSearch (database, mapFn, vectorOptions = {}) {
  // Create an instance of VectorStorage
  const vectorStore = new VectorStorage(vectorOptions)

  let clock = null
  const search = async (query, options = {}) => {
    const queryObj = { query }
    if (options.limit) {
      queryObj.k = options.limit
    }
    const changes = await database.changesSince(clock)
    clock = changes.clock
    if (changes.rows.length > 0) {
      const entries = vectorEntriesForChanges(changes.rows, mapFn)
      await vectorStore.addTexts(
        entries.map(e => e.text),
        entries.map(e => ({ id: e._id }))
      )
    }
    const result = await vectorStore.similaritySearch(queryObj, options)
    return await Promise.all(
      result.similarItems.map(async item => {
        const doc = await database.get(item.metadata.id)
        return { doc, score: item.score }
      })
    )
  }
  return { search }
}
const makeDoc = ({ key, value }) => ({ _id: key, ...value })

const vectorEntriesForChanges = (changes, mapFn) => {
  const vectorEntries = []
  changes.forEach(({ key: _id, value, del }) => {
    // key is _id, value is the document
    if (del || !value) return
    let mapCalled = false
    const mapReturn = mapFn(makeDoc({ key: _id, value }), text => {
      mapCalled = true
      if (typeof k === 'undefined') return
      vectorEntries.push({
        text,
        _id
      })
    })
    if (!mapCalled && mapReturn) {
      vectorEntries.push({
        text: mapReturn,
        _id
      })
    }
  })
  return vectorEntries
}