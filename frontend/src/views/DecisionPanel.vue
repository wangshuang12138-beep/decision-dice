<template>
  <div class="decision-panel">
    <!-- 问题输入 -->
    <div class="card question-card">
      <label class="label">你在纠结什么？</label>
      <textarea 
        v-model="question"
        placeholder="例如：今晚吃 pizza 还是火锅？要不要辞职？周末去爬山还是看电影？"
        class="textarea"
        rows="2"
      />
    </div>

    <!-- 选项列表 -->
    <div class="card options-card">
      <div class="card-header">
        <label class="label">选项</label>
        <span class="hint">{{ options.length }} 个选项</span>
      </div>
      
      <div class="options-list">
        <div 
          v-for="(option, index) in options" 
          :key="index"
          class="option-item"
        >
          <span class="option-number">{{ index + 1 }}</span>
          <input 
            v-model="options[index]"
            :placeholder="`选项 ${index + 1}`"
            class="option-input"
          />
          <button 
            v-if="options.length > 2"
            class="btn-remove"
            @click="removeOption(index)"
          >
            ✕
          </button>
        </div>
      </div>
      
      <button class="btn-add" @click="addOption">
        + 添加选项
      </button>
    </div>

    <!-- AI 分析开关 -->
    <div class="ai-toggle">
      <label class="toggle-label">
        <input 
          v-model="useAI"
          type="checkbox"
          class="toggle-input"
        />
        <span class="toggle-text">🤖 让 AI 分析利弊（需要配置 API Key）</span>
      </label>
    </div>

    <!-- 做决定按钮 -->
    <button 
      class="btn-decide"
      :disabled="!canDecide || deciding"
      @click="makeDecision"
    >
      <span v-if="deciding" class="deciding-text">🎲 决策中...</span>
      <span v-else>🎲 帮我做决定</span>
    </button>

    <!-- 结果展示 -->
    <div v-if="result" class="result-card">
      <div class="result-header">
        <span class="result-label">决策结果</span>
        <span class="result-time">{{ formatTime(result.time) }}</span>
      </div>
      
      <div class="result-winner">
        <span class="winner-emoji">🎯</span>
        <span class="winner-text">{{ result.winner }}</span>
      </div>

      <!-- AI 分析结果 -->
      <div v-if="result.aiAnalysis" class="ai-analysis">
        <h4>🤖 AI 分析</h4>
        <div class="analysis-content">{{ result.aiAnalysis }}</div>
      </div>

      <!-- 决策详情 -->
      <div class="result-details">
        <div class="detail-item">
          <span class="detail-label">问题：</span>
          <span class="detail-value">{{ result.question || '未填写' }}</span>
        </div>
        <div class="detail-item">
          <span class="detail-label">所有选项：</span>
          <span class="detail-value">{{ result.options.join('、') }}</span>
        </div>
        <div class="detail-item">
          <span class="detail-label">决策方式：</span>
          <span class="detail-value">{{ result.method }}</span>
        </div>
      </div>

      <!-- 复盘 -->
      <div v-if="!result.reviewed" class="review-section">
        <p class="review-question">这个决策结果如何？</p>
        <div class="review-buttons">
          <button class="btn-review good" @click="reviewDecision('good')">
            👍 很赞
          </button>
          <button class="btn-review bad" @click="reviewDecision('bad')">
            👎 后悔了
          </button>
          <button class="btn-review neutral" @click="reviewDecision('neutral')">
            🤷 一般
          </button>
        </div>
      </div>
      
      <div v-else class="review-result">
        <span :class="['review-badge', result.review]">
          {{ reviewText(result.review) }}
        </span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useDecisionStore } from '../stores/decision'

const store = useDecisionStore()

const question = ref('')
const options = ref(['', ''])
const useAI = ref(false)
const deciding = ref(false)
const result = ref(null)

const canDecide = computed(() => {
  return options.value.filter(o => o.trim()).length >= 2
})

const addOption = () => {
  if (options.value.length < 8) {
    options.value.push('')
  }
}

const removeOption = (index) => {
  options.value.splice(index, 1)
}

const makeDecision = async () => {
  const validOptions = options.value.filter(o => o.trim())
  if (validOptions.length < 2) return

  deciding.value = true
  result.value = null

  // 模拟决策动画延迟
  await new Promise(r => setTimeout(r, 1500))

  // 随机选择
  const winnerIndex = Math.floor(Math.random() * validOptions.length)
  const winner = validOptions[winnerIndex]

  let aiAnalysis = null
  if (useAI.value) {
    aiAnalysis = await store.getAIAnalysis(question.value, validOptions, winner)
  }

  result.value = {
    id: Date.now(),
    question: question.value,
    options: validOptions,
    winner,
    method: useAI.value ? 'AI 辅助 + 随机' : '纯随机',
    aiAnalysis,
    time: new Date(),
    reviewed: false
  }

  // 保存到历史
  store.addDecision(result.value)
  
  deciding.value = false
}

const reviewDecision = (review) => {
  if (result.value) {
    result.value.review = review
    result.value.reviewed = true
    store.updateDecision(result.value)
  }
}

const formatTime = (date) => {
  if (!date) return ''
  const d = new Date(date)
  return `${d.getHours().toString().padStart(2, '0')}:${d.getMinutes().toString().padStart(2, '0')}`
}

const reviewText = (review) => {
  const map = { good: '👍 很赞', bad: '👎 后悔了', neutral: '🤷 一般' }
  return map[review] || review
}
</script>

