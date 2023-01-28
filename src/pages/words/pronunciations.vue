<template>
  <view>
    <cu-custom title="词条发音" />
    <!--贡献语音的按钮-->
    <button
      class="cu-btn icon lg bg-blue shadow contributing-button"
      @tap="toUploadPronunciationPage(id)"
    >
      <text class="cuIcon-voice" />
    </button>
    <scroll-view
      :scroll-y="true"
      style="height: 100vh"
      @scrolltolower="loadMorePronunciations"
    >
      <uni-card :title="word.word">
        <view>
          <text
            class="text-bold text-xl"
            space="ensp"
            @tap="setClipboard(word.standard_pinyin)"
          >
            {{ word.standard_pinyin }}
          </text>
          <WordPronunciationButton
            v-if="!word.source"
            :pinyin="word.standard_pinyin"
          />
        </view>
        <view>
          <text
            class="text-grey text-xl"
            space="ensp"
            @tap="setClipboard(word.standard_ipa)"
          >
            /{{ word.standard_ipa }}/
          </text>
          <WordPronunciationButton
            :ipa="word.standard_ipa"
            :source="word.source"
          />
        </view>
      </uni-card>
      <uni-card>
        <view
          v-for="(item, index) in pronunciation"
          :key="index"
          class="padding solid-bottom"
        >
          <view class="flex justify-between align-center">
            <view>
              <view>
                <text class="text-bold">
                  {{ item.pronunciation.pinyin }}
                </text>
                <text class="text-grey">
                  {{ ` /${item.pronunciation.ipa}/ ` }}
                </text>
                <text
                  class="cuIcon-notificationfill text-blue"
                  @tap="playAudio(item.pronunciation.source)"
                />
              </view>
              <view class="margin-top">
                <text>来源：</text>
                <text
                  class="text-blue"
                  @tap="toUserPage(item.contributor.id)"
                >
                  {{ item.contributor.nickname }}
                </text>
              </view>
              <view class="margin-top">
                <text>地区：</text>
                <text>
                  {{ item.pronunciation.county }}-{{ item.pronunciation.town }}
                </text>
              </view>
            </view>
            <view class="text-xl">
              <!--  <text class="cuIcon-like" />-->
              <uni-tag
                v-if="item.pronunciation.granted===false"
                text="审核中"
                type="default"
                :inverted="true"
              />
              <uni-tag
                v-if="item.pronunciation.granted&&!item.pronunciation.visibility"
                text="未通过"
                type="error"
                :inverted="true"
              />
            </view>
          </view>
        </view>

        <uni-load-more :status="status" />
      </uni-card>
    </scroll-view>
  </view>
</template>

<script>
import { getPronunciations, getPronunciationsWithTotal } from '@/services/pronunciation';
import { getWordDetails } from '@/services/word';
import { setClipboard } from '@/utils/clipboard';
import { playAudio } from '@/utils/audio';
import { toUserPage } from '@/routers/user';
import { toUploadPronunciationPage } from '@/routers/word';
import WordPronunciationButton from '@/components/WordPronunciationButton';
import CuCustom from '@/colorui/components/cu-custom';

export default {
  name: 'WordPronunciations',
  components: { WordPronunciationButton, CuCustom },
  data() {
    return {
      id: 0,
      page: 1,
      pageSize: 8,
      order: 0,
      pronunciation: [],
      word: {
        id: 0,
        word: '',
        contributor: {
          nickname: '',
          avatar: '',
          id: 0,
        },
        standard_ipa: '',
        standard_pinyin: '',
        source: '',
      },
      status: 'more',
      total: 0,
    };
  },
  computed: {
    queries() {
      return {
        word: this.id,
        page: this.page,
        pageSize: this.pageSize,
        order: this.order,
      };
    },
  },
  methods: {
    toUploadPronunciationPage,
    toUserPage,
    playAudio,
    setClipboard,
    async loadMorePronunciations() {
      if (this.status === 'noMore') {
        return;
      }
      this.page += 1;
      this.status = 'loading';
      this.pronunciation = this.pronunciation.concat(await getPronunciations(this.queries));
      if (this.total === this.pronunciation.length) {
        this.status = 'noMore';
      } else { this.status = 'more'; }
    },
  },
  async onLoad(options) {
    this.id = Number(options.word);
    this.word = await getWordDetails(this.id);
    const p = await getPronunciationsWithTotal(this.queries);
    this.pronunciation = p.pronunciation;
    this.total = p.total;
    if (this.total === this.pronunciation.length) {
      this.status = 'noMore';
    }
  },
};
</script>

<style scoped>
.contributing-button {
  position: fixed;
  bottom: 10vh;
  right: 6vw;
  z-index: 1024;
}
</style>
