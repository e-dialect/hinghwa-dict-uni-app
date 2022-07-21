<template>
    <view>
        <cu-custom bgColor="bg-white" :isBack="true">
            <view slot="content" class="text-black">语记·搜索</view>
        </cu-custom>
        <scroll-view scroll-y class="scrollPage">
            <view v-if="index == 2" class="bg-white padding-sm padding-left">
                <view class="text-black text-bold text-xl">输入汉字查拼音</view>
                <view>忽略所有非汉字字符，暂不支持搜索繁体字</view>
            </view>
            <view class="cu-bar search bg-white">
                <view class="action">
                    <picker @change="sortFun" :value="index" :range="sort">
                        <text>{{ sort[index] }}</text>
                        <text class="cuIcon-triangledownfill"></text>
                    </picker>
                </view>
                <view class="search-form round">
                    <text class="cuIcon-search"></text>
                    <input type="text" placeholder="兴化语记" :focus="true" :value="key" confirm-type="search" @input="keyFun" @confirm="search" />
                </view>
                <view class="action" @tap="search">
                    <text class="text-blue">搜索</text>
                </view>
            </view>
            <!-- <view class="cu-bar bg-white text-grey" wx:if="{{status==0}}">
    <view class="action">历史搜索</view>
    <image src="/images/home/delete.png" mode="widthFix" bindtap="deleteHistory"
      style="width:5vw;height:auto;margin-right:30rpx;">
    </image>
  </view> -->
            <!-- <view class="history" wx:if="{{status==0}}">
    <view class="padding-xs" wx:for="{{history}}">
      <view class="cu-tag round">{{item}}</view>
    </view>
  </view> -->
            <!-- <view class="bg-white flex text-df text-black" wx:if="{{status!=0}}">
    <view class="flex-sub padding {{status==1?'text-bold':''}}" bindtap="sort" data-index="1">单字</view>
    <view class="flex-sub padding {{status==2?'text-bold':''}}" bindtap="sort" data-index="2">词语</view>
    <view class="flex-sub padding line {{status==3?'text-bold':''}}" bindtap="sort" data-index="3">文章</view>
    <view class="flex-sub padding text-center" bindtap="sort" data-index="3">更多</view>
  </view> -->
            <view class="cu-list menu" v-if="index == 0 && status == 1">
                <view class="cu-item arrow" style="min-height: 240rpx" @tap="word" :data-index="index" v-for="(item, index) in words" :key="index">
                    <view class="flex flex-direction justify-between">
                        <view class="margin-bottom-xs">
                            <text class="text-xxl text-bold">{{ item.word.word }}</text>
                        </view>
                        <view class="margin-bottom-xs">
                            <text>{{ item.word.standard_pinyin }}</text>
                            <text class="text-grey" decode>&nbsp;&nbsp;/{{ item.word.standard_ipa }}/</text>
                            <text v-if="item.pronunciation.url.length > 4" class="cuIcon-notificationfill text-blue margin-left"></text>
                        </view>
                        <view class="text-grey definition">{{ item.word.definition }}</view>
                    </view>
                </view>
            </view>
            <view v-if="index == 1 && status == 1">
                <view class="cu-list menu" v-for="(item, index) in pronunciation" :key="index">
                    <view class="cu-item arrow" style="min-height: 150rpx" :data-id="kid.id" @tap="character" v-for="(kid, index1) in item.characters" :key="index1">
                        <view class="flex flex-direction justify-between">
                            <view class="margin-bottom-sm">
                                <text class="text-xxl text-bold">{{ item.label }}</text>
                                <!-- <text class="cuIcon-notificationfill text-blue margin-left"></text> -->
                            </view>
                            <view>
                                <text>{{ kid.pinyin }}</text>
                                <text class="text-grey margin-left">/{{ kid.ipa }}/</text>
                            </view>
                        </view>
                    </view>
                </view>
            </view>
            <view class="bg-white" v-if="index == 2 && status == 1">
                <view v-for="(i, index) in characters" :key="index">
                    <view class="padding solid-bottom" v-for="(j, index1) in i.characters" :key="index1">
                        <view>
                            <text class="text-xxl text-black text-bold">{{ i.label }}</text>
                            <text v-if="i.lable !== i.traditional"></text>
                            <text class="text-xl">{{ i.label === i.traditional ? ' ' : i.traditional }}</text>
                            <text class="text-grey">{{ j.county }} / {{ j.town }}</text>
                        </view>

                        <view class="text-lg margin-top-xs">
                            <text :data-id="k.word" @tap="getWord" v-for="(k, index2) in j.characters" :key="index2">
                                <text v-if="k.word" class="text-blue" space="emsp">{{ k.pinyin }}{{' '}}{{' '}}</text>
                                <text v-else space="emsp">{{ k.pinyin }}{{' '}}{{' '}}</text>
                                <text class="text-grey" space="emsp">/{{ k.ipa }}/{{' '}}{{' '}}</text>
                            </text>
                        </view>
                    </view>
                </view>
            </view>
            <view v-if="index == 3 && status == 1">
                <view class="flex article solid-bottom" :data-id="item.article.id" @tap="toArticle" v-for="(item, index) in articles" :key="index">
                    <image :src="item.article.cover" mode="aspectFill"></image>

                    <view style="flex: 1">
                        <view class="flex justify-between">
                            <view class="text-bold-less text-lg">{{ item.article.title }}</view>
                            <view class="text-grey margin-top-mini">
                                <text class="cuIcon-attention"></text>
                                {{ item.article.views }}
                            </view>
                        </view>
                        <view class="content">{{ item.article.description }}</view>
                    </view>
                </view>
            </view>
        </scroll-view>
    </view>
