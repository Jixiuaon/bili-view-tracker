export async function onRequestGet({ request }) {
  const url = new URL(request.url);
  const bvid = url.searchParams.get("bvid");

  // 检查 BV 号
  if (!bvid || !/^BV[a-zA-Z0-9]{10}$/.test(bvid)) {
    return Response.json({
      code: -1,
      message: "BV号格式不正确"
    }, { status: 400 });
  }

  try {
    // 请求 B 站视频信息 API
    const apiUrl =
      "https://api.bilibili.com/x/web-interface/view?bvid=" +
      encodeURIComponent(bvid);

    const response = await fetch(apiUrl, {
      headers: {
        "User-Agent": "Mozilla/5.0",
        "Referer": "https://www.bilibili.com/"
      }
    });

    if (!response.ok) {
      return Response.json({
        code: -1,
        message: "B站服务器请求失败"
      }, { status: 502 });
    }

    const data = await response.json();

    return Response.json(data, {
      headers: {
        "Content-Type": "application/json;charset=UTF-8",
        "Cache-Control": "no-store"
      }
    });

  } catch (error) {
    return Response.json({
      code: -1,
      message: "获取数据失败：" + error.message
    }, { status: 500 });
  }
}
