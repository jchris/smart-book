// src/pages/_app.js
import '../globals.css' // adjust the path to your globals.css file

import { useFireproof, FireproofCtx } from 'use-fireproof'
import { Index } from '@fireproof/core'

function MyApp({ Component, pageProps }) {
  const fp = useFireproof(
    'chagpt-hacks-book',
    (database) => {
      // database.defineIndex('images', (doc, emit) => {
      new Index(database, 'images', (doc, emit) => {
        if (doc.img && doc.name && doc.book) {
          emit([doc.book, doc.name])
        }
      })
    },
    async () => {},
    {
      secondary: { type: 'rest', url: 'http://localhost:8000/chagpt-hacks-book', readonly: true }
    }
  )
  return (
    <FireproofCtx.Provider value={fp}>
      <Component {...pageProps} />
    </FireproofCtx.Provider>
  )
}

export default MyApp