</template>

<script>
const app = getApp();
export default {
    data() {
        return {
            status: 0,
            index: 0,
            sort: ['词语', '单字', '拼音', '文章'],
            history: [],
            key: '',
            characters: [],
            pronunciation: [],
            words: [],
            articles: [],

            kid: {
                id: '',
                pinyin: '',
                ipa: ''
            },

            i: {
                characters: [],
                label: '',
                lable: '',
                traditional: ''
            },

            j: {
                county: '',
                town: '',
                characters: []
            },

            k: {
                word: '',
                pinyin: '',
                ipa: ''
            }
        };
    },
    onLoad(option) {
        if (option.index) {
            this.setData({
                index: option.index
            });
        }

        var history = uni.getStorageSync('history');

        if (history) {
            this.setData({
                history: history
            });
        }
    },
    methods: {
        sortFun(e) {
            this.setData({
                index: e.detail.value
            });
        },

        keyFun(e) {
            this.setData({
                key: e.detail.value
            });
        },

        search() {
            if (this.key == '') {
                uni.showModal({
                    content: '搜索内容为空！',
                    showCancel: false,

                    success(res) {
                        console.log(res.confirm);
                    }
                });
                return;
            }

            this.setData({
                status: 1
            });
            this.history.push(this.key);
            uni.setStorageSync('history', this.history);
            uni.showLoading();
            var key = this.key;
            var index = this.index;

            if (index == 0) {
                // 词语
                this.searchWord(key);
            } else if (index == 1) {
                // 单字 多字
                this.searchCharacter(key);
            } else if (index == 2) {
                // 拼音
                this.searchPinyin(key);
            } else if (index == 3) {
                // 文章
                this.searchArticle(key);
            }
        },

        searchPinyin(key) {
            let that = this;
            uni.request({
                url: app.globalData.server + 'characters/words/v2?search=' + key,
                method: 'GET',
                header: {
                    'content-type': 'application/json'
                },

                success(res) {
                    if (res.statusCode === 200) {
                        uni.hideLoading();
                        console.log(res.data.characters);
                        that.setData({
                            characters: res.data.characters
                        });
                    }
                }
            });
        },

        searchCharacter(key) {
            let that = this;
            uni.request({
                url: app.globalData.server + 'characters/words?search=' + key,
                method: 'GET',
                data: {},
                header: {
                    'content-type': 'application/json'
                },

                success(res) {
                    if (res.statusCode == 200) {
                        uni.hideLoading();
                        console.log(res.data.characters);

                        if (res.data.characters[0].characters.length === 0) {
                            uni.showToast({
                                title: '搜索结果为空',
                                icon: 'none'
                            });
                        } else {
                            that.setData({
                                pronunciation: res.data.characters
                            });
                        }
                    }
                }
            });
        },

        searchWord(key) {
            var that = this;
            uni.request({
                url: app.globalData.server + 'words?search=' + key,
                method: 'GET',
                data: {},
                header: {
                    'content-type': 'application/json'
                },

                success(res) {
                    if (res.statusCode == 200) {
                        var arr = res.data.words;
                        uni.request({
                            url: app.globalData.server + 'words',
                            method: 'PUT',
                            data: {
                                words: arr
                            },
                            header: {
                                'content-type': 'application/json'
                            },

                            success(res) {
                                if (res.statusCode == 200) {
                                    uni.hideLoading();

                                    if (res.data.words.length === 0) {
                                        uni.showToast({
                                            title: '搜索结果为空',
                                            icon: 'none'
                                        });
                                    } else {
                                        that.setData({
                                            words: res.data.words
                                        });
                                    }
                                }
                            }
                        });
                    } else {
                        uni.showToast({
                            title: '服务器错误'
                        });
                    }
                },

                fail(err) {
                    uni.showToast({
                        title: '网络异常'
                    });
                }
            });
        },

        searchArticle(key) {
            var that = this;
            uni.request({
                url: app.globalData.server + 'articles?search=' + key,
                method: 'GET',
                data: {},
                header: {
                    'content-type': 'application/json'
                },

                success(res) {
                    if (res.statusCode == 200) {
                        var arr = res.data.articles;
                        uni.request({
                            url: app.globalData.server + 'articles',
                            method: 'PUT',
                            data: {
                                articles: arr
                            },
                            header: {
                                'content-type': 'application/json'
                            },

                            success(res) {
                                if (res.statusCode == 200) {
                                    uni.hideLoading();
                                    that.setData({
                                        articles: res.data.articles
                                    });
                                }
                            }
                        });
                    } else {
                        uni.showToast({
                            title: '服务器错误'
                        });
                    }
                },

                fail(err) {
                    uni.showToast({
                        title: '网络异常'
                    });
                }
            });
        },

        deleteHistory() {
            let that = this;
            uni.showModal({
                title: '提示',
                content: '是否清空历史记录？',

                success(res) {
                    uni.setStorageSync('history', null);
                    that.setData({
                        history: []
                    });
                }
            });
        },

        character(e) {
            let id = e.currentTarget.dataset.id;
            uni.navigateTo({
                url: '/pages/basics/characters/characters?id=' + id
            });
        },

        word(e) {
            let index = e.currentTarget.dataset.index;
            let id = this.words[index].word.id;
            uni.navigateTo({
                url: '/pages/basics/words/words?id=' + id
            });
        },

        toArticle(e) {
            let id = e.currentTarget.dataset.id;
            uni.navigateTo({
                url: '/pages/plugin/article/article?id=' + id
            });
        },

        getWord(e) {
            let id = e.currentTarget.dataset.id;

            if (!id) {
                return;
            }

            uni.navigateTo({
                url: '/pages/basics/words/words?id=' + id
            });
        }
    }
};
</script>
<style>
.history {
    padding: 0 20rpx 20rpx 20rpx;
    display: flex;
    flex-wrap: wrap;
    background-color: white;
}

.line {
    position: relative;
}

.line::after {
    content: ' ';
    width: 200%;
    height: 90%;
    position: absolute;
    top: 30%;
    left: 0;
    border-radius: inherit;
    transform: scale(0.5);
    transform-origin: 0 0;
    pointer-events: none;
    box-sizing: border-box;
    border-right: 1rpx solid rgba(0, 0, 0, 0.5);
}

.definition {
    display: -webkit-box;
    word-break: break-all;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 2;
    overflow: hidden;
    text-overflow: ellipsis;
}

.article {
    padding: 20rpx;
    background-color: white;
}

.article image {
    width: 240rpx;
    height: 6.4em;
    margin-right: 10rpx;
}

.content {
    margin-top: 15rpx;
    font-size: 26rpx;
    color: #888;
    height: 4.2em;
    display: -webkit-box;
    word-break: break-all;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 3;
    overflow: hidden;
    text-overflow: ellipsis;
}
</style>
