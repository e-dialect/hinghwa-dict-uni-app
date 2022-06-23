<template>
    <view>
        <cu-custom v-if="isShare === 0" bgColor="bg-white" :isBack="true"></cu-custom>
        <view v-else class="back text-xl" @tap="navigateToIndex">
            <text class="cuIcon-back"></text>
        </view>
        <button class="cu-btn icon lg bg-blue shadow write" @tap="uploadPronunciation">
            <text class="cuIcon-voice"></text>
        </button>
        <view class="flex padding solid-bottom">
            <view>
                <view class="flex">
                    <view class="text-bold text-sl">{{ word.word }}</view>
                </view>
            </view>
            <view class="info">
                <view class="text-grey text-df">访问：{{ word.views }}</view>
                <view class="text-grey text-df margin-top-xs">
                    来源：
                    <text class="text-blue" @tap="toVisitor" :data-id="word.contributor.id">{{ word.contributor.nickname }}</text>
                </view>
            </view>
        </view>

        <view class="padding solid-bottom">
            <!-- <button class="cu-btn bg-red text-sm margin-bottom-sm" style="width:fit-content">标准读音</button> -->
            <view>
                <text class="text-bold text-xl" space="emsp">{{ word.standard_pinyin }}</text>
                <text class="text-grey text-xl" space="emsp">/{{ word.standard_ipa }}/</text>
                <text v-if="pronunciation.length" class="cuIcon-notificationfill text-xl text-blue" data-index="-1" @tap="pronounce"></text>
            </view>
        </view>
        <!-- <view wx:if="{{word.related_words.length!==0}}" class="padding solid-bottom">
  <button class="cu-btn bg-red text-sm margin-bottom-sm" style="width:fit-content">相关词汇</button>
  <view>
    <text wx:for="{{word.related_words}}" class="text-bold text-xl text-blue" space="emsp" data-index="{{index}}" bindtap="get_related_word"> {{item.word}}</text>
  </view>
</view> -->
        <!-- <view wx:if="{{word.mandarin.length!==0}}" class="padding solid-bottom">
  <button class="cu-btn bg-red text-sm margin-bottom-sm" style="width:fit-content">普通话词汇</button>
  <view>
    <text wx:for="{{word.mandarin}}" class="text-bold text-xl" space="emsp"> {{item}}</text>
  </view>
