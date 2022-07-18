<template>
  <view>
    <cu-custom title="语记·文章"></cu-custom>

    <scroll-view scroll-y style="height: 82vh">
      <view class="padding-sm">
        <!--文章标题-->
        <view class="text-bold text-xxl line">{{ article.title }}</view>

        <!--文章信息-->
        <view>
          <view class="flex text-df margin-top align-center" @tap="toUserPage(article.author.id)">
            <text class="text-grey">文章作者：</text>
            <image :src="article.author.avatar" class="cu-avatar round ssm" mode="aspectFill"></image>
            <text class="text-grey"> {{ article.author.nickname }}</text>
          </view>
          <text class="text-grey">发布时间：{{ article.publish_time + "\n" }}</text>
          <text class="text-grey">更新时间：{{ article.update_time }}</text>
        </view>

        <!--文章简介-->
        <view class="solid-top solid-bottom margin-top-xl padding-top-sm padding-bottom-sm">
          <text class="text-xl text-grey line">{{ article.description }}</text>
        </view>

        <!--文章内容-->
        <view :data-text="article.content" class="margin-top-xl">
          <MarkdownViewer :markdown="article.content"></MarkdownViewer>
        </view>

        <!--文章评论区-->
        <view class="margin-top-xl padding-top-sm solid-top">
          <view class="text-df text-bold">评论（{{ comments.length }}条）</view>
          <view v-for="(item, index) in comments" :key="index" class="solid-bottom padding-top-sm padding-bottom-sm">
            <view v-if="item.parent === 0">
              <view class="flex">
                <image :data-index="index" :src="item.user.avatar" class="cu-avatar round margin-right-sm"
                       mode="aspectFill" @tap="toVisitorByComment"></image>
                <view class="flex flex-sub justify-between">
                  <view class="flex flex-direction">
                    <view class="text-name">{{ item.user.nickname }}</view>
                    <view class="text-date">{{ item.time }}</view>
                  </view>
                  <view class="text-dz">
                    <text class="cuIcon-appreciate"></text>
                  </view>
                </view>
              </view>
            </view>

            <view :data-id="item.id" class="text-content" @tap="reply">{{ item.content }}</view>

            <view v-for="(kid, index1) in item.kids" :key="index1" class="text-reply">
              <text :data-id="kid.user.id" class="text-blue" @tap="toVisitorByReply">{{ kid.user.nickname }}</text>

              <text v-if="kid.parent !== item.id">@</text>

              <text v-if="kid.parent !== item.id" :data-id="comments[map[kid.parent]].user.id" class="text-blue"
                    @tap="toVisitorByReply">
                {{ comments[map[kid.parent]].user.nickname }}
              </text>

              <text :data-id="item.id" @tap="getAllReplys">：{{ kid.content }}</text>
            </view>
          </view>
        </view>

      </view>
    </scroll-view>

    <!--最新评论-->
    <view class="cu-bar foot input padding bg-white" style="min-height: 120rpx; z-index: 200">
      <!--点赞按钮-->
      <view v-if="is_reply === false" :class="'like ' + (is_like === 0 ? '' : 'text-blue')" @tap="like">
        <text class="cuIcon-appreciate bg-white">{{ likes }}</text>
      </view>
      <view class="input-box">
        <input :adjust-position="true" :focus="is_reply" :placeholder="ph_text" :value="comment"
               style="margin-left: 30rpx"
               @blur="blur" @focus="focus" @input="getText"/>
      </view>
      <button v-if="is_reply === true" class="cu-btn bg-blue shadow" style="width: 16vw" @tap="commentFun">发送</button>
    </view>
  </view>
</template>

<script>
import MarkdownViewer from "@/components/MarkdownViewer";
import {toUserPage}   from "@/routers";

