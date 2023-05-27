import { signIn, signOut, useSession } from 'next-auth/react'
import Link from 'next/link'
import React from 'react'

function header() {

    const { data: session } = useSession()

    return (
        <header className='bg-stone-300 py-10'>
            <nav className='container flex items-center text-sm font-medium tracking-wider uppercase text-stone-500'>
                <ul className='ml-auto flex justify-center gap-8'>
                    <li>
                        <Link href='/'>Books</Link>
                    </li>
                    <li>
                        <Link href='/users'>Checkouts</Link>
                    </li>
                </ul>
                <ul className='ml-auto'>
                    <li>
                        {session?.user
                            ? (<>
                                <p className='text-stone-500'>{session.user.name}</p>
                                <button className='text-stone-500 mr-8 uppercase' onClick={() => signOut()}>Sign out</button>
                            </>)
                            : <button className='text-stone-500 mr-8 uppercase' onClick={() => signIn()}>Log In</button>
                        }
                    </li>
                </ul>
            </nav>
        </header>

    )
}

export default header