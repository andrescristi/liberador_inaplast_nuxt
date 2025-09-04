export interface Test {
  id: number
  created_at: string
  name: string
  type: 'visual' | 'funcional'
}

export interface TestResult {
  testId: number
  passed: boolean
  notes?: string
}