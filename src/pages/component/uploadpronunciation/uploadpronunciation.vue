<template>
  <view>
    <!--标题-->
    <cu-custom :isBack="true" bgColor="bg-white">
      <view slot="content" class="text-black">发布</view>
    </cu-custom>

    <view style="height: 100%; position: absolute; width: 100%">
      <form @submit="submitRecord">
        <!--表单列表-->
        <block>
          <input class="extend text-bold" disabled value="词语"/>
          <input :value="word" class="fileName" disabled/>
        </block>
        <block>
          <input class="extend text-bold" disabled value="IPA"/>
          <input :value="ipa" class="fileName" name="ipa" placeholder="请输入该词语的国际音标"/>
        </block>
        <block>
          <input class="extend text-bold" disabled value="拼音"/>
          <input :value="pinyin" class="fileName" name="pinyin" placeholder="请输入该词语的拼音"/>
        </block>
        <view class="flex">
          <input class="extend text-bold" disabled value="地区"/>
          <picker
              :range="multiArray"
              :value="multiIndex"
              class="fileName"
              mode="multiSelector"
              style="margin-right: 20rpx"
              @columnchange="columnChange"
          >
            {{ multiArray[0][multiIndex[0]] }} {{ multiArray[1][multiIndex[1]] }}
          </picker>
        </view>

        <!--录音按钮-->
        <view class="record-btn">
          <!-- 没有有效的录音文件-->
          <view v-if="!source">
            <button
                class="cu-btn icon llg bg-blue shadow margin-bottom-sm"
                @longpress="startRecord"
                @touchend="stopRecord"
            >
              <text class="cuIcon-voice"></text>
            </button>
            <view class="text-xlp">
              <text v-if="status === 0">长按开始录音</text>
              <text v-else>松开结束录音</text>
            </view>
          </view>
          <!-- 有有效的录音文件-->
          <view v-else>
            <button
                class="cu-btn icon llg bg-blue shadow margin-bottom-sm"
                @tap="playMp3"
            >
              <text class="cuIcon-notificationfill"></text>
            </button>
            <view class="text-xlp">
              <text>点击播放录音</text>
            </view>
          </view>
        </view>

        <!--有录音文件之后的提交按钮-->
        <view v-if="source">
          <button class="cu-btn block bg-red shadow margin" style="width: 90vw;" @tap="reRecord">
            重新录制
          </button>
          <button class="cu-btn block bg-blue shadow margin" form-type="submit" style="width: 90vw;">
            确认提交
          </button>
        </view>

      </form>
    </view>

  </view>
</template>

<script>
import {uploadFile}      from "@/services/file";
import request           from "@/utils/request";
import {counties, towns} from "@/const/location";

