<template>
  <div class="history-panel">
    <div v-if="decisions.length === 0" class="empty-state">
      <div class="empty-icon">📭</div>
      <p>还没有决策记录</p>
      <p class="empty-hint">去「做决定」标签页创建你的第一个决策吧</p>
    </div>

    <div v-else class="decision-list">
      <div 
        v-for="decision in sortedDecisions" 
        :key="decision.id"
        class="decision-card"
        :class="{ reviewed: decision.reviewed }"
      >
        <div class="decision-header">
          <span class="decision-time">{{ formatDate(decision.time) }}</span>
          <span :class="['method-badge', decision.method === 'AI 辅助 + 随机' ? 'ai' : 'random']">
            {{ decision.method }}
          </span>
        </div>

        <div v-if="decision.question" class="decision-question">
          {{ decision.question }}
        </div>

        <div class="decision-winner">
          <span class="winner-label">结果：</span>
          <span class="winner-value">{{ decision.winner }}</span>
        </div>

        <div class="decision-options">
          <span class="options-label">选项：</span>
          <span class="options-value">{{ decision.options.join('、') }}</span>
        </div>

        <div v-if="decision.reviewed" class="decision-review">
          <span :class="['review-badge', decision.review]">
            {{ reviewText(decision.review) }}
          </span>
        </div>
        <div v-else class="decision-review pending">
          <span class="review-badge">🤔 待复盘</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useDecisionStore } from '../stores/decision'

const store = useDecisionStore()
const decisions = computed(() => store.decisions)

const sortedDecisions = computed(() => {
  return [...decisions.value].sort((a, b) => new Date(b.time) - new Date(a.time))
})

const formatDate = (date) => {
  const d = new Date(date)
  const now = new Date()
  const isToday = d.toDateString() === now.toDateString()
  
  if (isToday) {
    return `今天 ${d.getHours().toString().padStart(2, '0')}:${d.getMinutes().toString().padStart(2, '0')}`
  }
  
  return `${d.getMonth() + 1}月${d.getDate()}日 ${d.getHours().toString().padStart(2, '0')}:${d.getMinutes().toString().padStart(2, '0')}`
}

const reviewText = (review) => {
  const map = { good: '👍 很赞', bad: '👎 后悔了', neutral: '🤷 一般' }
  return map[review] || review
}
</script>

<style scoped>
.history-panel {
  max-width: 600px;
  margin: 0 auto;
}

.empty-state {
  text-align: center;
  padding: 80px 20px;
  color: var(--text-secondary);
}

.empty-icon {
  font-size: 64px;
  margin-bottom: 16px;
}

.empty-hint {
  font-size: 14px;
  margin-top: 8px;
  opacity: 0.7;
}

.decision-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.decision-card {
  background: var(--surface);
  border-radius: var(--radius);
  padding: 20px;
  box-shadow: var(--shadow);
  border-left: 4px solid var(--border);
  transition: all 0.2s;
}

.decision-card:hover {
  transform: translateX(4px);
  box-shadow: var(--shadow-lg);
}

.decision-card.reviewed {
  border-left-color: var(--success);
}

.decision-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
}

.decision-time {
  font-size: 13px;
  color: var(--text-secondary);
}

.method-badge {
  font-size: 11px;
  padding: 4px 10px;
  border-radius: 20px;
  font-weight: 500;
}

.method-badge.ai {
  background: var(--primary-light);
  color: var(--primary);
}

.method-badge.random {
  background: #F3F4F6;
  color: #6B7280;
}

.decision-question {
  font-size: 15px;
  font-weight: 600;
  color: var(--text);
  margin-bottom: 12px;
  padding-bottom: 12px;
  border-bottom: 1px solid var(--border);
}

.decision-winner {
  margin-bottom: 8px;
}

.winner-label {
  font-size: 13px;
  color: var(--text-secondary);
}

.winner-value {
  font-size: 16px;
  font-weight: 600;
  color: var(--success);
}

.decision-options {
  margin-bottom: 12px;
}

.options-label {
  font-size: 13px;
  color: var(--text-secondary);
}

.options-value {
  font-size: 13px;
  color: var(--text);
}

.decision-review {
  margin-top: 12px;
  padding-top: 12px;
  border-top: 1px solid var(--border);
}

.review-badge {
  font-size: 13px;
  padding: 6px 12px;
  border-radius: 20px;
  background: #F3F4F6;
  color: #6B7280;
}

.review-badge.good {
  background: #D1FAE5;
  color: #065F46;
}

.review-badge.bad {
  background: #FEE2E2;
  color: #991B1B;
}

.review-badge.neutral {
  background: #F3F4F6;
  color: #4B5563;
}

.decision-review.pending .review-badge {
  background: #FEF3C7;
  color: #92400E;
}
</style>
