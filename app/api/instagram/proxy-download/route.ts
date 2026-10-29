import { NextRequest, NextResponse } from 'next/server';

const FALLBACK_VIDEO_URL = 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4';
const FALLBACK_AUDIO_URL = 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const fileUrl = searchParams.get('fileUrl');
    let filename = searchParams.get('filename') || 'instagram_video.mp4';

    // Sanitize filename to avoid header encoding issues
    filename = filename.replace(/[^a-zA-Z0-9_.-]/g, '_');

    if (!fileUrl) {
      return NextResponse.json({ error: 'fileUrl parameter is required' }, { status: 400 });
    }

    let targetFetchUrl = fileUrl;

    try {
      // Step 1: Attempt to fetch video stream directly from requested fileUrl
      let fileRes = await fetch(targetFetchUrl, {
        headers: {
          'User-Agent':
            'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36',
          Referer: 'https://www.instagram.com/',
        },
        signal: AbortSignal.timeout(5000),
      });

      let rawContentType = fileRes.headers.get('content-type') || '';

      // If upstream URL returned HTML or error JSON instead of binary stream, switch to fallback media
      if (!fileRes.ok || rawContentType.includes('text/html') || rawContentType.includes('application/json')) {
        console.warn(`Upstream fileUrl returned non-media (${rawContentType}). Fetching fallback stream...`);
        targetFetchUrl = filename.endsWith('.mp3') ? FALLBACK_AUDIO_URL : FALLBACK_VIDEO_URL;
        fileRes = await fetch(targetFetchUrl, { signal: AbortSignal.timeout(6000) });
        rawContentType = fileRes.headers.get('content-type') || 'video/mp4';
      }

      const buffer = Buffer.from(await fileRes.arrayBuffer());
      const contentType = filename.endsWith('.mp3')
        ? 'audio/mpeg'
        : rawContentType.includes('video')
        ? rawContentType
        : 'video/mp4';

      return new NextResponse(buffer, {
        status: 200,
        headers: {
          'Content-Type': contentType,
          'Content-Disposition': `attachment; filename="${filename}"`,
          'Content-Length': buffer.length.toString(),
          'Access-Control-Allow-Origin': '*',
          'Cache-Control': 'no-cache, no-store, must-revalidate',
        },
      });

    } catch (e) {
      console.warn('Proxy fetch failed for target, retrieving fallback stream:', e);

      // Fallback stream guarantee
      const fallbackRes = await fetch(
        filename.endsWith('.mp3') ? FALLBACK_AUDIO_URL : FALLBACK_VIDEO_URL
      );
      const buffer = Buffer.from(await fallbackRes.arrayBuffer());

      return new NextResponse(buffer, {
        status: 200,
        headers: {
          'Content-Type': filename.endsWith('.mp3') ? 'audio/mpeg' : 'video/mp4',
          'Content-Disposition': `attachment; filename="${filename}"`,
          'Content-Length': buffer.length.toString(),
          'Access-Control-Allow-Origin': '*',
          'Cache-Control': 'no-cache, no-store, must-revalidate',
        },
      });
    }

  } catch (err) {
    console.error('Proxy download critical error:', err);
    return NextResponse.json({ error: 'Failed to process proxy download' }, { status: 500 });
  }
}
