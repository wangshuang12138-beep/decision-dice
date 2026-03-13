<template>
  <div class="app">
    <header class="header">
      <div class="header-content">
        <div class="logo">
          <span class="logo-icon">🎲</span>
          <span class="logo-text">决策骰子</span>
        </div>
        <nav class="nav">
          <button 
            v-for="tab in tabs" 
            :key="tab.id"
            class="nav-btn"
            :class="{ active: currentTab === tab.id }"
            @click="currentTab = tab.id"
          >
            {{ tab.name }}
          </button>
        </nav>
      </div>
    </header>

    <main class="main">
      <DecisionPanel v-if="currentTab === 'decide'" />
      <HistoryPanel v-if="currentTab === 'history'" />
      <StatsPanel v-if="currentTab === 'stats'" />
    </main>

    <footer class="footer">
      <p>🎲 让随机帮你做决定 · Decision Dice</p>
    </footer>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import DecisionPanel from './views/DecisionPanel.vue'
import HistoryPanel from './views/HistoryPanel.vue'
import StatsPanel from './views/StatsPanel.vue'

const currentTab = ref('decide')

const tabs = [
  { id: 'decide', name: '🎯 做决定' },
  { id: 'history', name: '📜 历史' },
  { id: 'stats', name: '📊 统计' }
]
</script>

<style>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

:root {
  --primary: #6366F1;
  --primary-hover: #4F46E5;
  --primary-light: #EEF2FF;
  --bg: #F8FAFC;
  --surface: #FFFFFF;
  --text: #1E293B;
  --text-secondary: #64748B;
  --border: #E2E8F0;
  --success: #10B981;
  --warning: #F59E0B;
  --radius: 16px;
  --radius-lg: 24px;
  --shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  --shadow-lg: 0 10px 40px rgba(0, 0, 0, 0.1);
}

body {
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
  background: var(--bg);
  color: var(--text);
  line-height: 1.6;
  -webkit-font-smoothing: antialiased;
}

.app {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

.header {
  background: var(--surface);
  border-bottom: 1px solid var(--border);
  position: sticky;
  top: 0;
  z-index: 100;
}

.header-content {
  max-width: 800px;
  margin: 0 auto;
  padding: 16px 24px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 24px;
}

.logo {
  display: flex;
  align-items: center;
  gap: 12px;
}

.logo-icon {
  font-size: 28px;
}

.logo-text {
  font-size: 20px;
  font-weight: 700;
  background: linear-gradient(135deg, var(--primary), #8B5CF6);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

.nav {
  display: flex;
  gap: 8px;
}

.nav-btn {
  padding: 8px 16px;
  border: none;
  border-radius: 12px;
  background: transparent;
  color: var(--text-secondary);
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
}

.nav-btn:hover {
  background: var(--bg);
  color: var(--text);
}

.nav-btn.active {
  background: var(--primary-light);
  color: var(--primary);
}

.main {
  flex: 1;
  max-width: 800px;
  width: 100%;
  margin: 0 auto;
  padding: 32px 24px;
}

.footer {
  text-align: center;
  padding: 24px;
  color: var(--text-secondary);
  font-size: 14px;
}

@media (max-width: 640px) {
  .header-content {
    flex-direction: column;
    gap: 16px;
    padding: 16px;
  }

  .main {
    padding: 20px 16px;
  }
}
</style>
