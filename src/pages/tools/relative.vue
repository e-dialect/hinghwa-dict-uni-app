<template>
  <view class="kinship-page">
    <cu-custom title="亲戚计算" />
    <view class="kinship-shell">
      <view class="kinship-panel">
        <view class="kinship-toolbar">
          <view class="kinship-sex">
            <text class="kinship-muted">
              我的性别
            </text>
            <view class="kinship-sex-options">
              <button
                v-for="option in sexOptions"
                :key="option.value"
                class="kinship-sex-option"
                :class="{ 'is-active': calculatorView.explicitSex === option.value }"
                :aria-pressed="calculatorView.explicitSex === option.value"
                @tap="setSex(option.value)"
              >
                {{ option.label }}
              </button>
            </view>
          </view>
          <button
            class="kinship-help"
            aria-label="计算说明"
            :aria-expanded="helpOpen"
            @tap="helpOpen = !helpOpen"
          >
            ?
          </button>
        </view>
        <view
          v-if="helpOpen"
          class="kinship-help-panel"
        >
          <view>{{ modelNotice }}</view>
          <view class="kinship-help-line">
            最多计算 15 步。改变性别会清空路径；灰色按钮表示当前条件下不可选。人物按首次出现的步骤区分。
          </view>
          <view class="kinship-help-line">
            “待补录”表示词库绑定待确认；“待核定”表示尚未确认方言称谓，不能直接把关系角色当成词形。
          </view>
        </view>
        <view class="kinship-path">
          <view class="kinship-trail">
            <text>我</text>
            <text
              v-for="step in calculatorView.path"
              :key="step.index"
            >
              <text class="kinship-arrow">
                →
              </text>{{ pathLabel(step) }}<text
                v-if="step.partial"
                class="kinship-partial"
              >
                *
              </text>
            </text>
          </view>
          <text class="kinship-count">
            {{ calculatorView.path.length }} / {{ calculatorView.maxDepth }}
          </text>
        </view>
        <view class="kinship-controls">
          <button
            v-for="item in calculatorView.buttons"
            :key="item.field"
            :disabled="!item.enabled"
            class="kinship-control"
            @tap="advance(item.field)"
          >
            {{ item.label }}
          </button>
        </view>
        <view class="kinship-actions">
          <button
            :disabled="!calculatorView.path.length"
            @tap="goBack"
          >
            ← 撤销
          </button>
          <button @tap="clearCalculator">
            清空
          </button>
        </view>
        <view
          v-if="calculatorView.diagnostic"
          class="kinship-warning"
        >
          {{ calculatorView.diagnostic }}
        </view>
        <view
          v-else-if="calculatorView.atLimit"
          class="kinship-muted"
        >
          已满 15 步，可撤销或清空。
        </view>
        <view
          v-if="calculatorView.coverageNotice"
          class="kinship-warning"
        >
          仅列出已知人物，可能还有未收录关系。
        </view>
        <view
          v-if="calculatorView.inferenceNotice"
          class="kinship-muted"
        >
          当前分支按{{ calculatorView.inferredSex === 'male' ? '男性' : '女性' }}计算。
        </view>

        <view class="kinship-result">
          <view v-if="calculatorView.pendingChoice">
            <view class="kinship-result-label">
              请选择具体人物
            </view>
            <view class="kinship-candidates">
              <button
                v-for="item in calculatorView.candidates"
                :key="item.candidateId"
                class="kinship-candidate"
                @tap="chooseCandidate(item.candidateId)"
              >
                <view class="kinship-candidate-title">
                  {{ item.label }}
                </view>
                <view class="kinship-candidate-hint">
                  {{ candidateHint(item) }}
                </view>
                <view
                  v-if="item.condition"
                  class="kinship-candidate-hint"
                >
                  {{ item.condition }}
                </view>
              </button>
            </view>
          </view>
          <view v-else>
            <view class="kinship-result-heading">
              <text class="kinship-result-label">
                {{ calculatorView.roleLabel }}
              </text>
              <text
                v-if="identityNote"
                class="kinship-muted"
              >
                {{ identityNote }}
              </text>
            </view>
            <view
              v-if="helpOpen && calculatorView.roleNote"
              class="kinship-muted"
            >
              {{ calculatorView.roleNote }}
            </view>
            <view
              v-if="wordLoading"
              class="kinship-muted"
            >
              加载中…
            </view>
          </view>
          <WordListShowing
            :word-list="words"
            :show-contribution-invitation="true"
            :show-empty-state="false"
            :compact="true"
            @retry="retryWords"
          />
        </view>
      </view>
    </view>
  </view>
</template>

<script>
import { dataset } from '@/services/relative';
import WordListShowing from '@/components/WordListShowing.vue';
import { defaultMessage } from '@/services/shareMessages';
import { getWordDetails } from '../../services/word';
// eslint-disable-next-line import/extensions -- One ES module is shared with Web and Node tests.
import { createKinshipMixin } from '../../data/kinship/v1/vue-mixin.mjs';

