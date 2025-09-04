import type { Test } from '~/types/tests'

export const useTestsAPI = () => {
  const getAllTests = async (): Promise<Test[]> => {
    const data = await $fetch('/api/tests')
    return data as Test[]
  }

  return {
    getAllTests
  }
}