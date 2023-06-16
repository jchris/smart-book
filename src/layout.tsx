import Sidebar from './components/Sidebar'

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex">
      <Sidebar />
      <div className="w-full flex flex-col">
        <div className="p-4 flex-grow">{children}</div>
        <div className="bottom-0 w-full p-4">
          <p>Chat example text</p>
        </div>
      </div>
    </div>
  )
}
