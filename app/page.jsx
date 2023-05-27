"use client"
import { useSession } from "next-auth/react"

export default function Home() {
  const { data: session } = useSession()

  return (
    <main className="flex flex-col justify-center items-center h-screen">
      <h1 className="text-3xl font-bold">
        Welcome to My U Library!!
      </h1>
      <p>
        {session
          ?
          session?.user?.role == "user"
            ? "Enjoy all the books available"
            : "You can use it to manage all the books and checkouts"
          : "Please login to the system"
        }
      </p>
    </main >
  )
}
