const allowedCors = [
  'https://project-mesto.nomoredomains.club/',
  'http://project-mesto.nomoredomains.club/',
  'localhost:3000',
];

const handlerCors = (req, res, next) => {
  const { origin } = req.headers;
  if (allowedCors.includes(origin)) {
    res.header('Access-Control-Allow-Origin', origin);
  }
  next();
};
module.exports = handlerCors;
