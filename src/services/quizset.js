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
  return request.get(`/papers/records/${recordId}`);
}

// 上传某题答题记录
export async function uploadMyAnswer(quizid, record, contributor1, answer1, correctness1) {
  return request.post(`/quizzes/records?quiz_id=${quizid}`, {
    paper_record: record, contributor: contributor1, answer: answer1, correctness: correctness1,
  });
}

// 上传某试卷答卷记录
export async function uploadPaper(contributor, paper) {
  return request.post(`/papers/records?contributor=${contributor}&paper=${paper}`);
}

// 做一个数据持久化
export default {
  questions: [99, 99, 99, 99, 99, 99, 99, 99, 99, 99, 99, 99, 99, 99, 99, 99,
    99, 99, 99, 99, 99, 99, 99, 99, 99, 99, 99, 99, 99, 99, 99, 99, 99, 99, 99,
    99, 99, 99, 99, 99, 99, 99, 99, 99, 99, 99, 99, 99, 99, 99, 99, 99, 99, 99],

};
