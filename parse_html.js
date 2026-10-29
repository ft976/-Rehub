const fs = require('fs');

async function parseInstagramHtml() {
  const url = "https://www.instagram.com/reel/C3x9Q2lO1aX/";
  console.log("Fetching HTML from:", url);

  const res = await fetch(url, {
    headers: {
      "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36",
      "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8",
      "Accept-Language": "en-US,en;q=0.9"
    }
  });

  const html = await res.text();
  fs.writeFileSync('ig_sample.html', html);
  console.log("Saved ig_sample.html. Length:", html.length);

  // Look for og:video, og:image, video_url, display_url
  const ogVideoMatch = html.match(/meta property="og:video"[^>]+content="([^"]+)"/i);
  const ogImageMatch = html.match(/meta property="og:image"[^>]+content="([^"]+)"/i);
  const ogTitleMatch = html.match(/meta property="og:title"[^>]+content="([^"]+)"/i);

  console.log("OG Video:", ogVideoMatch ? ogVideoMatch[1] : "None");
  console.log("OG Image:", ogImageMatch ? ogImageMatch[1] : "None");
  console.log("OG Title:", ogTitleMatch ? ogTitleMatch[1] : "None");

  // Search for .mp4 in scripts
  const mp4Regex = /https:[\\\/]+[^\s"'\\]+?\.mp4[^\s"'\\]*/gi;
  const mp4Matches = html.match(mp4Regex);
  if (mp4Matches) {
    const cleanMp4s = Array.from(new Set(mp4Matches.map(m => m.replace(/\\\/|\\/g, '/'))));
    console.log("\nFound direct MP4 URLs in script data:", cleanMp4s.length);
    cleanMp4s.slice(0, 5).forEach((m, i) => console.log(` [${i+1}]`, m.substring(0, 120) + "..."));
  } else {
    console.log("No direct .mp4 matches in scripts");
  }
}

parseInstagramHtml();