<style scoped>
.decision-panel {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.card {
  background: var(--surface);
  border-radius: var(--radius);
  padding: 24px;
  box-shadow: var(--shadow);
}

.label {
  display: block;
  font-size: 14px;
  font-weight: 600;
  color: var(--text);
  margin-bottom: 12px;
}

.textarea {
  width: 100%;
  padding: 16px;
  border: 2px solid var(--border);
  border-radius: 12px;
  font-size: 16px;
  font-family: inherit;
  resize: vertical;
  transition: border-color 0.2s;
}

.textarea:focus {
  outline: none;
  border-color: var(--primary);
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}

.hint {
  font-size: 13px;
  color: var(--text-secondary);
}

.options-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin-bottom: 16px;
}

.option-item {
  display: flex;
  align-items: center;
  gap: 12px;
}

.option-number {
  width: 28px;
  height: 28px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--primary-light);
  color: var(--primary);
  border-radius: 50%;
  font-size: 13px;
  font-weight: 600;
  flex-shrink: 0;
}

.option-input {
  flex: 1;
  padding: 12px 16px;
  border: 2px solid var(--border);
  border-radius: 12px;
  font-size: 15px;
  font-family: inherit;
  transition: border-color 0.2s;
}

.option-input:focus {
  outline: none;
  border-color: var(--primary);
}

.btn-remove {
  width: 36px;
  height: 36px;
  border: none;
  background: transparent;
  color: var(--text-secondary);
  font-size: 18px;
  cursor: pointer;
  border-radius: 8px;
  transition: all 0.2s;
}

.btn-remove:hover {
  background: #FEE2E2;
  color: #EF4444;
}

.btn-add {
  width: 100%;
  padding: 12px;
  border: 2px dashed var(--border);
  border-radius: 12px;
  background: transparent;
  color: var(--text-secondary);
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
}

.btn-add:hover {
  border-color: var(--primary);
  color: var(--primary);
  background: var(--primary-light);
}

.ai-toggle {
  padding: 0 4px;
}

.toggle-label {
  display: flex;
  align-items: center;
  gap: 12px;
  cursor: pointer;
}

.toggle-input {
  width: 20px;
  height: 20px;
  accent-color: var(--primary);
}

.toggle-text {
  font-size: 14px;
  color: var(--text-secondary);
}

.btn-decide {
  padding: 20px 32px;
  border: none;
  border-radius: var(--radius-lg);
  background: linear-gradient(135deg, var(--primary), #8B5CF6);
  color: white;
  font-size: 18px;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.3s;
  box-shadow: 0 4px 20px rgba(99, 102, 241, 0.3);
}

.btn-decide:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 8px 30px rgba(99, 102, 241, 0.4);
}

.btn-decide:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.deciding-text {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  animation: pulse 1s infinite;
}

@keyframes pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.6; }
}

.result-card {
  background: linear-gradient(135deg, #F0FDF4, #ECFDF5);
  border: 2px solid var(--success);
  border-radius: var(--radius-lg);
  padding: 24px;
  animation: slideIn 0.5s ease;
}

@keyframes slideIn {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.result-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}

.result-label {
  font-size: 13px;
  font-weight: 600;
  color: var(--success);
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.result-time {
  font-size: 13px;
  color: var(--text-secondary);
}

.result-winner {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
  padding: 24px;
  margin-bottom: 20px;
}

.winner-emoji {
  font-size: 40px;
}

.winner-text {
  font-size: 28px;
  font-weight: 700;
  color: var(--text);
}

.ai-analysis {
  background: var(--surface);
  border-radius: 12px;
  padding: 16px;
  margin-bottom: 20px;
}

.ai-analysis h4 {
  font-size: 14px;
  font-weight: 600;
  color: var(--text);
  margin-bottom: 8px;
}

.analysis-content {
  font-size: 14px;
  color: var(--text-secondary);
  line-height: 1.6;
  white-space: pre-wrap;
}

.result-details {
  background: var(--surface);
  border-radius: 12px;
  padding: 16px;
  margin-bottom: 20px;
}

.detail-item {
  display: flex;
  gap: 8px;
  padding: 8px 0;
  border-bottom: 1px solid var(--border);
}

.detail-item:last-child {
  border-bottom: none;
}

.detail-label {
  font-size: 13px;
  color: var(--text-secondary);
  flex-shrink: 0;
}

.detail-value {
  font-size: 13px;
  color: var(--text);
}

.review-section {
  text-align: center;
  padding-top: 16px;
  border-top: 1px solid rgba(0,0,0,0.1);
}

.review-question {
  font-size: 14px;
  color: var(--text-secondary);
  margin-bottom: 12px;
}

.review-buttons {
  display: flex;
  gap: 12px;
  justify-content: center;
}

.btn-review {
  padding: 10px 20px;
  border: 2px solid var(--border);
  border-radius: 12px;
  background: var(--surface);
  font-size: 14px;
  cursor: pointer;
  transition: all 0.2s;
}

.btn-review:hover {
  border-color: var(--primary);
  background: var(--primary-light);
}

.review-result {
  text-align: center;
  padding-top: 16px;
  border-top: 1px solid rgba(0,0,0,0.1);
}

.review-badge {
  display: inline-block;
  padding: 8px 16px;
  border-radius: 20px;
  font-size: 14px;
  font-weight: 500;
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

@media (max-width: 640px) {
  .card {
    padding: 20px;
  }

  .winner-text {
    font-size: 22px;
  }

  .review-buttons {
    flex-direction: column;
  }

  .btn-review {
    width: 100%;
  }
}
</style>
