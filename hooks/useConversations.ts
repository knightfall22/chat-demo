import { createClient } from "@/lib/supabase/server";
import { createClient as CreateBrowser } from "@/lib/supabase/browser";
import { User, PostgrestError } from "@supabase/supabase-js";

export interface Conversations {
  id: string;
  created_at: string;
  composite_key: string;
  participants: {
    id: string;
    full_name: string;
    avatar_url: string;
    created_at: string;
  };
}

export interface DBConversation {
  id: string;
  created_at: string;
  composite_key: string;
  participants1_id: string;
  participants2_id: string;
}

export const useGetConversationsList = async (userId: string) => {
  const supabase = await createClient();
  const { data: conversations, error } = await supabase
    .from("conversations")
    .select("*,participant1_id(*),participant2_id(*)")
    .or(`participant1_id.eq.${userId},participant2_id.eq.${userId}`);

  if (error) {
    return { conversations: null, error };
  }

  const filtered = conversations.map((conversation) => {
    if (conversation.participant1_id.id === userId) {
      conversation.participants = conversation.participant2_id;
      delete conversation.participant1_id;
      delete conversation.participant2_id;
    } else if (conversation.participant2_id.id === userId) {
      conversation.participants = conversation.participant1_id;
      delete conversation.participant1_id;
      delete conversation.participant2_id;
    }
    return conversation;
  });

  return { conversations: filtered as Conversations[], error: null };
};

export const createConversation = async (
  currentUserId: string,
  otherUserId: string
) => {
  const supabase = CreateBrowser();
  const compositeKey = generateCompositeKey(otherUserId, currentUserId);

  try {
    // Check if a conversation already exists between the two participants
    const { data: existingConversations, error } = await supabase
      .from("conversations")
      .select("*")
      .eq("composite_key", compositeKey);

    if (existingConversations && existingConversations.length > 0) {
      return {
        conversation: existingConversations[0] as DBConversation,
        error,
      };
    }

    // Create a new conversation
    const { data: newConversation, error: insertError } = await supabase
      .from("conversations")
      .insert({
        participant1_id: currentUserId,
        participant2_id: otherUserId,
        composite_key: compositeKey,
      })
      .select();

    return {
      conversation: newConversation
        ? (newConversation[0] as DBConversation)
        : null,
      insertError,
    };
  } catch (error) {
    return { conversation: null, error };
  }
};

function generateCompositeKey(uuid1: string, uuid2: string): string {
  // Ensure consistent order by comparing UUIDs
  const [smallerUuid, largerUuid] =
    uuid1 < uuid2 ? [uuid1, uuid2] : [uuid2, uuid1];

  // Concatenate UUIDs with a separator
  const compositeKey = `${smallerUuid}-${largerUuid}`;

  return compositeKey;
}

console.log(
  "this is a key",
  generateCompositeKey(
    "cac53759-2042-4bf1-98c9-8815859dfaf8",
    "52c5a976-902e-4d4e-a847-44490d024f12"
  )
);
