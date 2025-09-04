import type { Test } from '~/types/tests'

export const useTestsAPI = () => {
  const getAllTests = async (): Promise<Test[]> => {
    try {
      const data = await $fetch('/api/tests')
      return data as Test[]
    } catch (error) {
      throw error
    }
  }

  return {
    getAllTests
  }
}