import request from "@/utils/request";

/**
 * AT0104 获取文章信息
 * @param id 文章id
 * @returns {Promise<unknown>}
 */
export async function getArticle(id) {
  return request.get(`/articles/${id}`)
}

/**
 * AT0201 获取全部文章的id数组
 * @returns {Promise<unknown>}
 */
export async function getArticles() {
  return request.get(`/articles`)
}

/**
 * AT0202 获取全部文章信息
 * @param id 文章id数组
 * @returns {Promise<unknown>}
 */
export async function getAllArticles(id) {
  return request.put(`/articles`, {articles: id})
}

/**
 * AT0301 点赞文章
 * @param id 文章id
 * @returns {Promise<unknown>}
 */
export async function likeArticle(id) {
  return request.post(`/articles/${id}/like`)
}

/**
 * AT0302 取消点赞文章
 * @param id 文章id
 * @returns {Promise<*>}
 */
export async function unlikeArticle(id) {
  return request.del(`/articles/${id}/like`)
}

/**
 * AT0401 发表文章评论
 * @param id 文章id
 * @param comment 评论内容
 * @param replyId 回复评论id
 * @returns {Promise<unknown>}
 */
export async function createComment(id, comment, replyId) {
  return request.post(`/articles/${id}/comments`, {content: comment, parent: replyId})
}

/**
 * AT0404 获取文章评论
 * @param id 文章id
 * @returns {Promise<{comments: *, map: *[]}>}
 */
export async function getComments(id) {
  const res    = await request.get(`/articles/${id}/comments`)
  let comments = res.comments;
  let map      = []; // 获取根评论

  for (let i = 0; i < comments.length; i++) {
    comments[i].kids    = [];
    map[comments[i].id] = i;
  }

  // 获取子孙评论
  for (let i = 0; i < comments.length; i++) {
    if (comments[i].parent !== 0) {
      let p = comments[i].parent;

      while (comments[map[p]].parent) {
        p = comments[map[p]].parent;
      }

      comments[map[p]].kids.push(comments[i]);
    }
  }
  return {comments, map}
}