</view> -->

        <scroll-view scroll-x class="bg-white nav text-center">
            <view :class="'cu-item ' + (index == TabCur ? 'text-blue cur' : '')" @tap="tabSelect" :data-id="index" v-for="(item, index) in tabs" :key="index">
                {{ item }}
            </view>
        </scroll-view>

        <swiper v-if="platform != 'ios'" style="height: 150vh" class="screen-swiper" :current="TabCur" duration="500" @change="tabSlide">
            <swiper-item class="margin">
                <view style="width: 92vw" class="margin-top-sm solid-bottom" v-for="(item, index) in definition" :key="index">
                    <view class="text-bold text-xl">{{ item.content }}</view>

                    <view class="padding-sm" v-for="(item, index1) in item.example" :key="index1">
                        <button class="cu-btn bg-red" style="width: 8vw">{{ item.type }}</button>

                        <text>{{ item.content }}</text>

                        <text class="text-grey">{{ item.explain }}</text>
                    </view>
                </view>
            </swiper-item>
            <swiper-item>
                <view v-if="no_pronunciations === true" class="margin">
                    <text class="text-grey">该词语暂无语音哦～点击右下方贡献语音～</text>
                </view>
                <view class="padding solid-bottom" v-for="(item, index) in pronunciation" :key="index">
                    <view class="flex justify-between align-center">
                        <view>
                            <view>
                                <text class="text-bold">{{ item.pronunciation.pinyin }}</text>
                                <text class="text-grey" decode>&nbsp;&nbsp;/{{ item.pronunciation.ipa }}/&nbsp;&nbsp;</text>
                                <text class="cuIcon-notificationfill text-blue" :data-index="index" @tap="pronounce"></text>
                            </view>
                            <view class="margin-top">
                                <text>来源：</text>
                                <text class="text-blue" :data-id="item.contributor.id" @tap="toVisitor">{{ item.contributor.nickname }}</text>
                                <text decode>&nbsp;&nbsp;（{{ item.pronunciation.county }}&nbsp;&nbsp;{{ item.pronunciation.town }}）</text>
                            </view>
                        </view>
                        <view class="text-xl">
                            <text class="cuIcon-like"></text>
                        </view>
                    </view>
                </view>
            </swiper-item>
            <swiper-item class="margin">
                <view v-if="word.annotation.length !== 0">
                    <view class="text-bold text-xl">附注</view>
                    <view class="margin-top-sm text-grey">
                        {{ word.annotation }}
                    </view>
                </view>
                <view v-if="word.related_words.length !== 0" class="margin-top">
                    <view class="text-bold text-xl">相关词汇</view>
                    <view class="margin-top-sm">
                        <text class="text-bold text-xl text-blue" space="emsp" :data-index="index" @tap="get_related_word" v-for="(item, index) in word.related_words" :key="index">
                            {{ item.word }}
                        </text>
                    </view>
                </view>
                <view v-if="word.mandarin.length !== 0" class="margin-top">
                    <view class="text-bold text-xl">普通话词汇</view>
                    <view class="margin-top-sm">
                        <text class="text-xl" space="emsp" v-for="(item, index) in word.mandarin" :key="index">{{ item }}</text>
                    </view>
                </view>
            </swiper-item>
        </swiper>

        <view v-if="platform == 'ios'">
            <view v-if="TabCur == 0" class="margin">
                <view style="width: 92vw" class="margin-top-sm solid-bottom" v-for="(item, index) in definition" :key="index">
                    <view class="text-bold text-xl">{{ item.content }}</view>

                    <view class="padding-sm" v-for="(item, index1) in item.example" :key="index1">
                        <button class="cu-btn bg-red" style="width: 8vw">{{ item.type }}</button>

                        <text>{{ item.content }}</text>

                        <text class="text-grey">{{ item.explain }}</text>
                    </view>
                </view>
            </view>
            <view v-if="TabCur == 1">
                <view v-if="no_pronunciations === true" class="margin">
                    <text class="text-grey">该词语暂无语音哦～点击右下方贡献语音～</text>
                </view>
                <view class="padding solid-bottom" v-for="(item, index) in pronunciation" :key="index">
                    <view class="flex justify-between align-center">
                        <view>
                            <view>
                                <text class="text-bold">{{ item.pronunciation.pinyin }}</text>
                                <text class="text-grey" decode>&nbsp;&nbsp;/{{ item.pronunciation.ipa }}/&nbsp;&nbsp;</text>
                                <text class="cuIcon-notificationfill text-blue" :data-index="index" @tap="pronounce"></text>
                            </view>
                            <view class="margin-top">
                                <text>来源：</text>
                                <text class="text-blue" :data-id="item.contributor.id" @tap="toVisitor">{{ item.contributor.nickname }}</text>
                                <text decode>&nbsp;&nbsp;（{{ item.pronunciation.county }}&nbsp;&nbsp;{{ item.pronunciation.town }}）</text>
                            </view>
                        </view>
                        <view class="text-xl">
                            <text class="cuIcon-like"></text>
                        </view>
                    </view>
                </view>
            </view>
            <view v-if="TabCur == 2" class="margin">
                <view v-if="word.annotation.length !== 0">
                    <view class="text-bold text-xl">附注</view>
                    <view class="margin-top-sm text-grey">
                        {{ word.annotation }}
                    </view>
                </view>
                <view v-if="word.related_words.length !== 0" class="margin-top">
                    <view class="text-bold text-xl">相关词汇</view>
                    <view class="margin-top-sm">
                        <text class="text-bold text-xl text-blue" space="emsp" :data-index="index" @tap="get_related_word" v-for="(item, index) in word.related_words" :key="index">
                            {{ item.word }}
                        </text>
                    </view>
                </view>
                <view v-if="word.mandarin.length !== 0" class="margin-top">
                    <view class="text-bold text-xl">普通话词汇</view>
                    <view class="margin-top-sm">
                        <text class="text-xl" space="emsp" v-for="(item, index) in word.mandarin" :key="index">{{ item }}</text>
                    </view>
                </view>
            </view>
        </view>
    </view>
</template>

