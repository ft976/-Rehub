async function testExtract() {
  const shortcode = "C3x9Q2lO1aX";
  const urlsToTest = [
    `https://www.instagram.com/reel/${shortcode}/`,
    `https://www.instagram.com/p/${shortcode}/?__a=1&__d=dis`,
    `https://api.instagram.com/oembed?url=https://www.instagram.com/reel/${shortcode}/`
  ];

  for (const url of urlsToTest) {
    console.log("\n--- Testing URL ---:", url);
    try {
      const res = await fetch(url, {
        headers: {
          "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36",
          "Accept": "*/*",
          "Accept-Language": "en-US,en;q=0.9"
        }
      });
      console.log("Status:", res.status);
      const text = await res.text();
      console.log("Length:", text.length);

      if (url.includes("oembed")) {
        console.log("oEmbed text:", text.substring(0, 300));
      } else if (text.includes("video_url") || text.includes("og:video")) {
        const matches = text.match(/https:\\\/\\\/[^\s"'\\]+?\.mp4[^\s"'\\]*/gi) || text.match(/https:\/\/[^\s"']+\.mp4[^\s"']*/gi);
        console.log("Extracted MP4 links:", matches ? matches.slice(0, 2) : "None");
      }
    } catch (e) {
      console.error("Failed:", e.message);
    }
  }
}

testExtract();
