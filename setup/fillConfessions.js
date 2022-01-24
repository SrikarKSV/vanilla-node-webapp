require('dotenv').config();
const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');
const Confession = require('../models/Confession');

const demoConfession = JSON.parse(
  fs.readFileSync(path.join(__dirname, 'demoCofessions.json'), 'utf-8')
);

const DB =
  process.env.NODE_ENV === 'development'
    ? process.env.DATABASE_DEV
    : process.env.DATABASE_PROD;

mongoose
  .connect(DB)
  .then(async () => {
    console.log('✅✅ Connected to DATABASE');
    const confessions = demoConfession.data;
    confessions.forEach((confession) => Confession.create(confession));
    console.log(`Sucessfully inserted ${confessions.length} confessions`);
  })
  .catch((err) =>
    console.log('💥💥 There was an error connecting to DATABASE', err)
  );
