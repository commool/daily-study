const http = require('http');
const fs = require('fs');
const url = require('url');
const qs = require('querystring');

const parseCookie = (cookie = '') => (
  cookie
    .split(';')
    .map(v => v.split('='))
    .map(([k, ...vs]) => [k, vs.join('=')])
    .reduce((obj, [k, v]) => {
      obj[k.trim()] = decodeURIComponent(v);
      return obj;
    } ,{})
);

http.createServer((req, res) => {
  const cookie = parseCookie(req.headers.cookie);
  if ( req.url.startsWith('/login')) {
    const { query } = url.parse(req.url);
    const { name } = qs.parse(query);
    const expires = new Date();
    expires.setMinutes(expires.getMinutes() + 1);

    res.writeHead(302, {
      Location: '/',
      'Set-Cookie': `name=${encodeURIComponent(name)}; Expires=${expires.toGMTString()}; HttpOnly; Path=/`,
    })
    res.end();
  } else if (cookie.name) {
    res.writeHeader(200, { 'Content-Type': 'text/html; charset=utf-8' });
    res.end(`${cookie.name}님 반갑습니다.`);
  } else {
    fs.readFile('server4.html', (err, data) => {
      if (err) throw err;
      res.end(data);
    });
  }

}).listen(8080, _ => console.log('8080 포트 대기 중'));