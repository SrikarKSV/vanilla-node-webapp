require('dotenv').config();
const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');
const User = require('../models/User');
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
    confessions.forEach(async (c) => {
      const confession = { ...c };
      confession.createdAt = new Date(
        +new Date() - Math.floor(Math.random() * 1000000000)
      );
      await Confession.create(confession);
    });
    console.log(`Sucessfully inserted ${confessions.length} confessions`);

    const user = {
      username: 'admin',
      password: 'confessions',
      role: 'admin',
    };

    await User.create(user);
    console.log(
      'A user has been created with the crdentials: \n - username: admin \n - password: confessions \n - role: admin'
    );
  })
  .catch((err) =>
    console.log('💥💥 There was an error connecting to DATABASE', err)
  );
