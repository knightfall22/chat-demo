import React from "react";
import { Button } from "./ui/button";
import { createClient } from "@/lib/supabase/browser";
import { LIMIT_MESSAGE } from "@/lib/constant";
import { getFromAndTo } from "@/lib/utils";
import { useMessage } from "@/lib/store/messages";
import { toast } from "sonner";
import { loadMore } from "@/hooks/useMessages";

export default function LoadMoreMessages() {
    const page = useMessage((state) => state.page);
    const {setMessages, selectedConversationId, loadMoreMessages} = useMessage();
    const hasMore = useMessage((state) => state.hasMore)
    const loading = useMessage((state) => state.loading);
	const prevMessages = useMessage((state) => state.messages)



	const fetchMore = async () => {
		loadMoreMessages()

		const {messages, error:potentialError, hasMore: newHasMore} = await loadMore(page!, selectedConversationId!)

		if (potentialError){
			return toast.error(potentialError.message)
		}
		setMessages([...messages!, ...prevMessages], newHasMore)
	};

	console.log("if has more", hasMore);
	

    if (hasMore && !loading) {
        return (
            <Button variant="outline" className="w-full" onClick={fetchMore}>
                Load More
            </Button>
        );
    } else if (loading) {
        return <p>Loading...</p>;
    }
    return null;
}
