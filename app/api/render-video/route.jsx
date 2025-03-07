// pages/api/ensure-browser.js
import { ensureBrowser } from '@remotion/renderer';
import { NextResponse } from 'next/server';

export default async function handler(req, res) {
  try {
    // Start the download and log progress on the server
    await ensureBrowser({
      onBrowserDownload: ({ percent, downloadedBytes, totalSizeInBytes }) => {
        console.log(`${Math.round(percent * 100)}% downloaded`);
        // Here you could consider sending progress updates via websockets or SSE if needed.
      },
    });
    NextResponse.status(200).json({ message: 'Browser downloaded successfully' });
  } catch (error) {
    console.error('Error downloading browser:', error);
    NextResponse.status(500).json({ error: 'Failed to download browser' });
  }
}
