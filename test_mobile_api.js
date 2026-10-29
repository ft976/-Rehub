async function testMobileApi() {
  const shortcode = "C3x9Q2lO1aX";
  const url = `https://www.instagram.com/api/v1/media/by/shortcode/${shortcode}`;
  
  console.log("Testing Mobile API:", url);
  try {
    const res = await fetch(url, {
      headers: {
        "User-Agent": "Instagram 219.0.0.12.117 Android (29/10; 480dpi; 1080x2280; Xiaomi; Redmi Note 8 Pro; begonia; qcom; en_US; 341880922)",
        "X-IG-App-ID": "936619743392459",
        "Accept": "*/*"
      }
    });
    console.log("Status:", res.status);
    const text = await res.text();
    console.log("Response text start:", text.substring(0, 400));
    
    if (res.ok) {
      const data = JSON.parse(text);
      if (data.items && data.items[0]) {
        const item = data.items[0];
        console.log("\nFOUND MEDIA!");
        console.log("Caption:", item.caption?.text?.substring(0, 100));
        console.log("User:", item.user?.username);
        console.log("Video Versions:", item.video_versions);
      }
    }
  } catch (e) {
    console.error("Failed:", e.message);
  }
}

testMobileApi();