<script>
const app = getApp();
export default {
    data() {
        return {
            id: 0,
            word: {
                word: '',
                views: '',

                contributor: {
                    id: '',
                    nickname: ''
                },

                standard_pinyin: '',
                standard_ipa: '',
                annotation: [],
                related_words: [],
                mandarin: []
            },
            definition: [],
            pronunciation: [],
            TabCur: 0,
            tabs: ['释义', '发音', '其他'],
            platform: '',
            isShare: 0,
            no_pronunciations: false
        };
    }, //右上角分享功能
    onShareAppMessage() {
        var that = this;
        var title = this.word.word;
        var id = this.word.id;
        return {
            title: title,
            path: '/pages/basics/words/words?id=' + id + '&share=1',
            success: function (res) {
                // 转发成功
            },
            fail: function (res) {
                // 转发失败
            }
        };
    },
    onLoad(options) {
        if (options.share) {
            this.setData({
                isShare: options.share
            });
        }

        this.setData({
            id: options.id,
            platform: app.globalData.platform
        });
        this.getWord(); // 创建播放器

        this.innerAudioContext = uni.createInnerAudioContext();
        this.innerAudioContext.onError((res) => {
            that.tip('播放语音失败！');
        });
    },
    methods: {
        navigateToIndex() {
            uni.navigateTo({
                url: '/pages/index/index?status=basics'
            });
        },

        toVisitor(e) {
            let id = e.currentTarget.dataset.id;
            uni.navigateTo({
                url: '/pages/about/visitor/visitor?id=' + id
            });
        },

        getWord() {
            let that = this;
            uni.request({
                url: app.globalData.server + 'words/' + that.id,
                method: 'GET',
                data: {},
                header: {
                    'content-type': 'application/json'
                },

                success(res) {
                    console.log(res);

                    if (res.statusCode == 200) {
                        that.setData({
                            word: res.data.word
                        });
                        that.splitDefinition(res.data.word.definition);
                        that.getPronunciation();
                    }
                }
            });
        },

        // 获取发音
        getPronunciation() {
            let id = this.id;
            let that = this;
            uni.request({
                url: app.globalData.server + 'pronunciation?word=' + id,
                method: 'GET',
                data: {},
                header: {
                    'content-type': 'application/json'
                },

                success(res) {
                    if (res.statusCode == 200) {
                        that.setData({
                            pronunciation: res.data.pronunciation
                        });

                        if (res.data.pronunciation.length === 0) {
                            that.setData({
                                no_pronunciations: true
                            });
                        }
                    }
                }
            });
        },

        pronounce(e) {
            uni.showToast({
                title: '正在播放录音...',
                icon: 'none'
            });
            let index = e.currentTarget.dataset.index;
            let src = '';

            if (index === '-1') {
                src = this.word.source;
            } else {
                this.pronunciation[index].pronunciation.source;
            }

            this.innerAudioContext.src = src;
            this.innerAudioContext.play();
        },

        get_related_word(e) {
            let index = e.currentTarget.dataset.index;
            let id = this.word.related_words[index].id;
            uni.navigateTo({
                url: '/pages/basics/words/words?id=' + id
            });
        },

        tabSelect(e) {
            this.setData({
                TabCur: e.currentTarget.dataset.id
            });
        },

        tabSlide(e) {
            this.setData({
                TabCur: e.detail.current
            });
        },

        /**
         * 具体解析一个待解析的字符串
         * @param definition 具体待解析的字符串
         */
        analyseDefinition(definition, num) {
            let index = definition.indexOf('：');

            if (index === -1) {
                index = definition.indexOf('△');

                if (index === -1) {
                    index = definition.length;
                } else {
                    index = index - 1;
                }
            }

            const result = {
                content: num + definition.substring(0, index),
                example: []
            };
            let status = 1; // 1：现在是例子；0：现在是例子的解释

            let example = {
                type: '例',
                content: '',
                explain: ''
            };

            for (const char of definition.substring(index + 1)) {
                if (char === '（') {
                    // 例子解释开始
                    status = 0;
                } else if (char === '）') {
                    // 例子解释结束
                    status = 1;
                } else if (status === 0) {
                    // 例子解释内容
                    example.explain = example.explain + char;
                } else if (char === '△') {
                    // 例子类型
                    example.type = '俗';
                } else if (char === '|' || char === '。') {
                    // 一个例子结束
                    result.example.push(example);
                    example = {
                        type: '例',
                        content: '',
                        explain: ''
                    };
                } else {
                    // 例子的内容
                    example.content = example.content + char;
                }
            }

            return result;
        },

        /**
         * 将数据库中的释义字符串进行拆分
         * @param definition 释义字符串
         */
        splitDefinition(definition) {
            const order = ['①', '②', '③', '④', '⑤', '⑥', '⑦', '⑧', '⑨', '⑩'];
            let lastIndex = -1;
            const result = [];
            let i = 0;

            for (i = 0; i < order.length; i++) {
                const index = definition.indexOf(order[i]);

                if (index < 0) {
                    break;
                }

                if (lastIndex !== -1) {
                    result.push(this.analyseDefinition(definition.substring(lastIndex, index), order[i - 1]));
                }

                lastIndex = index + 1;
            }

            if (i == 0) {
                result.push(this.analyseDefinition(definition.substring(lastIndex), ''));
            } else {
                result.push(this.analyseDefinition(definition.substring(lastIndex), order[i - 1]));
            }

            this.setData({
                definition: result
            });
        },

        uploadPronunciation() {
            let id = this.id;
            let word = this.word.word;
            let ipa = this.word.standard_ipa;
            let pinyin = this.word.standard_pinyin;
            uni.navigateTo({
                url: '/pages/component/uploadpronunciation/uploadpronunciation?id=' + id + '&word=' + word + '&ipa=' + ipa + '&pinyin=' + pinyin
            });
        }
    }
};
</script>
<style>
page {
    background-color: #ffffff;
}

.logo {
    display: flex;
    justify-content: center;
    align-items: center;
}

.logo image {
    width: 22vh;
    height: 16vh;
}

.info {
    position: absolute;
    right: 50rpx;
    bottom: 40rpx;
}

.back {
    margin-top: 8vh;
    margin-left: 4vw;
}

.write {
    position: fixed;
    bottom: 10vh;
    right: 6vw;
    z-index: 1024;
}
</style>
