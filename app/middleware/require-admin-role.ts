export default defineNuxtRouteMiddleware(async (to, from) => {
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
  } catch (error: any) {
    throw createError({
      statusCode: error.statusCode || 500,
      statusMessage: error.statusMessage || 'Failed to verify admin access'
    })
  }
})