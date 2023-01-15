import request from '@/utils/request';

/**
 * AT0101 创建文章
 * @param article{{title:string,description:string,content:string,cover:string}} 文章内容
 * @returns {Promise<unknown>}
 */
export async function createArticle(article) {
  return request.post('/articles', article);
}

/**
 * AT0102 删除文章
 * @param id{number} 文章 id
 * @returns {Promise<unknown>}
 */
export async function deleteArticle(id) {
  return request.del(`/articles/${id}`);
}

/**
 * AT0103 更新文章
 * @param id{number} 文章 id
 * @param article{{title:string,description:string,content:string,cover:string}} 文章内容
 * @returns {Promise<unknown>}
 */
export async function updateArticle(id, article) {
  const data = {
    title: article.title,
    description: article.description,
    content: article.content,
    cover: article.cover,
  };
  return request.put(`/articles/${id}`, { article: data });
}

/**
 * AT0104 获取文章信息
 * @param id 文章id
 * @returns {Promise<{}>} 文章和me对象
 */
export async function getArticle(id) {
  try {
    return await request.get(`/articles/${id}`);
  } catch (e) {
    return {};
  }
}

/**
 * AT0201 搜索符合条件的文章
 * @returns {Promise<number[]>} 文章id列表
 */
export async function searchArticleId(key) {
  if (key) return request.get('/articles', { search: key });
  return request.get('/articles');
}

/**
 * AT0202 文章内容批量获取
 * @param idList{number[]} 文章id数组
 * @returns {Promise<unknown>}
 */
export async function getArticles(idList) {
  return request.put('/articles', { articles: idList });
}

/**
 * 搜索相关文章并返回文章列表
 * @returns {Promise<unknown>}
 */
export async function searchArticles(key) {
  try {
    const res = await searchArticleId(key);
    const articleIds = res.articles;
    const res1 = await getArticles(articleIds);
    return res1.articles;
  } catch (e) {
    return [];
  }
}

/**
 * AT0301 点赞文章
 * @param id 文章id
 * @returns {Promise<unknown>}
 */
export async function likeArticle(id) {
  return request.post(`/articles/${id}/like`);
}

/**
 * AT0302 取消点赞文章
 * @param id 文章id
 * @returns {Promise<*>}
 */
export async function unlikeArticle(id) {
  return request.del(`/articles/${id}/like`);
}

/**
 * AT0401 发表文章评论
 * @param id 文章id
 * @param comment 评论内容
 * @param replyId 回复评论id
 * @returns {Promise<unknown>}
 */
export async function createComment(id, comment, replyId) {
  return request.post(`/articles/${id}/comments`, { content: comment, parent: replyId });
}

/**
 * AT0403 评论内容批量获取
 * @param commentId 评论id
 * @returns {Promise<unknown>}
 */
export async function getComment(commentId) {
  return request.put('/articles/comments', { comments: commentId });
}

/**
 * AT0404 获取文章评论
 * @param id 文章id
 * @returns {Promise<{comments: *, map: *[]}>}
 */
export async function getComments(id) {
  const res = await request.get(`/articles/${id}/comments`);
  const { comments } = res;
  const map = []; // 获取根评论

  for (let i = 0; i < comments.length; i += 1) {
    comments[i].kids = [];
    map[comments[i].id] = i;
  }

  // 获取子孙评论
  for (let i = 0; i < comments.length; i += 1) {
    if (comments[i].parent !== 0) {
      let p = comments[i].parent;

      while (comments[map[p]].parent) {
        p = comments[map[p]].parent;
      }

      comments[map[p]].kids.push(comments[i]);
    }
  }
  return { comments, map };
}
