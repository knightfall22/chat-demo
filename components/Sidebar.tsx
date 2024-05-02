import { createClient } from '@/lib/supabase/server';
import Image from 'next/image'
import React from 'react'
import Conversation from './Conversation';
import { useUser } from '@/lib/store/user';
import { useGetConversationsList } from '@/hooks/useConversations';
import { toast } from 'sonner';
import { User } from '@supabase/supabase-js';

const Sidebar = async ({user}: {user: User}) => {
    	const supabase = await createClient();

    const {conversations, error} = await useGetConversationsList(user.id)

    if (error) {
      return //Do some error catching
    }

    console.log("this is a",conversations);
    

  return (
    <div className="w-1/4 flex flex-col items-center rounded-md py-5 border-l border-t border-b">

        {conversations.map(conversations => (
            <Conversation conversation={conversations} key={Math.random()*1000000}/>

        ))}
    
  </div>
  )
}

export default Sidebar