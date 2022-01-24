if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config();
}
const mongoose = require('mongoose');
const app = require('./app');

const DB =
  process.env.NODE_ENV === 'development'
    ? process.env.DATABASE_DEV
    : process.env.DATABASE_PROD;

mongoose
  .connect(DB)
  .then(() => console.log('✅✅ Connected to DATABASE'))
  .catch((err) =>
    console.log('💥💥 There was an error connecting to DATABASE', err)
  );

const PORT = process.env.PORT || 3000;
app.listen(PORT, () =>
  console.log(`✅ Server running on : http://localhost:${PORT}`)
);
