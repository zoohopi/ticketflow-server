function requireAdminKey(req, res, next) {
  const adminKey = process.env.ADMIN_API_KEY;
  const requestKey = req.get('x-admin-key');

  if (!adminKey) {
    return res.status(503).json({
      error: '관리자 API 키가 설정되지 않았습니다.',
    });
  }

  if (!requestKey || requestKey !== adminKey) {
    return res.status(401).json({
      error: '올바른 API 키가 필요합니다.',
    });
  }

  next();
}

module.exports = requireAdminKey;
