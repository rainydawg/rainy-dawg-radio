'use client'
import Link from 'next/link'
import Image from 'next/image'
import { useState } from 'react'

export default function Navbar() {
    const [showSchedule, setShowSchedule] = useState(false)
    return (
        <>
        <nav className="flex justify-between items-center pl-10 pr-10 w-full bg-white pt-5 pb-5">
            <Link href="/">
                <Image src="/logoexpanded.png" height={200} width={200} alt={"Rainy Dawg Radio"}/>
            </Link>
            <div className="flex space-x-14">
                <Link href="/about" className="font-mono hover:text-gray-700 font-bold">About</Link>
                <Link href="/listen" className="font-mono hover:text-gray-700 font-bold">Listen</Link>
                <Link href="/blog" className="font-mono hover:text-gray-700 font-bold">Blog</Link>
                <Link href="/gallery" className="font-mono hover:text-gray-700 font-bold">Gallery</Link>
                <button onClick={() => setShowSchedule(true)} className="font-mono hover:text-gray-700 font-bold">Schedule</button>
            </div>
        </nav>
        {showSchedule && (
            <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50" onClick={() => setShowSchedule(false)}>
                <div className="relative max-w-4xl max-h-screen p-4" onClick={e => e.stopPropagation()}>
                    <button onClick={() => setShowSchedule(false)} className="absolute top-2 right-2 bg-white rounded-full w-8 h-8 flex items-center justify-center font-bold text-black">✕</button>
                    <Image src="/schedule.png" width={900} height={600} alt="Station Schedule" className="object-contain max-h-screen"/>
                </div>
            </div>
        )}
        </>
    )
}
