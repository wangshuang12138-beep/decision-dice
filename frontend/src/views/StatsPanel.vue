<template>
  <div class="stats-panel">
    <div class="stats-grid">
      <div class="stat-card">
        <div class="stat-icon">🎲</div>
        <div class="stat-value">{{ totalDecisions }}</div>
        <div class="stat-label">总决策数</div>
      </div>

      <div class="stat-card">
        <div class="stat-icon">🤖</div>
        <div class="stat-value">{{ aiDecisions }}</div>
        <div class="stat-label">AI 辅助</div>
      </div>

      <div class="stat-card">
        <div class="stat-icon">👍</div>
        <div class="stat-value">{{ goodRate }}%</div>
        <div class="stat-label">满意率</div>
      </div>

      <div class="stat-card">
        <div class="stat-icon">📊</div>
        <div class="stat-value">{{ reviewedRate }}%</div>
        <div class="stat-label">复盘率</div>
      </div>
    </div>

    <!-- 复盘分布 -->
    <div v-if="reviewedDecisions > 0" class="review-distribution">
      <h3>📈 复盘分布</h3>
      
      <div class="distribution-bars">
        <div class="dist-item">
          <span class="dist-label">👍 很赞</span>
          <div class="dist-bar">
            <div 
              class="dist-fill good"
              :style="{ width: goodPercent + '%' }"
            />
          </div>
          <span class="dist-value">{{ goodCount }}</span>
        </div>
        
        <div class="dist-item">
          <span class="dist-label">🤷 一般</span>
          <div class="dist-bar">
            <div 
              class="dist-fill neutral"
              :style="{ width: neutralPercent + '%' }"
            />
          </div>
          <span class="dist-value">{{ neutralCount }}</span>
        </div>
        
        <div class="dist-item">
          <span class="dist-label">👎 后悔</span>
          <div class="dist-bar">
            <div 
              class="dist-fill bad"
              :style="{ width: badPercent + '%' }"
            />
          </div>
          <span class="dist-value">{{ badCount }}</span>
        </div>
      </div>
    </div>

    <!-- 最近活动 -->
    <div v-if="recentActivity.length > 0" class="recent-activity">
      <h3>📅 最近 7 天活动</h3>
      
      <div class="activity-chart">
        <div 
          v-for="day in recentActivity" 
          :key="day.date"
          class="activity-day"
        >
          <div 
            class="activity-bar"
            :style="{ height: Math.max(day.count * 20, 4) + 'px' }"
          />
          <span class="activity-label">{{ day.label }}</span>
          <span v-if="day.count > 0" class="activity-count">{{ day.count }}</span>
        </div>
      </div>
    </div>

    <div v-if="totalDecisions === 0" class="empty-stats">
      <div class="empty-icon">📊</div>
      <p>还没有统计数据</p>
      <p class="empty-hint">多做一些决策，这里会显示有趣的统计</p>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useDecisionStore } from '../stores/decision'

const store = useDecisionStore()
const decisions = computed(() => store.decisions)

const totalDecisions = computed(() => decisions.value.length)

const aiDecisions = computed(() => {
  return decisions.value.filter(d => d.method === 'AI 辅助 + 随机').length
})

const reviewedDecisions = computed(() => {
  return decisions.value.filter(d => d.reviewed).length
})

const reviewedRate = computed(() => {
  if (totalDecisions.value === 0) return 0
  return Math.round((reviewedDecisions.value / totalDecisions.value) * 100)
})

const goodCount = computed(() => {
  return decisions.value.filter(d => d.review === 'good').length
})

const badCount = computed(() => {
  return decisions.value.filter(d => d.review === 'bad').length
})

const neutralCount = computed(() => {
  return decisions.value.filter(d => d.review === 'neutral').length
})

const goodRate = computed(() => {
  if (reviewedDecisions.value === 0) return 0
  return Math.round((goodCount.value / reviewedDecisions.value) * 100)
})

const goodPercent = computed(() => {
  if (reviewedDecisions.value === 0) return 0
  return (goodCount.value / reviewedDecisions.value) * 100
})

const badPercent = computed(() => {
  if (reviewedDecisions.value === 0) return 0
  return (badCount.value / reviewedDecisions.value) * 100
})

const neutralPercent = computed(() => {
  if (reviewedDecisions.value === 0) return 0
  return (neutralCount.value / reviewedDecisions.value) * 100
})

const recentActivity = computed(() => {
  const days = []
  const today = new Date()
  
  for (let i = 6; i >= 0; i--) {
    const date = new Date(today)
    date.setDate(date.getDate() - i)
    
    const dateStr = date.toDateString()
    const count = decisions.value.filter(d => 
      new Date(d.time).toDateString() === dateStr
    ).length
    
    const label = i === 0 ? '今天' : i === 1 ? '昨天' : `${date.getMonth() + 1}/${date.getDate()}`
    
    days.push({ date: dateStr, label, count })
  }
  
  return days
})
</script>

<style scoped>
.stats-panel {
  max-width: 600px;
  margin: 0 auto;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 16px;
  margin-bottom: 32px;
}

.stat-card {
  background: var(--surface);
  border-radius: var(--radius);
  padding: 24px;
  text-align: center;
  box-shadow: var(--shadow);
}

.stat-icon {
  font-size: 32px;
  margin-bottom: 8px;
}

.stat-value {
  font-size: 36px;
  font-weight: 700;
  color: var(--primary);
  margin-bottom: 4px;
}

.stat-label {
  font-size: 13px;
  color: var(--text-secondary);
}

.review-distribution,
.recent-activity {
  background: var(--surface);
  border-radius: var(--radius);
  padding: 24px;
  margin-bottom: 24px;
  box-shadow: var(--shadow);
}

.review-distribution h3,
.recent-activity h3 {
  font-size: 16px;
  font-weight: 600;
  margin-bottom: 20px;
  color: var(--text);
}

.distribution-bars {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.dist-item {
  display: flex;
  align-items: center;
  gap: 12px;
}

.dist-label {
  width: 80px;
  font-size: 14px;
  color: var(--text);
  flex-shrink: 0;
}

.dist-bar {
  flex: 1;
  height: 24px;
  background: var(--bg);
  border-radius: 12px;
  overflow: hidden;
}

.dist-fill {
  height: 100%;
  border-radius: 12px;
  transition: width 0.5s ease;
}

.dist-fill.good {
  background: var(--success);
}

.dist-fill.neutral {
  background: #9CA3AF;
}

.dist-fill.bad {
  background: #EF4444;
}

.dist-value {
  width: 40px;
  text-align: right;
  font-size: 14px;
  font-weight: 600;
  color: var(--text);
}

.activity-chart {
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  height: 120px;
  padding: 20px 0;
}

.activity-day {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  flex: 1;
}

.activity-bar {
  width: 24px;
  background: linear-gradient(to top, var(--primary), #8B5CF6);
  border-radius: 4px 4px 0 0;
  min-height: 4px;
  transition: height 0.3s ease;
}

.activity-label {
  font-size: 12px;
  color: var(--text-secondary);
}

.activity-count {
  font-size: 11px;
  font-weight: 600;
  color: var(--primary);
}

.empty-stats {
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

@media (max-width: 640px) {
  .stats-grid {
    grid-template-columns: repeat(2, 1fr);
    gap: 12px;
  }

  .stat-card {
    padding: 16px;
  }

  .stat-value {
    font-size: 28px;
  }
}
</style>
