export default {
  async fetch(request, env) {
    // 1. 處理 CORS 預檢請求 (OPTIONS)
    if (request.method === "OPTIONS") {
      return new Response(null, {
        headers: {
          "Access-Control-Allow-Origin": "*", // 正式上線建議改為你的網域
          "Access-Control-Allow-Methods": "POST, OPTIONS",
          "Access-Control-Allow-Headers": "Content-Type",
        },
      });
    }

    // 2. 構建目標 Google API URL
    const url = new URL(request.url);
    const apiTarget = `https://generativelanguage.googleapis.com${url.pathname}${url.search}`;

    // 3. 複製原始請求並加入 API Key
    const newRequest = new Request(apiTarget, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-goog-api-key": env.GEMINI_API_KEY, // 這裡會讀取我們稍後設定的加密變數
      },
      body: request.body,
    });

    // 4. 發送請求並回傳結果
    const response = await fetch(newRequest);
    const newResponse = new Response(response.body, response);
    
    // 5. 幫回傳結果加上 CORS 標頭，讓前端能讀取
    newResponse.headers.set("Access-Control-Allow-Origin", "*");
    
    return newResponse;
  }
};