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
