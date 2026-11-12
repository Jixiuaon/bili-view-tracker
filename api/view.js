module.exports = async (req, res) => {
  res.setHeader("Cache-Control", "no-store");

  if (req.method !== "GET") {
    return res.status(405).json({
      code: -1,
      message: "只支持 GET 请求"
    });
  }

  const bvid = req.query.bvid;

  if (!bvid || !/^BV[a-zA-Z0-9]{10}$/.test(bvid)) {
    return res.status(400).json({
      code: -1,
      message: "BV号格式不正确"
    });
  }

  try {
    const url =
      "https://api.bilibili.com/x/web-interface/view?bvid=" +
      encodeURIComponent(bvid);

    const response = await fetch(url, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/120 Safari/537.36",
        "Referer": "https://www.bilibili.com/"
      }
    });

    if (!response.ok) {
      return res.status(502).json({
        code: -1,
        message: "B站服务器暂时无法访问"
      });
    }

    const data = await response.json();

    return res.status(200).json(data);

  } catch (error) {
    return res.status(500).json({
      code: -1,
      message: "服务器请求失败：" + error.message
    });
  }
};
