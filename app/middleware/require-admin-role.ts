export default defineNuxtRouteMiddleware(async (_to, _from) => {
  const user = useSupabaseUser()
  const { getCurrentUserProfile } = useAuth()

  if (!user.value) {
    throw createError({
      statusCode: 401,
      statusMessage: 'Authentication required'
    })
  }

  try {
    const profile = await getCurrentUserProfile()
    
    if (!profile) {
      throw createError({
        statusCode: 403,
        statusMessage: 'User profile not found'
      })
    }

    if (profile.user_role !== 'Admin') {
      throw createError({
        statusCode: 403,
        statusMessage: 'Admin access required'
      })
    }
  } catch (error: unknown) {
    const statusCode = error && typeof error === 'object' && 'statusCode' in error ? (error.statusCode as number) : 500
    const statusMessage = error && typeof error === 'object' && 'statusMessage' in error ? (error.statusMessage as string) : 'Failed to verify admin access'
    throw createError({
      statusCode,
      statusMessage
    })
  }
})