const errorHandler = (res, err) => {
  const headers = {
    'Access-Control-Allow-Headers': 'Control-Type, Authorization, Content-Length, X-Requested-With',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'PATCH, POST, GET, OPTIONS, DELETE',
    'Content-Type': 'application/json'
  }

  res.writeHead(400, headers);
  res.write(JSON.stringify({
    'status': 'false',
    'message': '欄位填寫錯誤或無此 ID',
    'error': err
  }));
  res.end()
}

module.exports = errorHandler