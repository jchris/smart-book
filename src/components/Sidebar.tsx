import Link from 'next/link'
import { useContext } from 'react'
import { FireproofCtx } from 'use-fireproof'

const Sidebar = () => {
  const { database, useLiveQuery } = useContext(FireproofCtx)

  // Define the live query. The query function finds all documents with 'title'.
  // @ts-ignore
  const topics = useLiveQuery(doc => [doc.file, doc.title]).docs

  // @ts-ignore
  if (typeof window !== 'undefined') {
    // @ts-ignore
    window.db = database
  }

  return (
    <div className="flex flex-col min-h-screen w-64 p-5">
      <header className="w-full text-center py-4 shadow">
        <h1 className="text-2xl font-semibold">Smart Book</h1>
      </header>

      <nav className="flex-grow">
        <ul>
          {topics.map((topic: { _id: string; title: string }) => (
            <li key={topic._id} className="mb-1">
              <Link href={`/topics/${topic._id}`} className="hover:text-orange-400">
                {topic.title}
              </Link>
            </li>
          ))}
        </ul>
      </nav>

      <div className="flex justify-center items-center">
        <span role="img" aria-label="fire" className="text-4xl">
          🔥
        </span>
      </div>
    </div>
  )
}

export default Sidebar
