import { defineStore } from 'pinia'
import { ref, watch } from 'vue'

const STORAGE_KEY = 'decision-dice-data'

const loadFromStorage = () => {
  try {
    const data = localStorage.getItem(STORAGE_KEY)
    return data ? JSON.parse(data) : { decisions: [] }
  } catch {
    return { decisions: [] }
  }
}

const saveToStorage = (data) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data))
}

// Kimi API configuration
const KIMI_API_URL = 'https://api.moonshot.cn/v1/chat/completions'
const KIMI_MODEL = 'kimi-coding/k2p5'

export const useDecisionStore = defineStore('decision', () => {
  const data = loadFromStorage()
  const decisions = ref(data.decisions || [])
  const apiKey = ref(localStorage.getItem('decision-dice-api-key') || '')

  // Watch and save to localStorage
  watch(decisions, (newVal) => {
    saveToStorage({ decisions: newVal })
  }, { deep: true })

  const setApiKey = (key) => {
    apiKey.value = key
    localStorage.setItem('decision-dice-api-key', key)
  }

  const addDecision = (decision) => {
    decisions.value.unshift(decision)
    // Keep only last 100 decisions
    if (decisions.value.length > 100) {
      decisions.value = decisions.value.slice(0, 100)
    }
  }

  const updateDecision = (updated) => {
    const idx = decisions.value.findIndex(d => d.id === updated.id)
    if (idx >= 0) {
      decisions.value[idx] = updated
    }
  }

  const getAIAnalysis = async (question, options, winner) => {
    if (!apiKey.value) {
      return '未配置 API Key，请在设置中添加'
    }

    const prompt = `你在帮用户做一个决策分析。

问题：${question || '未指定具体问题'}
选项：${options.join('、')}
随机选中的结果：${winner}

请简要分析：
1. 为什么这个选择可能是好的
2. 如果这个选择最终不好，可能的替代方案是什么
3. 给一句鼓励的话

保持简短，100字以内。`

    try {
      const response = await fetch(KIMI_API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey.value}`
        },
        body: JSON.stringify({
          model: KIMI_MODEL,
          messages: [
            { role: 'system', content: '你是一个帮助用户做决策的助手，提供简短而中肯的分析。' },
            { role: 'user', content: prompt }
          ],
          temperature: 0.7,
          max_tokens: 200
        })
      })

      if (!response.ok) {
        throw new Error('API request failed')
      }

      const data = await response.json()
      return data.choices[0]?.message?.content || '分析失败'
    } catch (err) {
      console.error('AI analysis error:', err)
      return 'AI 分析暂时不可用，请检查 API Key 或稍后重试'
    }
  }

  const clearAllData = () => {
    decisions.value = []
    localStorage.removeItem(STORAGE_KEY)
  }

  return {
    decisions,
    apiKey,
    setApiKey,
    addDecision,
    updateDecision,
    getAIAnalysis,
    clearAllData
  }
})
