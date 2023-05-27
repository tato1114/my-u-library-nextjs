import { signIn, signOut, useSession } from 'next-auth/react'
import Link from 'next/link'
import React from 'react'

function Header() {
    const { data: session } = useSession()

    return (
        <header className='bg-stone-300 py-10'>
            <nav className='container flex items-center justify-between text-sm font-medium tracking-wider uppercase text-stone-500'>
                <ul className='flex justify-center gap-8 ml-8'>
                    {session?.user
                        ? <>
                            <li>
                                <Link href='/books'>Books</Link>
                            </li>
                            <li>
                                <Link href='/users'>Checkouts</Link>
                            </li>
                        </>
                        : <></>
                    }
                </ul>
                <ul className='flex justify-center gap-8'>
                    {session?.user
                        ? <>
                            <li>
                                <span className='text-stone-500 '>{session.user.name}</span>
                            </li>
                            <li>
                                <button className='text-stone-500 mr-8 uppercase' onClick={() => signOut()}>Sign out</button>
                            </li>
                        </>
                        : <li>
                            <button className='text-stone-500 mr-8 uppercase' onClick={() => signIn()}>Log In</button>
                        </li>
                    }
                </ul>
            </nav>
        </header>

    )
}

export default Header