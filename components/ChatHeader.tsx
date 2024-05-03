"use client"
import React from 'react'
import { Button } from './ui/button'
import { createClient } from '@/lib/supabase/browser'
import { User } from '@supabase/supabase-js'
import { useRouter } from 'next/navigation'
import ChatPresence from './ChatPresence'
import UsersList from './UsersList'
import { useUser } from '@/lib/store/user'


const ChatHeader = ({ user, list }: { user: User | undefined, list: User[] }) => {
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
      <div className='flex items-center gap-9'>
      <UsersList list={list}/>
      {user ? (
					<Button onClick={handleLogout}>Logout</Button>
				) : (
					<Button onClick={handleLoginWithGoogle}>Login</Button>
				)}
      </div>

    </div>
  </div>
  )
}

export default ChatHeader