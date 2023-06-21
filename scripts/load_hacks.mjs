import { readFile, readdir } from 'fs/promises'
import { join } from 'path'
import { Fireproof } from '@fireproof/core/src/fireproof.js'

const db = Fireproof.storage('chagpt-hacks', {
  primary: { type: 'rest', url: 'http://localhost:8000/chagpt-hacks-book' }
})

console.log('Current directory:', process.cwd())

const BOOK_ID = 'chagpt-hacks'

readdir(process.cwd())
  .then(async files => {
    console.log('Directory listing:', files)

    // Filter for .asciidoc files
    const asciidocFiles = files.filter(file => file.endsWith('.asciidoc'))

    for (const file of asciidocFiles) {
      try {
        const data = await readFile(file, 'utf8')

        // Split the chapters into 'hacks'
        const hacks = data.split('\n=== ')
        hacks.shift() // Remove the first element as it will be before the first 'Hack Title'

        // Convert each hack into a JSON document
        for (const hack of hacks) {
          const titleEndIndex = hack.indexOf('\n')
          const title = hack.slice(0, titleEndIndex)
          const content = hack.slice(titleEndIndex + 1)

          // Create a JSON document
          const jsonHack = {
            book : BOOK_ID,
            file: file,
            title: title,
            content: content
          }

          // Store the JSON document in Fireproof
          console.log(`Storing ${title}`)
          await db.put(jsonHack)
        }
      } catch (err) {
        console.error(err)
      }
    }
  }).then(() => {
    // upload image files as attachments
    const imagesDir = join(process.cwd(), 'images')
    readdir(imagesDir)
      .then(async files => {
        const pngs = files.filter(file => file.endsWith('.png'))
        for (const png of pngs) {
          const data = await readFile(join(imagesDir, png))
          console.log(`Storing ${png}`, data.length)
          const imgDoc = {
            book : BOOK_ID,
            name: png.split('/').pop(),
            img:  'data:image/png;base64,' + data.toString('base64')
          }
          await db.put(imgDoc)
      }
    })
  })
  .catch(err => console.error('Error reading directory:', err))
