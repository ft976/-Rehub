async function testEndpoints() {
  const shortcode = "C3x9Q2lO1aX";
  
  const endpoints = [
    `https://www.instagram.com/graphql/query/?query_hash=b3012135a39f6788200584c6b9b7583d&variables=${encodeURIComponent(JSON.stringify({ shortcode }))}`,
    `https://www.instagram.com/graphql/query/?query_hash=2b0673e0dc4580674a88d426fe00ea90&variables=${encodeURIComponent(JSON.stringify({ shortcode }))}`,
    `https://v3.savefrom.net/api/convert?url=https://www.instagram.com/reel/${shortcode}/`
  ];

  for (const ep of endpoints) {
    console.log("\nTesting endpoint:", ep.substring(0, 80));
    try {
      const res = await fetch(ep, {
        headers: {
          "User-Agent": "Mozilla/5.0 (iPhone; CPU iPhone OS 16_6 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/16.6 Mobile/15E148 Safari/604.1",
          "Accept": "application/json, text/plain, */*",
          "X-IG-App-ID": "936619743392459"
        }
      });
      console.log("Status:", res.status);
      const data = await res.json();
      console.log("Response keys:", Object.keys(data));
      if (data.data?.shortcode_media) {
        console.log("SUCCESS! Video URL:", data.data.shortcode_media.video_url);
        console.log("Display URL:", data.data.shortcode_media.display_url);
      } else if (data.url && data.url[0]) {
        console.log("SaveFrom SUCCESS! Video URL:", data.url[0].url);
      }
    } catch (e) {
      console.error("Failed:", e.message);
    }
  }
}

testEndpoints();
