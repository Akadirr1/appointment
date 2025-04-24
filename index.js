const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const dotenv = require('dotenv');


dotenv.config();
const app = express();

app.use(cors());
app.use(express.json());

const router = require('./routes/router')
app.use(router);

mongoose.connect('mongodb://127.0.0.1:27017/appointment', {
	useNewUrlParser: true,
	useUnifiedTopology: true
  })
  .then(() => {
	console.log('MongoDB bağlantısı başarılı');
	app.listen(5000, () => {
	  console.log('Sunucu 5000 portunda çalışıyor');
	});
  })
  .catch((err) => {
	console.error('MongoDB bağlantı hatası:', err);
  });