export default {
  components: { WordListShowing },
  mixins: [createKinshipMixin(dataset, (id) => getWordDetails(id, { background: true }))],
  data() {
    return { helpOpen: false };
  },
  computed: {
    identityNote() {
      const item = this.calculatorView.candidates.find(
        (candidate) => candidate.candidateId === this.session.selectedCandidateId,
      );
      return item && item.firstSeenStep !== null
        && item.firstSeenStep < this.calculatorView.path.length ? this.candidateHint(item) : '';
    },
  },
  methods: {
    pathLabel(step) {
      return dataset.fields.find((field) => field.key === step.field)?.label || step.label;
    },
    candidateHint(item) {
      if (item.firstSeenStep === 0) return '起点的我';
      if (item.firstSeenStep !== null) return `第 ${item.firstSeenStep} 步出现的人物`;
      return item.identityHint.includes('其他可能') ? '另一位同称人物' : '另一种可能';
    },
  },
  onShareAppMessage() {
    return {
      title: '语记·亲戚计算',
      path: '/pages/tools/relative',
      ...defaultMessage(),
    };
  },
};
</script>

<style scoped>
.kinship-page {
  min-height: 100vh;
  background: #f4f6f9;
}
.kinship-shell {
  padding: 16px;
}
.kinship-panel {
  background: #fff;
  border-radius: 14px;
  padding: 20px 18px;
}
.kinship-toolbar, .kinship-sex, .kinship-result-heading {
  display: flex;
  align-items: center;
}
.kinship-toolbar, .kinship-result-heading {
  justify-content: space-between;
}
.kinship-sex {
  gap: 9px;
}
.kinship-muted, .kinship-count {
  color: #87909e;
  font-size: 12px;
  line-height: 1.6;
}
.kinship-sex-options {
  display: flex;
  background: #f5f7fa;
  border-radius: 6px;
  padding: 2px;
}
.kinship-sex-option {
  font-size: 11px;
  color: #8893a2;
  height: 27px;
  line-height: 27px;
  padding: 0 8px;
  margin: 0;
  background: transparent;
  border-radius: 4px;
}
.kinship-sex-option.is-active {
  background: #fff;
  color: #1989d6;
  box-shadow: 0 1px 4px #dfe6ef;
}
.kinship-help {
  width: 23px;
  height: 23px;
  line-height: 21px;
  padding: 0;
  margin: 0;
  border: 1px solid #d9e0e8;
  border-radius: 50%;
  background: transparent;
  color: #87909e;
  font-size: 12px;
}
.kinship-help-panel {
  color: #7b8593;
  background: #f6f8fb;
  border-radius: 8px;
  padding: 12px;
  margin-top: 14px;
  font-size: 11px;
  line-height: 1.7;
}
.kinship-help-line {
  margin-top: 7px;
}
.kinship-path {
  margin: 22px 0 15px;
  padding: 12px;
  border-radius: 8px;
  background: #f6f8fb;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
}
.kinship-trail {
  flex: 1;
  line-height: 1.8;
  font-size: 14px;
  color: #465264;
}
.kinship-arrow {
  color: #aab3c0;
}
.kinship-count {
  white-space: nowrap;
  font-size: 10px;
}
.kinship-partial {
  color: #a8772c;
}
.kinship-controls {
  display: grid;
  grid-template-columns: repeat(5, minmax(0, 1fr));
  gap: 9px;
}
.kinship-control {
  height: 44px;
  line-height: 44px;
  width: 100%;
  margin: 0;
  padding: 0;
  border: 1px solid #e4e9ef;
  background: #fff;
  border-radius: 8px;
  color: #39475a;
  font-size: 18px;
}
.kinship-control[disabled] {
  background: #f6f8fa;
  border-color: #f0f2f5;
  color: #c6cdd7;
}
.kinship-actions {
  display: flex;
  justify-content: flex-end;
  gap: 14px;
  padding-top: 5px;
}
.kinship-actions button {
  background: transparent;
  color: #87909e;
  font-size: 11px;
  padding: 0;
  margin: 0;
  line-height: 32px;
}
.kinship-actions button[disabled] {
  color: #c7cdd5;
}
.kinship-warning {
  color: #a8772c;
  font-size: 11px;
  line-height: 1.7;
  margin: 4px 0 10px;
}
.kinship-result {
  margin-top: 10px;
  padding-top: 18px;
  border-top: 1px solid #edf0f4;
  min-height: 110px;
}
.kinship-result-heading {
  align-items: baseline;
  gap: 8px;
}
.kinship-result-label {
  display: block;
  color: #7b8593;
  font-size: 12px;
  margin-bottom: 10px;
}
.kinship-candidates {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 8px;
}
.kinship-candidate {
  width: 100%;
  height: auto;
  margin: 0;
  padding: 11px 12px;
  line-height: 1.6;
  text-align: left;
  background: #fff;
  border: 1px solid #e4e9ef;
  border-radius: 8px;
  white-space: normal;
}
.kinship-candidate-title {
  color: #39475a;
  font-size: 14px;
  font-weight: 600;
  margin-bottom: 3px;
}
.kinship-candidate-hint {
  color: #87909e;
  font-size: 10px;
}
button::after {
  border: none;
}
</style>
