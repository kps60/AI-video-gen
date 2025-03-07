import { Dropbox } from "dropbox";
import fetch from "node-fetch"
export const dbx = new Dropbox({ accessToken: process.env.NEXT_PUBLIC_DROPBOX_API_KEY, fetch });