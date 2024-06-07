const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json()); // bodyParser 대신 express.json() 사용

// MongoDB 연결
mongoose.connect('mongodb://127.0.0.1:27017/anonboard', { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => {
        console.log('Connected to MongoDB');
    })
    .catch((err) => {
        console.error('Failed to connect to MongoDB', err);
    });

// 라우터 설정
const postRoutes = require('./routes/post');
const commentRoutes = require('./routes/comment');
const userRoutes = require('./routes/user');

app.use('/api/posts', postRoutes);
app.use('/api/comments', commentRoutes);
app.use('/api/users', userRoutes);

// 서버 실행
const port = 5000;
app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
