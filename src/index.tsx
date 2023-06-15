import Image from 'next/image'

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24 bg-slate-400">
      <div className="flex flex-col items-center justify-center">
        <Image src="/next.svg" alt="Logo" width={200} height={200} />
        <h1 className="text-6xl font-bold text-center">
          Welcome
        </h1>
      </div>
    </main>
  )
}
