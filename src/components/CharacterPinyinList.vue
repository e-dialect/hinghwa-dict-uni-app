<template>
  <view
    class="bg-white cu-list"
  >
    <view
      v-for="(character, characterIndex) in characters"
      :key="characterIndex"
      class="cu-item"
    >
      <view
        v-for="(location, locationIndex) in character.characters"
        :key="locationIndex"
        class="padding solid-bottom"
      >
        <!--条目标题-->
        <view class="flex justify-between align-center">
          <!--字-->
          <view>
            <text class="text-xxl text-black text-bold">
              {{ character.label }}
            </text>
            <text
              v-if="character.label !== character.traditional"
              class="text-xl"
            >
              {{ character.traditional }}
            </text>
          </view>
          <!--位置-->
          <view class="text-grey">
            {{ location.county }} / {{ location.town }}
          </view>
        </view>

        <!--具体每个发音-->
        <view class="text-lg margin-top-xs flex flex-wrap">
          <view
            v-for="(record, recordIndex) in location.characters"
            :key="recordIndex"
            style="display: flex;width: 50%;"
            @tap="playAudio(record.source,false)"
          >
            <!--拼音-->
            <view>
              <!--这个字的这个发音有对应词语-->
              <view
                v-if="record.word"
                class="text-blue"
                space="emsp"
                style="width: 40%;"
                @tap.stop="toWordPage(record.word)"
              >
                {{ record.pinyin }}
              </view>
              <!--没有对应词语-->
              <view
                v-else
                space="emsp"
                style="width: 40%;"
              >
                {{ record.pinyin }}
              </view>
            </view>
            <!--IPA-->
            <view
              class="text-grey"
              space="emsp"
              style="width: 60%;"
            >
              /{{ record.ipa }}/
            </view>
          </view>
        </view>
      </view>
    </view>
  </view>
</template>

<script>
import { playAudio } from '@/utils/audio';
import { toWordPage } from '@/routers/word';

export default {
  name: 'CharacterPinyinList',
  props: {
    characters: {
      type: Array,
      default: () => [],
    },
  },
  methods: { toWordPage, playAudio },
};
</script>

<style scoped>

</style>
