import { getWordDetails } from '@/services/word';
import request from '../utils/request';

/* 获取词单 */
export async function getWordLists() {
  return request.get('/lists');
}

/**
 * @param id 词单id
 * @returns {Promise<unknown>}
 */
export async function getWordListDetails(id) {
  return request.get(`/lists/${id}`);
}
