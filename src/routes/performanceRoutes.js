const express = require('express');
const router = express.Router();

const {
  getPerformances,
  createPerformance,
  updatePerformance,
  deletePerformance,
} = require('../controllers/performanceController');

const requireAdminKey = require('../middleware/requireAdminKey');

// 공연 목록 조회
router.get('/', getPerformances);

// 공연 등록
router.post('/', requireAdminKey, createPerformance);

// 공연 수정
router.patch('/:id', requireAdminKey, updatePerformance);

// 공연 삭제
router.delete('/:id', requireAdminKey, deletePerformance);

module.exports = router;
