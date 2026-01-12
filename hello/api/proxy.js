export default async function handler(req, res) {
    // 解决跨域限制
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    // 从请求中提取要访问的路径 (例如 /api/sms/getPhone)
    const { path } = req.query;
    if (!path) {
        return res.status(400).json({ error: "缺少 path 参数" });
    }

    // 构造目标接码平台的完整 URL
    const targetUrl = new URL(`http://api.ee2026.com${path}`);
    
    // 转发所有查询参数 (token, pid, order_id 等)
    Object.keys(req.query).forEach(key => {
        if (key !== 'path') {
            targetUrl.searchParams.append(key, req.query[key]);
        }
    });

    try {
        const response = await fetch(targetUrl.toString());
        const data = await response.json();
        res.status(200).json(data);
    } catch (error) {
        res.status(500).json({ error: "代理请求失败", message: error.message });
    }
}