const app = getApp();
export default {
  components: {
    MarkdownViewer
  },
  data() {
    return {
      toUserPage: toUserPage,
      article: {
        title: '',
        author: {
          avatar: ''
        },
        publish_time: '',
        update_time: '',
        description: '',
        content: ''
      },

      is_like: false,
      likes: 0,
      id: 0,
      comments: [],
      map: [],
      parent: 0,
      comment: '',
      is_reply: false,
      ph_text: '评论...',

      kid: {
        user: {
          id: '',
          nickname: ''
        },

        parent: '',
        content: ''
      },

      user: {
        id: '',
        nickname: ''
      }
    };
  },
  onLoad(options) {
    let id  = options.id;
    this.id = id
    this.getArticle(id);
  },
  onShow() {
    // 获取评论
    // this.getComments()
  },
  methods: {

    // 根据id获取文章细节
    getArticle(id) {
      uni.showLoading({
        title: '加载中...'
      });
      let that = this;
      uni.request({
        url: app.globalData.server + 'articles/' + id,
        method: 'GET',
        data: {},
        header: {
          'content-type': 'application/json',
          token: app.globalData.token
        },

        success(res) {
          if (res.statusCode === 200) {

            that.setData({
              article: res.data.article,
              likes: res.data.article.likes,
              is_like: res.data.me.liked
            });
            setTimeout(function () {
              uni.hideLoading();
            }, 500);
          }
        }
      });
    },

    getComments() {
      let id   = this.id.toString();
      let that = this;
      uni.request({
        url: app.globalData.server + 'articles/' + id + '/comments',
        // url: 'http://127.0.0.1:4523/mock/404238/articles/1/comments',
        method: 'GET',
        data: {},
        header: {
          'content-type': 'application/json'
        },

        success(res) {
          console.log(res.data);

          if (res.statusCode === 200) {
            let comments = res.data.comments;
            let map      = []; // 获取根评论

            for (let i = 0; i < comments.length; i++) {
              comments[i].kids    = [];
              map[comments[i].id] = i;
            } // 获取子孙评论

            for (let i = 0; i < comments.length; i++) {
              if (comments[i].parent !== 0) {
                let p = comments[i].parent;

                while (comments[map[p]].parent) {
                  p = comments[map[p]].parent;
                }

                comments[map[p]].kids.push(comments[i]);
              }
            }

            that.setData({
              comments: comments,
              map: map
            });
          }
        }
      });
    },

    getAllReplys(e) {
      let id         = e.currentTarget.dataset.id;
      let comment    = JSON.stringify(this.comments[this.map[id]]);
      let article_id = this.article.id;
      uni.navigateTo({
        url: '/pages/plugin/comment/comment?comment=' + comment + '&id=' + article_id
      });
    },

    reply(e) {
      let id         = e.currentTarget.dataset.id;
      let reply_user = this.comments[this.map[id]].user.nickname;
      this.parent    = id
      this.is_reply  = true
      this.ph_text   = '@ ' + reply_user
      console.log(this.parent);
    },

    getText(e) {
      this.comment = e.detail.value
    },

    commentFun() {
      let comment = this.comment;
      let parent  = this.parent;
      console.log(this.parent);
      let id   = this.article.id.toString();
      let that = this;
      uni.request({
        url: app.globalData.server + 'articles/' + id + '/comments',
        method: 'POST',
        data: {
          content: comment,
          parent: parent
        },
        header: {
          'content-type': 'application/json',
          token: app.globalData.token
        },

        success(res) {
          console.log(res);

          if (res.statusCode === 200) {
            // 清空输入框
            that.setData({
              comment: '',
              is_reply: false
            });
            uni.showToast({
              title: '发表成功'
            });
            that.getComments();
          } else if (res.statusCode === 400) {
            uni.showToast({
              title: '格式错误',
              icon: 'error'
            });
          } else if (res.statusCode === 401) {
            uni.showToast({
              title: '没有权限',
              icon: 'error'
            });
          } else if (res.statusCode === 500) {
            uni.showToast({
              title: '服务器错误',
              icon: 'error'
            });
          }
        }
      });
    },

    focus() {
      this.is_reply = true
    },

    blur() {
      if (this.comment === '') {
        this.parent   = 0
        this.is_reply = false
        this.ph_text  = '评论...'
      }
    },

    like() {
      let is_like = this.is_like;
      let that    = this;

      if (!is_like) {
        // 给文章点赞
        uni.request({
          url: app.globalData.server + 'articles/' + that.article.id + '/like',
          // url: 'http://127.0.0.1:4523/mock/404238/articles/1/like',
          method: 'POST',
          data: {},
          header: {
            'content-type': 'application/json',
            token: app.globalData.token
          },

          success(res) {
            console.log(res);

            if (res.statusCode === 200) {
              that.setData({
                likes: that.likes + 1,
                is_like: 1
              });
            }
          }
        });
      } else {
        // 取消点赞
        uni.request({
          url: app.globalData.server + 'articles/' + that.article.id + '/like',
          method: 'DELETE',
          data: {},
          header: {
            'content-type': 'application/json',
            token: app.globalData.token
          },

          success(res) {
            if (res.statusCode === 200) {
              that.setData({
                likes: that.likes - 1,
                is_like: 0
              });
            }
          }
        });
      }
    },

    toVisitorByComment(e) {
      let index = e.currentTarget.dataset.index;
      let id    = this.comments[index].user.id;
      uni.navigateTo({
        url: '/pages/about/visitor/visitor?id=' + id
      });
    },

    toVisitorByReply(e) {
      let id = e.currentTarget.dataset.id;
      uni.navigateTo({
        url: '/pages/about/visitor/visitor?id=' + id
      });
    }
  }
};
</script>
<style>
page {
  background-color: white;
}

.line {
  line-height: 1.6em;
}

.like {
  background-color: #f5f5f5;
  border-radius: 5000 rpx;
  padding: 10 rpx 20 rpx;
  margin-left: 25 rpx;
  font-size: 30 rpx;
}

.input-box {
  flex: 1;
  margin-left: 20 rpx;
  margin-right: 20 rpx;
  border-radius: 5000 rpx;
  background-color: #f5f5f5;
}

.border {
  border: 2 rpx solid #0081ff;
}

.text-name {
  color: #666666;
  font-size: 30 rpx;
}

.text-date {
  color: #9b9b9b;
  font-size: 24 rpx;
}

.text-dz {
  color: #999999;
  font-size: 36 rpx;
  align-self: center;
}

.text-content {
  position: relative;
  width: 85vw;
  left: 10vw;
  margin-top: 15 rpx;
}

.text-reply {
  background-color: #f7f7f7;
  position: relative;
  width: 85vw;
  left: 10vw;
  margin-top: 10 rpx;
  padding: 20 rpx;
  border-radius: 10 rpx;
}
</style>
