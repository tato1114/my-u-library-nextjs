import { signIn, signOut, useSession } from 'next-auth/react'
import Link from 'next/link'
import React from 'react'

function Header() {
    const { data: session } = useSession()

    return (
        <header className='bg-blue-900 py-10'>
            <nav className='container flex items-center justify-between text-sm font-medium tracking-wider uppercase text-white'>
                <ul className='flex justify-center gap-8 ml-8'>
                    {session?.user &&
                        <>
                            <li>
                                <Link href='/books'>Books</Link>
                            </li>
                            <li>
                                <Link href='/check_outs'>Checkouts</Link>
                            </li>
                        </>
                    }
                    {session?.user?.role == 'librarian' &&
                        <li>
                            <Link href='/users'>Add User</Link>
                        </li>
                    }
                </ul>
                <ul className='flex justify-center gap-8'>
                    {session?.user
                        ? <>
                            <li>
                                <span className='text-white '>{session.user.name}</span>
                            </li>
                            <li>
                                <button className='text-white mr-8 uppercase' onClick={() => signOut()}>Sign out</button>
                            </li>
                        </>
                        : <li>
                            <button className='text-white mr-8 uppercase' onClick={() => signIn()}>Log In</button>
                        </li>
                    }
                </ul>
            </nav>
        </header>

    )
}

export default Header