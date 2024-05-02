"use client"
import React from 'react'
import { Button } from './ui/button'
import { createClient } from '@/lib/supabase/browser'
import { User } from '@supabase/supabase-js'
import { useRouter } from 'next/navigation'
import ChatPresence from './ChatPresence'


const ChatHeader = ({ user }: { user: User | undefined }) => {
  const router = useRouter();
  const handleLoginWithGoogle = () => {
    const supabase = createClient()
    supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: location.origin  + "/auth/callback"
      }
    })
  }
  
  const handleLogout = async () => {
    const supabase = await createClient()
    supabase.auth.signOut()
    router.refresh()
  }
  return (
    <div className="h-20">
    <div className="p-5 border-b flex items-center justify-between h-full">
      <div>
      <h1 className="text-xl font-bold">Daily Chat</h1>

        <div className="flex items-center gap-1">
          <div className='h-4 w-4 bg-green-400 animate-pulse rounded-full'></div>
          <ChatPresence />
        </div>
      </div>
      {user ? (
					<Button onClick={handleLogout}>Logout</Button>
				) : (
					<Button onClick={handleLoginWithGoogle}>Login</Button>
				)}

    </div>
  </div>
  )
}

export default ChatHeader