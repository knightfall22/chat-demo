import { createClient } from "@/lib/supabase/browser";
import { User } from "@supabase/supabase-js";
import { useEffect, useState } from "react";

const LIMIT_MESSAGE = 25;

//Works on the client
export const fetchMessages = async (conversationId: string) => {
  const supabase = createClient();

  const { data, error } = await supabase
    .from("messages")
    .select("*,users(*)")
    .eq("conversation", conversationId)
    .range(0, LIMIT_MESSAGE)
    .order("created_at", { ascending: false });

  const hasMore = data ? data.length >= LIMIT_MESSAGE : false;

  console.log(data?.length);

  return { messages: data, error, hasMore };
};

export const publishMessage = async (conversationId: string, text: string) => {
  console.log(conversationId, text);

  const supabase = createClient();
  const { error } = await supabase
    .from("messages")
    .insert({ text, conversation: conversationId });

  return error;
};

export const updateMessage = async (messageId: string, text: string) => {
  const supabase = createClient();
  const { error } = await supabase
    .from("messages")
    .update({ text, is_edit: true })
    .eq("id", messageId);

  return error;
};

export const deleteMessage = async (messageId: string) => {
  const supabase = createClient();
  const { error } = await supabase
    .from("messages")
    .delete()
    .eq("id", messageId!);

  return error;
};

export function useChatPresence(user: User) {
  const supabase = createClient();
  const [onlineUsers, setOnlineUsers] = useState(0);

  useEffect(() => {
    const channel = supabase.channel("room1");

    channel
      .on("presence", { event: "sync" }, () => {
        const userIds = [];
        for (const id in channel.presenceState()) {
          // @ts-ignore
          userIds.push(channel.presenceState()[id][0].user_id);
        }
        setOnlineUsers([...new Set(userIds)].length);
      })
      .subscribe(async (status) => {
        if (status === "SUBSCRIBED") {
          await channel.track({
            online_at: new Date().toISOString(),
            user_id: user?.id,
          });
        }
      });

    return () => {
      channel.unsubscribe();
    };
  }, [user]);

  return onlineUsers;
}

export const loadMore = async (page: number, conversationId: string) => {
  const { from, to } = getFromAndTo(page, LIMIT_MESSAGE);

  const supabase = createClient();

  const { data, error } = await supabase
    .from("messages")
    .select("*,users(*)")
    .eq("conversation", conversationId)
    .range(from, to)
    .order("created_at", { ascending: false });

  const hasMore = data ? data.length >= LIMIT_MESSAGE : false;

  return { messages: data?.reverse(), error, hasMore };
};

export function getFromAndTo(page: number, itemPerPage: number) {
  let from = page * itemPerPage;
  let to = from + itemPerPage;

  if (page > 0) {
    from += 1;
  }
  return { from, to };
}
