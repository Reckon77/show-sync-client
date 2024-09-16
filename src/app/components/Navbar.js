'use client'

import Link from 'next/link'
import { useAuth } from '../contexts/AuthContext'
import { Button } from "@/components/ui/button"
import { Menu } from 'lucide-react'
import { useState } from 'react'

export default function Navbar() {
  const { user, logout } = useAuth()
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen)

  return (
    <nav className="bg-primary text-primary-foreground shadow-lg">
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex justify-between">
          <div className="flex space-x-7">
            <div>
              <Link href="/" className="flex items-center py-4 px-2">
                <span className="font-semibold text-lg">My Auth App</span>
              </Link>
            </div>
          </div>
          <div className="hidden md:flex items-center space-x-3">
            {user ? (
              <>
                <span className="py-2 px-2">Welcome, {user.userName}</span>
                <Button onClick={logout} variant="secondary">Logout</Button>
              </>
            ) : (
              <>
                <Link href="/login" passHref>
                  <Button variant="ghost">Login</Button>
                </Link>
                <Link href="/register" passHref>
                  <Button variant="secondary">Register</Button>
                </Link>
              </>
            )}
          </div>
          <div className="md:hidden flex items-center">
            <Button onClick={toggleMenu} variant="ghost">
              <Menu />
            </Button>
          </div>
        </div>
      </div>
      {isMenuOpen && (
        <div className="md:hidden">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            {user ? (
              <>
                <span className="block px-3 py-2 text-base font-medium">Welcome, {user.userName}</span>
                <Button onClick={logout} variant="secondary" className="w-full text-left">Logout</Button>
              </>
            ) : (
              <>
                <Link href="/login" passHref>
                  <Button variant="ghost" className="w-full text-left">Login</Button>
                </Link>
                <Link href="/register" passHref>
                  <Button variant="secondary" className="w-full text-left">Register</Button>
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  )
}