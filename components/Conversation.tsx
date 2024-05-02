"use client"

import { Conversations, createConversation } from '@/hooks/useConversations';
import { fetchMessages } from '@/hooks/useMessages';
import { useConversation } from '@/lib/store/conversation';
import { useMessage } from '@/lib/store/messages';
import { useUser } from '@/lib/store/user';
import { createClient } from '@/lib/supabase/browser';
import { User } from '@supabase/supabase-js';
import Image from 'next/image';
import React from 'react';
import { toast } from 'sonner';

const Conversation = ({ conversation }: { conversation: Conversations }) => {
    console.log(conversation);
    
    const currentUser = useUser(state => state.user);
    const { setMessages, loadMoreMessages, setSelectedConversationId, setLoading } = useMessage();
    {/*@ts-ignore */}
    const { setConversation } = useConversation();

    const handleConversationClick = async () => {
        setSelectedConversationId(conversation.id);
        setConversation([conversation]);
        setLoading(true);

        const { messages: result, error, hasMore } = await fetchMessages(conversation.id);

        if (error) {
            setLoading(false);
            return toast.error(error.message);
        }

        setMessages(result as any, hasMore);
        setLoading(false);
    };

    return (
        <div className='flex gap-2 items-center w-full p-2 px-6 border-b-2 border-t-2'>
            <Image src={conversation.participants.avatar_url} alt="Profile" className="rounded-full w-10 h-10 mr-2" width={40} height={40} />
            <div onClick={handleConversationClick} className='cursor-pointer'>
                <a className="text-purple-500 hover:underline text-sm">{conversation.participants.full_name}</a>
            </div>
        </div>
    );
};

export default Conversation;
