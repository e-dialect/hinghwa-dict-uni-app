import request from '@/utils/request';

// 获取所有试卷
export async function getAllPapers() {
  return request.get('/papers');
}

// 获取特定试卷
export async function getPaperDetail(id) {
  return request.get(`/papers/${id}`);
}

// 获取用户自己所有的答题记录
export async function getAllRecords(id) {
  return request.get(`/papers/records?user_id=${id}`);
}

// 获取用户特定的答题记录
export async function getRecord(recordId) {
  return request.get(`/paper/records/${recordId}`);
}
