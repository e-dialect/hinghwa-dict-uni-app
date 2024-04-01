<template>
  <view>
    <cu-custom title="详细记录" />
    <view class="container">
      <view class="header">
        <text class="title">
          {{ paper.title }}
        </text>
        <text class="timestamp">
          {{ formattedTimestamp }}
        </text>
      </view>

      <view class="quizzes">
        <view
          v-for="(quiz, index) in paper.quizzes"
          :key="index"
          class="quiz-wrapper"
        >
          <view
            class="quiz"
            @tap="toggleCollapse(index)"
          >
            <text class="question">
              {{ quiz.question }}
            </text>
            <text class="arrow">
              {{ collapsed[index] ? '▲' : '▼' }}
            </text>
          </view>
          <view
            v-show="collapsed[index]"
            class="details"
          >
            <text class="explanation">
              解析：{{ quiz.explanation }}
            </text>
            <br>
            <text class="options-title">
              选项:
            </text>
            <view
              v-for="(option, optionIndex) in quiz.options"
              :key="optionIndex"
              class="option"
            >
              <text>· {{ option }}</text>
              <text
                v-if="quiz.answer === optionIndex"
                class="correct"
              >
                [正确]
              </text>
              <text
                v-if="selectedOptions[index] === optionIndex"
                class="selected"
              >
                [您选择的]
              </text>
            </view>
          </view>
        </view>
      </view>
    </view>
  </view>
</template>

<script>
import { getRecord } from '@/services/quizset';

export default {
  data() {
    return { // 先放着演示一下
      paper: {
        id: '7890',
        title: 'MyGO知识小测验',
        quizzes: [
          {
            question: '哪首歌在MyGO团不能演奏？',
            options: ['迷星叫', '春日影', '碧天伴走', '壱雫空'],
            answer: 1,
            explanation: '为什么要演奏春日影！',
            id: 1,
            author: {
              id: 2,
              username: 'MathGenius',
              nickname: 'MathTeacher',
              email: 'math@example.com',
              telephone: '1234567890',
              birthday: '1990-01-01',
              avatar: 'https://example.com/math_teacher_avatar.jpg',
              is_admin: true,
              county: 'Example County',
              town: 'Example Town',
              points_sum: 100,
              points_now: 90,
              title: {
                title: 'Math Genius',
                color: '#FFA500',
              },
              registration_time: '2022-01-01 10:00:00',
              login_time: '2024-04-01 07:55:00',
              wechat: true,
              level: 5,
            },
            visibility: true,
            voice_source: 'math_teacher',
            type: 'single_choice',
          },
          {
            question: '长崎素世的昵称是？',
            options: ['taki', 'ano', 'soyorin', 'sakiko'],
            answer: 2,
            explanation: 'soyo',
            id: 2,
            author: {
              id: 2,
              username: 'MathGenius',
              nickname: 'MathTeacher',
              email: 'math@example.com',
              telephone: '1234567890',
              birthday: '1990-01-01',
              avatar: 'https://example.com/math_teacher_avatar.jpg',
              is_admin: true,
              county: 'Example County',
              town: 'Example Town',
              points_sum: 100,
              points_now: 90,
              title: {
                title: 'Math Genius',
                color: '#FFA500',
              },
              registration_time: '2022-01-01 10:00:00',
              login_time: '2024-04-01 07:55:00',
              wechat: true,
              level: 5,
            },
            visibility: true,
            voice_source: 'math_teacher',
            type: 'single_choice',
          },
        ],
      },
      collapsed: [],
      selectedOptions: [],
      getRecord,
    };
  },
  computed: {
    formattedTimestamp() {
      return this.paper.timestamp;
    },
  },
  methods: {
    toggleCollapse(index) {
      this.$set(this.collapsed, index, !this.collapsed[index]);
    },
  },
  onLoad() {
    const { id } = this.$route.query;
    getRecord(id).then((res) => {
      this.paper = res.paper;
    });
    this.collapsed = new Array(this.paper.quizzes.length).fill(false);
  },
};
</script>

<style>
.container {
  padding: 20rpx;
}

.header {
  display: flex;
  justify-content: space-between;
  margin-bottom: 20rpx;
}

.title {
  font-size: 45rpx;
  font-weight: bold;
  color: #39C5BB;
}

.timestamp {
  font-size: 16rpx;
  color: #999999;
}

.quiz-wrapper {
  background-color: #ffffff;
  border-radius: 10rpx;
  margin-bottom: 20rpx;
  overflow: hidden;
  box-shadow: 0 2rpx 4rpx rgba(0, 0, 0, 0.1);
}

.quiz {
  height: 120rpx;
  padding: 20rpx;
  display: flex;
  border-radius: 20rpx;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1rpx solid #dddddd;
  cursor: pointer;
}

.question {
  flex: 1;
  font-size: 35rpx;
}

.arrow {
  font-size: 20rpx;
}

.details {
  padding: 20rpx;
  background-color: #f9f9f9;
}

.explanation {
  margin-bottom: 10rpx;
  font-size: 30rpx;

}

.options-title {
  font-size: 30rpx;
  margin-bottom: 10rpx;
  color: #39C5BB;
  font-weight: bold;
  letter-spacing: 5rpx;
}

.option {
  display: flex;
  align-items: center;
  margin-bottom: 5rpx;
  font-size: 30rpx;
}

.correct {
  color: green;
  margin-left: 10rpx;
}

.selected {
  color: blue;
  margin-left: 10rpx;
}

.divider {
  margin-bottom: 30rpx;
  margin-top: 30rpx;
  background: #E0E3DA;
  width: 100%;
  height: 3rpx;
}

</style>
