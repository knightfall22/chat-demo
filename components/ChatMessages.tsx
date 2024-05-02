

import React, { Suspense } from "react";
import ListMessages from "./ListMessages";
import InitMessages from "@/lib/store/InitMessages";
import { LIMIT_MESSAGE } from "@/lib/constant";
import { createClient } from "@/lib/supabase/server";


export default async function ChatMessages() {
	const supabase = await  createClient();
    

	return (
		<Suspense fallback={"loading.."}>
			<ListMessages />
			{/* <InitMessages messages={data?.reverse() || []} /> */}
		</Suspense>
	);
}