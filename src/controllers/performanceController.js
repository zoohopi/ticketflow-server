const supabase = require('../lib/supabase');

const ALLOWED_FIELDS = ['title', 'venue', 'starts_at', 'price'];
const COLUMNS = 'id, title, venue, starts_at, price';

// 공연 ID: 양의 정수인지 확인
function parseId(value) {
  return /^[1-9]\d*$/.test(String(value)) ? Number(value) : null;
}

// 필드별 값 검증 (문제가 있으면 오류 메시지, 없으면 null 반환)
function validateField(key, value) {
  if (key === 'title' || key === 'venue') {
    if (typeof value !== 'string' || value.trim() === '') {
      return `${key}는 빈 값이 아닌 문자열이어야 합니다.`;
    }
  }
  if (key === 'starts_at') {
    if (typeof value !== 'string' || Number.isNaN(Date.parse(value))) {
      return 'starts_at는 올바른 날짜 형식이어야 합니다.';
    }
  }
  if (key === 'price') {
    if (!Number.isInteger(value) || value < 0) {
      return 'price는 0 이상의 정수여야 합니다.';
    }
  }
  return null;
}

// [과제 1] 공연 목록 조회
async function getPerformances(req, res, next) {
  try {
    const { data, error } = await supabase
      .from('performances')
      .select(COLUMNS)
      .order('id', { ascending: true });

    if (error) throw error;

    return res.json(data || []);
  } catch (error) {
    next(error);
  }
}

// [과제 2] 공연 등록
async function createPerformance(req, res, next) {
  try {
    const { title, venue, starts_at, price } = req.body || {};
    const input = { title, venue, starts_at, price };

    for (const key of ALLOWED_FIELDS) {
      if (input[key] === undefined || input[key] === null) {
        return res.status(400).json({ error: `${key} 값이 필요합니다.` });
      }
      const message = validateField(key, input[key]);
      if (message) return res.status(400).json({ error: message });
    }

    const { data, error } = await supabase
      .from('performances')
      .insert({ title: title.trim(), venue: venue.trim(), starts_at, price })
      .select(COLUMNS)
      .single();

    if (error) throw error;

    return res.status(201).json({
      message: '공연 등록 완료',
      performance: data,
    });
  } catch (error) {
    next(error);
  }
}

// [과제 3] 공연 수정
async function updatePerformance(req, res, next) {
  try {
    const id = parseId(req.params.id);
    if (!id) {
      return res.status(400).json({ error: '공연 ID는 양의 정수여야 합니다.' });
    }

    const body = req.body || {};
    const updates = {};

    // 수정 가능한 컬럼만 골라내기 (id 등은 무시)
    for (const key of ALLOWED_FIELDS) {
      if (body[key] === undefined) continue;
      const message = validateField(key, body[key]);
      if (message) return res.status(400).json({ error: message });
      updates[key] = typeof body[key] === 'string' ? body[key].trim() : body[key];
    }

    if (Object.keys(updates).length === 0) {
      return res.status(400).json({
        error: '수정할 항목(title, venue, starts_at, price)을 입력해 주세요.',
      });
    }

    const { data, error } = await supabase
      .from('performances')
      .update(updates)
      .eq('id', id)
      .select(COLUMNS)
      .maybeSingle();

    if (error) throw error;

    if (!data) {
      return res.status(404).json({ error: '공연을 찾을 수 없습니다.' });
    }

    return res.json({
      message: '공연 수정 완료',
      performance: data,
    });
  } catch (error) {
    next(error);
  }
}

// [과제 4] 공연 삭제
async function deletePerformance(req, res, next) {
  try {
    const id = parseId(req.params.id);
    if (!id) {
      return res.status(400).json({ error: '공연 ID는 양의 정수여야 합니다.' });
    }

    const { data, error } = await supabase
      .from('performances')
      .delete()
      .eq('id', id)
      .select('id')
      .maybeSingle();

    if (error) throw error;

    if (!data) {
      return res.status(404).json({ error: '공연을 찾을 수 없습니다.' });
    }

    return res.json({ message: '공연 삭제 완료' });
  } catch (error) {
    next(error);
  }
}

module.exports = {
  getPerformances,
  createPerformance,
  updatePerformance,
  deletePerformance,
};
