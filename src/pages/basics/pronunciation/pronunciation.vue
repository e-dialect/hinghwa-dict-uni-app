<template>
    <view>
        <cu-custom bgColor="bg-white" :isBack="true">
            <view slot="content" class="text-black">更多语音</view>
        </cu-custom>
        <button class="cu-btn icon lg bg-blue shadow write" @tap="uploadPronunciation">
            <text class="cuIcon-voice"></text>
        </button>
        <view style="background-color: white">
            <view class="solid-bottom padding text-bold text-sl">{{ word }}</view>
            <view class="padding solid-bottom" v-for="(item, index) in pronunciation" :key="index">
                <view class="flex justify-between align-center">
                    <view>
                        <view class="text-lg">
                            <text>{{ item.pronunciation.pinyin }}</text>
                            <text class="text-grey" decode>&nbsp;&nbsp;/{{ item.pronunciation.ipa }}/&nbsp;&nbsp;</text>
                            <text class="cuIcon-notificationfill text-blue" :data-index="index" @tap="play"></text>
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
    </view>
</template>

<script>
const app = getApp();
export default {
    data() {
        return {
            id: 0,
            word: '',
            pronunciation: [],
            return: false
        };
    },
    onLoad(options) {
        this.setData({
            id: options.id,
            word: options.word
        });
        this.getPronunciation(); // 创建播放器

        this.innerAudioContext = uni.createInnerAudioContext();
    },
    onShow() {
        if (this.return) {
            this.getPronunciation();
        } else {
            this.setData({
                return: true
            });
        }
    },
    methods: {
        // 获取字词发音
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
                    that.setData({
                        pronunciation: res.data.pronunciation
                    });
                }
            });
        },

        toVisitor(e) {
            let id = e.currentTarget.dataset.id;
            uni.navigateTo({
                url: '/pages/about/visitor/visitor?id=' + id
            });
        },

        uploadPronunciation() {
            let id = this.id;
            let word = this.word;
            uni.navigateTo({
                url: '/pages/component/uploadpronunciation/uploadpronunciation?id=' + id + '&word=' + word
            });
        },

        play(e) {
            let index = e.currentTarget.dataset.index;
            var src = this.pronunciation[index].pronunciation.source;
            console.log(src);

            if (src == '') {
                uni.showToast({
                    title: '音源为空！',
                    icon: 'error'
                });
                return;
            }

            uni.showToast({
                title: '正在播放录音..',
                icon: 'none'
            });
            this.innerAudioContext.src = src;
            this.innerAudioContext.play();
        }
    }
};
</script>
<style>
.write {
    position: fixed;
    bottom: 10vh;
    right: 6vw;
    z-index: 1024;
}
</style>
