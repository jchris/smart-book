import Link from 'next/link'
import { useLiveQuery } from 'use-fireproof';

const Sidebar = () => {
  // Define the live query. The query function finds all documents with 'title'.
  // You might need to adjust this based on your actual data structure.
  const topics = useLiveQuery(doc => doc.title);

  return (
    <div className="flex flex-col min-h-screen w-64 bg-gray-800 text-white p-5">
      <header className="w-full text-center py-4 shadow">
        <h1 className="text-2xl font-semibold">Smart Book</h1>
      </header>

      <nav className="flex-grow">
        <ul>
          {topics.map(topic => (
            <li key={topic.id} className="mb-1">
              <Link href={`/sections/${topic.id}`} className="text-white hover:text-gray-300">
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
