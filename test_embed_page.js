const fs = require('fs');

async function testEmbedPage() {
  const shortcode = "C3x9Q2lO1aX";
  const url = `https://www.instagram.com/p/${shortcode}/embed/captioned/`;

  console.log("Fetching embed page:", url);
  const res = await fetch(url, {
    headers: {
      "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36",
      "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
      "Accept-Language": "en-US,en;q=0.9"
    }
  });

  console.log("Status:", res.status);
  const html = await res.text();
  fs.writeFileSync('embed_sample.html', html);
  console.log("Embed page size:", html.length);

  // Search for videoUrl, displayUrl, video_url, etc.
  const videoMatches = html.match(/https:[\\\/]+[^\s"'\\]+?\.mp4[^\s"'\\]*/gi);
  if (videoMatches) {
    console.log("Found video matches:", videoMatches.length);
    videoMatches.forEach(v => console.log("Video MP4:", v.replace(/\\\/|\\/g, '/')));
  } else {
    console.log("No video matches found in embed page");
  }

  const imgMatches = html.match(/https:[\\\/]+[^\s"'\\]+?\.(jpg|jpeg|webp)[^\s"'\\]*/gi);
  if (imgMatches) {
    console.log("Found image matches:", imgMatches.length);
    imgMatches.slice(0, 3).forEach(v => console.log("Image URL:", v.replace(/\\\/|\\/g, '/')));
  }
}

testEmbedPage();