const app = getApp();
export default {
  data() {
    return {
      id: 0,
      word: '',
      ipa: '',
      pinyin: '',
      status: -1,
      source: '',
      multiIndex: [0, 0],
    };
  },
  computed: {
    multiArray() {
      return [counties, towns[this.multiIndex[0]]];
    }
  },

  /**
   * 生命周期函数--监听页面加载
   * @param options {id,word,ipa,pinyin}
   */
  onLoad(options) {
    // 读取页面参数
    for (let i in options) {
      this[i] = options[i];
    }

    // 如果用户设置过地理位置信息
    if (app.globalData.userInfo.county) {
      const index0fCounty = counties.indexOf(app.globalData.userInfo.county);
      const indexOfTown   = towns[index0fCounty].indexOf(app.globalData.userInfo.town);
      this.multiIndex     = [index0fCounty, indexOfTown]
    } else {
      uni.showModal({
        title: '地区tip',
        content: '在个人页面中点击头像可进入设置页面，设置地区之后默认读取到当前页面的地区项。',
        showCancel: false
      });
    }

    // 播放录音文件用
    this.innerAudioContext = uni.createInnerAudioContext();
    this.innerAudioContext.onError((res) => {
      uni.showToast({
        title: '播放失败',
        icon: 'none'
      });
    });

//ifdef H5
    // 查看是否支持本浏览器
    if (navigator.mediaDevices.getUserMedia) {
      // 尝试获取麦克风权限
      const constraints = { audio: true }
      navigator.mediaDevices.getUserMedia(constraints).then(
          // 成功回调
          stream => {
            this.recorderManager = new MediaRecorder(stream)
            let chunks = []

            // 录音开始
            this.recorderManager.onstart         = () => {
              chunks = []
            }
            // 录音过程中
            this.recorderManager.ondataavailable = function (e) {
              chunks.push(e.data)
            }
            // 录音停止
            this.recorderManager.onstop = () => {
              const blob = new Blob(chunks, { type: this.recorderManager.mimeType })
              this.setSource(window.URL.createObjectURL(blob))
            }

            this.status=0
          },
          // 失败回调
          () => {
            uni.showToast({
              title: '授权录音失败',
              icon: 'error'
            });
          }
      )
    } else {
      uni.showToast({
        title: '不支持本浏览器',
        icon: 'error'
      });
    }
//endif

//ifndef H5
    this.recorderManager = uni.getRecorderManager();
    this.recorderManager.onError(function () {
      uni.showToast({
        title: '录音失败',
        icon: 'none'
      });
    });
    this.recorderManager.onStop(function (res) {
      this.setSource(res.tempFilePath);
    });
    this.status=0
//endif
  },
  
  methods: {
    /**
     * 开始录音
     */
    startRecord() {
      if(this.status===-1){
        uni.showToast({
          title: '请先授权录音',
          icon: 'warning'
        });
        return;
      }
      this.status = 1
      uni.showToast({
        title: '正在录音...',
        icon: 'none'
      }); // 开始录音
      this.recorderManager.start();
    },

    /**
     * 停止录音
     */
    stopRecord() {
      this.status = 0
      this.recorderManager.stop();
    },

    /**
     * 设置录音文件
     * @param source {string} 录音文件路径
     */
    setSource(source) {
      this.source = source
      uni.showToast({
        title: '录音成功'
      });
    },

    /**
     * 播放录音
     */
    playMp3() {
      const src = this.source;

      if (!src) {
        uni.showToast({
          title: '请先录音',
          icon: 'error'
        });
        return;
      }

      uni.showToast({
        title: '正在播放录音...',
        icon: 'none'
      });

      this.innerAudioContext.src = src;
      this.innerAudioContext.play();
    },

    /**
     * 滑动列标签
     * @param e
     */
    columnChange(e) {
      this.multiIndex.splice(e.detail.column, 1, e.detail.value);
    },

    /**
     * 提交录音
     * @param e
     */
    submitRecord(e) {
      // 整理要提交的数据
      let pronunciation = {
        word: this.id,
        source: this.source,
        ipa: e.detail.value.ipa,
        pinyin: e.detail.value.pinyin,
        county: counties[this.multiIndex[0]],
        town: towns[this.multiIndex[0]][this.multiIndex[1]]
      };
      // 上传录音文件
      uploadFile(pronunciation.source).then(res => {
        pronunciation.source = res.url;
        request.post('/pronunciation', pronunciation).then(() => {
          uni.showToast({
            title: '语音贡献成功'
          });
          setTimeout(function () {
            uni.navigateBack({
              delta: 1
            });
          }, 500);
        }).catch(() => {
          uni.showToast({
            title: '语音贡献失败'
          });
        })
      })
    },


    /**
     * 重新录制
     */
    reRecord() {
      this.source = ''
    }
  }
};
</script>
<style>

.fileName {
  height: 10vw;
  background-color: white;
  padding: 1.8%;
  width: 77.5%;
  margin-left: 2.5%;
  margin-top: 2.5%;
  border-radius: 2vw;
  display: inline-block;
}

.extend {
  height: 10vw;
  background-color: #dbdee2;
  width: 15%;
  margin-left: 2.5%;
  margin-top: 2.5%;
  border-radius: 2vw;
  display: inline-block;
  text-align: center;
}

.record-btn {
  margin-top: 12vw;
  display: flex;
  flex-direction: column;
  align-items: center;
}
</style>
