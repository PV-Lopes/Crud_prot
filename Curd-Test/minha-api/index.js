const express = require('express');
const mongoose = require('mongoose');
const authRoutes = require('./routes/auth');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use('/auth', authRoutes);
app.use(express.json());

mongoose.connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
.then(() => console.log('MongoDB Atlas conectado...'))
.catch(err => console.error('Erro ao conectar ao MongoDB Atlas:', err));

app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});


// module.exports = router;


  