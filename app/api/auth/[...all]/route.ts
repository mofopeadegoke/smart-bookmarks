import { auth } from "@/lib/auth";
import { toNextJsHandler } from "better-auth/next-js";

// The front door: all sign-in and sign-out traffic goes through here
export const { GET, POST } = toNextJsHandler(auth);
