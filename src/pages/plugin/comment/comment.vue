<template>
  <view>
    <cu-custom
      bg-color="bg-white"
      :is-back="true"
    />
    <view class="padding-sm solid-bottom">
      <view class="flex">
        <image
          class="cu-avatar round margin-right-sm"
          :src="comment.user.avatar"
          mode="aspectFill"
        />
        <view class="flex flex-sub justify-between">
          <view class="flex flex-direction">
            <view class="text-name">
              {{ comment.user.nickname }}
            </view>
            <view class="text-date">
              {{ comment.time }}
            </view>
          </view>
          <view class="text-dz">
            <text class="cuIcon-appreciate" />
          </view>
        </view>
      </view>
      <view class="text-content">
        {{ comment.content }}
      </view>
    </view>
    <view class="padding-sm">
      <view class="text-df text-bold padding-top-sm padding-bottom-sm">
        全部回复（{{ comment.kids.length }}条）
      </view>
      <view
        v-for="(item, index) in comment.kids"
        :key="index"
        class="padding-top-sm padding-bottom-sm solid-bottom"
      >
        <view class="flex">
          <image
            class="cu-avatar round margin-right-sm"
            :src="item.user.avatar"
            mode="aspectFill"
          />
          <view class="flex flex-sub justify-between">
            <view class="flex flex-direction">
              <view class="text-name">
                {{ item.user.nickname }}
              </view>
              <view class="text-date">
                {{ item.time }}
              </view>
            </view>
            <view class="text-dz">
              <text class="cuIcon-appreciate" />
            </view>
          </view>
        </view>

        <view class="text-content">
          <text v-if="item.parent != comment.id">
            @
          </text>
          <text
            v-if="item.parent != comment.id"
            class="text-blue"
          >
            {{ comment.kids[map[item.parent]].user.nickname }}
          </text>
          <text v-if="item.parent != comment.id">
            ：
          </text>
          <text
            :data-id="item.id"
            @tap="reply"
          >
            {{ item.content }}
          </text>
        </view>
      </view>
    </view>
    <view
      class="cu-bar foot input padding-bottom"
      style="min-height: 120rpx"
    >
      <view class="input-box">
        <input
          style="margin-left: 30rpx"
          :placeholder="ph_text"
          :focus="is_reply"
          :adjust-position="true"
          @input="getText"
          @focus="focus"
          @blur="blur"
        >
      </view>
      <button
        class="cu-btn bg-blue shadow"
        style="width: 16vw"
        @tap="commentFun"
      >
        发送
      </button>
    </view>
  </view>
</template>

<script>
const app = getApp();
export default {
    data() {
        return {
            article_id: 0,
            parent: 0,

            comment: {
                user: {
                    avatar: '',
                    nickname: ''
                },

                time: '',
                content: '',
                kids: [],
                id: ''
            },

            map: [],
            ph_text: '评论...',
            is_reply: false,
            text: '',

            user: {
                nickname: ''
            }
        };
    },
    onLoad(options) {
        let data = JSON.parse(options.comment);
        this.setData({
            article_id: options.id,
            parent: data.id,
            comment: data
        });
        let map = [];

        for (let i = 0; i < this.comment.kids.length; i++) {
            map[this.comment.kids[i].id] = i;
        }

        this.setData({
            map: map
        });
    },
    methods: {
        focus() {
            this.setData({
                is_reply: true
            });
        },

        blur() {
            let id = this.comment.id;

            if (this.text == '') {
                this.setData({
                    parent: id,
                    is_reply: false,
                    ph_text: '评论...'
                });
            }
        },

        reply(e) {
            let id = e.currentTarget.dataset.id;
            let reply_user = this.comment.kids[this.map[id]].user.nickname;
            this.setData({
                parent: id,
                is_reply: true,
                ph_text: '@ ' + reply_user
            });
        },

        getText(e) {
            this.setData({
                text: e.detail.value
            });
        },

        commentFun() {
            let comment = this.text;
            let parent = this.parent;
            let id = this.article_id;
            let that = this;
            uni.request({
                url: app.globalData.server + 'articles/' + id + '/comments',
                // url: 'http://127.0.0.1:4523/mock/404238/articles/1/comments',
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

                    if (res.statusCode == 200) {
                        uni.showToast({
                            title: '发表成功'
                        });
                        setTimeout(function () {
                            uni.navigateBack({
                                delta: 1
                            });
                        }, 500);
                    } else if (res.statusCode == 400) {
                        uni.showToast({
                            title: '格式错误',
                            icon: 'error'
                        });
                    } else if (res.statusCode == 401) {
                        uni.showToast({
                            title: '没有权限',
                            icon: 'error'
                        });
                    } else if (res.statusCode == 500) {
                        uni.showToast({
                            title: '服务器错误',
                            icon: 'error'
                        });
                    }
                }
            });
        }
    }
};
</script>
<style>
page {
    background-color: white;
}

.text-name {
    color: #666666;
    font-size: 30rpx;
}

.text-date {
    color: #9b9b9b;
    font-size: 24rpx;
}

.text-dz {
    color: #999999;
    font-size: 36rpx;
    align-self: center;
}

.text-content {
    position: relative;
    width: 85vw;
    left: 10vw;
    margin-top: 15rpx;
}

.input-box {
    flex: 1;
    margin-left: 20rpx;
    margin-right: 20rpx;
    border-radius: 5000rpx;
    background-color: #f5f5f5;
}
</style>
