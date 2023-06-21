import Sidebar from './components/Sidebar'
import Chat from './components/Chat'

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex">
      <Sidebar />
      <div className="w-full flex flex-col">
        <div className="p-4 flex-grow">{children}</div>
        <Chat />
      </div>
    </div>
  )
}
