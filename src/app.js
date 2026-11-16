require('dotenv').config();

const express = require('express');
const cors = require('cors');
const performanceRoutes = require('./routes/performanceRoutes');

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

// 기본 서버 확인
app.get('/', (req, res) => {
  res.json({
    message: 'TICKETFLOW 서버 실행 중!',
  });
});

// 공연 API
app.use('/performances', performanceRoutes);

// 공통 에러 처리
app.use((err, req, res, next) => {
  console.error(err);

  let status = err.status || 500;
  let message = err.message || '서버 오류가 발생했습니다.';

  // Supabase에서 전달된 DB 오류 구분
  if (err.code === '23503') {
    status = 409;
    message = '연결된 데이터가 있어 처리할 수 없습니다.';
  } else if (['23502', '23514', '22P02'].includes(err.code)) {
    status = 400;
    message = '입력한 데이터를 확인해 주세요.';
  } else if (err.code === '23505') {
    status = 409;
    message = '이미 존재하는 데이터입니다.';
  } else if (status === 500) {
    message = '서버에서 오류가 발생했습니다.';
  }

  res.status(status).json({ error: message });
});

// 서버 실행
app.listen(PORT, '0.0.0.0', () => {
  console.log(`서버 실행: http://localhost:${PORT}`);
});
