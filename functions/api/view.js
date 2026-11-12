export async function onRequestGet({ request }) {
  const url = new URL(request.url);
  const bvid = url.searchParams.get("bvid");

  if (!bvid || !/^BV[a-zA-Z0-9]{10}$/.test(bvid)) {
    return Response.json({
      code: -1,
      message: "BV号格式不正确"
    }, { status: 400 });
  }

  try {
    const apiUrl =
      "https://api.bilibili.com/x/web-interface/view?bvid=" +
      encodeURIComponent(bvid);

    const response = await fetch(apiUrl, {
      headers: {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/120 Safari/537.36",
        "Referer": "https://www.bilibili.com/",
        "Accept": "application/json"
      }
    });

    const body = await response.text();

    // 返回 B 站实际 HTTP 错误信息
    if (!response.ok) {
      return Response.json({
        code: -1,
        message: "B站接口返回 HTTP 错误",
        upstreamStatus: response.status,
        upstreamBody: body.slice(0, 1000)
      }, { status: 502 });
    }

    let data;

    try {
      data = JSON.parse(body);
    } catch {
      return Response.json({
        code: -1,
        message: "B站返回的不是有效 JSON",
        upstreamBody: body.slice(0, 1000)
      }, { status: 502 });
    }

    return Response.json(data, {
      headers: {
        "Cache-Control": "no-store"
      }
    });

  } catch (error) {
    return Response.json({
      code: -1,
      message: "请求异常：" + error.message
    }, { status: 500 });
  }
}
