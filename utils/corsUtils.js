const allowedCors = [
  'https://project-mesto.nomoredomains.club',
  'http://project-mesto.nomoredomains.club',
  'http://localhost:3000',
  'http://localhost:3001',
];
const corsOptions = {
  origin: 'http://project-mesto.nomoredomains.club',
  optionsSuccessStatus: 200,
};

module.exports = corsOptions;
