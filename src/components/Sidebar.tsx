// Sidebar.tsx
import Link from 'next/link'

const Sidebar = () => {
  return (
    <div className="flex flex-col min-h-screen w-64 bg-gray-800 text-white p-5">
      <header className="w-full text-center py-4 shadow">
        <h1 className="text-2xl font-semibold">Smart Book</h1>
      </header>

      <nav className="flex-grow">
        <ul>
          <li className="mb-1">
            <Link href="/sections/topic1" className="text-white hover:text-gray-300">
              Topic 1
            </Link>
          </li>
          <li className="mb-1">
            <Link href="/sections/topic2" className="text-white hover:text-gray-300">
              Topic 2
            </Link>
          </li>
          <li className="mb-1">
            <Link href="/sections/topic3" className="text-white hover:text-gray-300">
              Topic 3
            </Link>
          </li>
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
