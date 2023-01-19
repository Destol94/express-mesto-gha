const allowedCors = [
  'https://project-mesto.nomoredomains.club',
  'http://project-mesto.nomoredomains.club',
  'http://localhost:3000',
  'http://localhost:3001',
];
const corsOptions = {
  origin: allowedCors,
  optionsSuccessStatus: 200,
};

module.exports = corsOptions;
