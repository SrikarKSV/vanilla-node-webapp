const parse = require('co-body');
const Confession = require('../models/Confession');

exports.createConfession = async (req, res) => {
  const { title, confession } = await parse.form(req);
  const createdConfession = await Confession.create({ title, confession });
  console.log(createdConfession);
  res.writeHead(302, {
    location: 'http://localhost:3000/',
  });
  res.end();
};
