
import type { DefineComponent, SlotsType } from 'vue'
type IslandComponent<T extends DefineComponent> = T & DefineComponent<{}, {refresh: () => Promise<void>}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, SlotsType<{ fallback: { error: unknown } }>>
type HydrationStrategies = {
  hydrateOnVisible?: IntersectionObserverInit | true
  hydrateOnIdle?: number | true
  hydrateOnInteraction?: keyof HTMLElementEventMap | Array<keyof HTMLElementEventMap> | true
  hydrateOnMediaQuery?: string
  hydrateAfter?: number
  hydrateWhen?: boolean
  hydrateNever?: true
}
type LazyComponent<T> = (T & DefineComponent<HydrationStrategies, {}, {}, {}, {}, {}, {}, { hydrated: () => void }>)
interface _GlobalComponents {
      'CoreAppNavigation': typeof import("../app/components/core/AppNavigation.vue")['default']
    'FeedbackConfettiCelebration': typeof import("../app/components/feedback/ConfettiCelebration.vue")['default']
    'FeedbackSuccessCelebration': typeof import("../app/components/feedback/SuccessCelebration.vue")['default']
    'FormsCustomerForm': typeof import("../app/components/forms/CustomerForm.vue")['default']
    'FormsOrderForm': typeof import("../app/components/forms/OrderForm.vue")['default']
    'FormsProductForm': typeof import("../app/components/forms/ProductForm.vue")['default']
    'UiBaseAlert': typeof import("../app/components/ui/BaseAlert.vue")['default']
    'UiBaseBadge': typeof import("../app/components/ui/BaseBadge.vue")['default']
    'UiBaseButton': typeof import("../app/components/ui/BaseButton.vue")['default']
    'UiBaseCard': typeof import("../app/components/ui/BaseCard.vue")['default']
    'UiBaseDropdown': typeof import("../app/components/ui/BaseDropdown.vue")['default']
    'UiBaseInput': typeof import("../app/components/ui/BaseInput.vue")['default']
    'UiBaseModal': typeof import("../app/components/ui/BaseModal.vue")['default']
    'UiBaseTable': typeof import("../app/components/ui/BaseTable.vue")['default']
    'UiToastContainer': typeof import("../app/components/ui/ToastContainer.vue")['default']
    'UiToastNotification': typeof import("../app/components/ui/ToastNotification.vue")['default']
    'NuxtWelcome': typeof import("../node_modules/nuxt/dist/app/components/welcome.vue")['default']
    'NuxtLayout': typeof import("../node_modules/nuxt/dist/app/components/nuxt-layout")['default']
    'NuxtErrorBoundary': typeof import("../node_modules/nuxt/dist/app/components/nuxt-error-boundary.vue")['default']
    'ClientOnly': typeof import("../node_modules/nuxt/dist/app/components/client-only")['default']
    'DevOnly': typeof import("../node_modules/nuxt/dist/app/components/dev-only")['default']
    'ServerPlaceholder': typeof import("../node_modules/nuxt/dist/app/components/server-placeholder")['default']
    'NuxtLink': typeof import("../node_modules/nuxt/dist/app/components/nuxt-link")['default']
    'NuxtLoadingIndicator': typeof import("../node_modules/nuxt/dist/app/components/nuxt-loading-indicator")['default']
    'NuxtTime': typeof import("../node_modules/nuxt/dist/app/components/nuxt-time.vue")['default']
    'NuxtRouteAnnouncer': typeof import("../node_modules/nuxt/dist/app/components/nuxt-route-announcer")['default']
    'NuxtImg': typeof import("../node_modules/nuxt/dist/app/components/nuxt-stubs")['NuxtImg']
    'NuxtPicture': typeof import("../node_modules/nuxt/dist/app/components/nuxt-stubs")['NuxtPicture']
    'ErrorMessage': typeof import("vee-validate")['ErrorMessage']
    'Field': typeof import("vee-validate")['Field']
    'FieldArray': typeof import("vee-validate")['FieldArray']
    'Form': typeof import("vee-validate")['Form']
    'NuxtPage': typeof import("../node_modules/nuxt/dist/pages/runtime/page")['default']
    'NoScript': typeof import("../node_modules/nuxt/dist/head/runtime/components")['NoScript']
    'Link': typeof import("../node_modules/nuxt/dist/head/runtime/components")['Link']
    'Base': typeof import("../node_modules/nuxt/dist/head/runtime/components")['Base']
    'Title': typeof import("../node_modules/nuxt/dist/head/runtime/components")['Title']
    'Meta': typeof import("../node_modules/nuxt/dist/head/runtime/components")['Meta']
    'Style': typeof import("../node_modules/nuxt/dist/head/runtime/components")['Style']
    'Head': typeof import("../node_modules/nuxt/dist/head/runtime/components")['Head']
    'Html': typeof import("../node_modules/nuxt/dist/head/runtime/components")['Html']
    'Body': typeof import("../node_modules/nuxt/dist/head/runtime/components")['Body']
    'NuxtIsland': typeof import("../node_modules/nuxt/dist/app/components/nuxt-island")['default']
    'NuxtRouteAnnouncer': typeof import("../node_modules/nuxt/dist/app/components/server-placeholder")['default']
      'LazyCoreAppNavigation': LazyComponent<typeof import("../app/components/core/AppNavigation.vue")['default']>
    'LazyFeedbackConfettiCelebration': LazyComponent<typeof import("../app/components/feedback/ConfettiCelebration.vue")['default']>
    'LazyFeedbackSuccessCelebration': LazyComponent<typeof import("../app/components/feedback/SuccessCelebration.vue")['default']>
    'LazyFormsCustomerForm': LazyComponent<typeof import("../app/components/forms/CustomerForm.vue")['default']>
    'LazyFormsOrderForm': LazyComponent<typeof import("../app/components/forms/OrderForm.vue")['default']>
    'LazyFormsProductForm': LazyComponent<typeof import("../app/components/forms/ProductForm.vue")['default']>
    'LazyUiBaseAlert': LazyComponent<typeof import("../app/components/ui/BaseAlert.vue")['default']>
    'LazyUiBaseBadge': LazyComponent<typeof import("../app/components/ui/BaseBadge.vue")['default']>
    'LazyUiBaseButton': LazyComponent<typeof import("../app/components/ui/BaseButton.vue")['default']>
    'LazyUiBaseCard': LazyComponent<typeof import("../app/components/ui/BaseCard.vue")['default']>
    'LazyUiBaseDropdown': LazyComponent<typeof import("../app/components/ui/BaseDropdown.vue")['default']>
    'LazyUiBaseInput': LazyComponent<typeof import("../app/components/ui/BaseInput.vue")['default']>
    'LazyUiBaseModal': LazyComponent<typeof import("../app/components/ui/BaseModal.vue")['default']>
    'LazyUiBaseTable': LazyComponent<typeof import("../app/components/ui/BaseTable.vue")['default']>
    'LazyUiToastContainer': LazyComponent<typeof import("../app/components/ui/ToastContainer.vue")['default']>
    'LazyUiToastNotification': LazyComponent<typeof import("../app/components/ui/ToastNotification.vue")['default']>
    'LazyNuxtWelcome': LazyComponent<typeof import("../node_modules/nuxt/dist/app/components/welcome.vue")['default']>
    'LazyNuxtLayout': LazyComponent<typeof import("../node_modules/nuxt/dist/app/components/nuxt-layout")['default']>
    'LazyNuxtErrorBoundary': LazyComponent<typeof import("../node_modules/nuxt/dist/app/components/nuxt-error-boundary.vue")['default']>
    'LazyClientOnly': LazyComponent<typeof import("../node_modules/nuxt/dist/app/components/client-only")['default']>
    'LazyDevOnly': LazyComponent<typeof import("../node_modules/nuxt/dist/app/components/dev-only")['default']>
    'LazyServerPlaceholder': LazyComponent<typeof import("../node_modules/nuxt/dist/app/components/server-placeholder")['default']>
    'LazyNuxtLink': LazyComponent<typeof import("../node_modules/nuxt/dist/app/components/nuxt-link")['default']>
    'LazyNuxtLoadingIndicator': LazyComponent<typeof import("../node_modules/nuxt/dist/app/components/nuxt-loading-indicator")['default']>
    'LazyNuxtTime': LazyComponent<typeof import("../node_modules/nuxt/dist/app/components/nuxt-time.vue")['default']>
    'LazyNuxtRouteAnnouncer': LazyComponent<typeof import("../node_modules/nuxt/dist/app/components/nuxt-route-announcer")['default']>
    'LazyNuxtImg': LazyComponent<typeof import("../node_modules/nuxt/dist/app/components/nuxt-stubs")['NuxtImg']>
    'LazyNuxtPicture': LazyComponent<typeof import("../node_modules/nuxt/dist/app/components/nuxt-stubs")['NuxtPicture']>
    'LazyErrorMessage': LazyComponent<typeof import("vee-validate")['ErrorMessage']>
    'LazyField': LazyComponent<typeof import("vee-validate")['Field']>
    'LazyFieldArray': LazyComponent<typeof import("vee-validate")['FieldArray']>
    'LazyForm': LazyComponent<typeof import("vee-validate")['Form']>
    'LazyNuxtPage': LazyComponent<typeof import("../node_modules/nuxt/dist/pages/runtime/page")['default']>
    'LazyNoScript': LazyComponent<typeof import("../node_modules/nuxt/dist/head/runtime/components")['NoScript']>
    'LazyLink': LazyComponent<typeof import("../node_modules/nuxt/dist/head/runtime/components")['Link']>
    'LazyBase': LazyComponent<typeof import("../node_modules/nuxt/dist/head/runtime/components")['Base']>
    'LazyTitle': LazyComponent<typeof import("../node_modules/nuxt/dist/head/runtime/components")['Title']>
    'LazyMeta': LazyComponent<typeof import("../node_modules/nuxt/dist/head/runtime/components")['Meta']>
    'LazyStyle': LazyComponent<typeof import("../node_modules/nuxt/dist/head/runtime/components")['Style']>
    'LazyHead': LazyComponent<typeof import("../node_modules/nuxt/dist/head/runtime/components")['Head']>
    'LazyHtml': LazyComponent<typeof import("../node_modules/nuxt/dist/head/runtime/components")['Html']>
    'LazyBody': LazyComponent<typeof import("../node_modules/nuxt/dist/head/runtime/components")['Body']>
    'LazyNuxtIsland': LazyComponent<typeof import("../node_modules/nuxt/dist/app/components/nuxt-island")['default']>
    'LazyNuxtRouteAnnouncer': LazyComponent<typeof import("../node_modules/nuxt/dist/app/components/server-placeholder")['default']>
}

declare module 'vue' {
  export interface GlobalComponents extends _GlobalComponents { }
}

export const CoreAppNavigation: typeof import("../app/components/core/AppNavigation.vue")['default']
export const FeedbackConfettiCelebration: typeof import("../app/components/feedback/ConfettiCelebration.vue")['default']
export const FeedbackSuccessCelebration: typeof import("../app/components/feedback/SuccessCelebration.vue")['default']
export const FormsCustomerForm: typeof import("../app/components/forms/CustomerForm.vue")['default']
export const FormsOrderForm: typeof import("../app/components/forms/OrderForm.vue")['default']
export const FormsProductForm: typeof import("../app/components/forms/ProductForm.vue")['default']
export const UiBaseAlert: typeof import("../app/components/ui/BaseAlert.vue")['default']
export const UiBaseBadge: typeof import("../app/components/ui/BaseBadge.vue")['default']
export const UiBaseButton: typeof import("../app/components/ui/BaseButton.vue")['default']
export const UiBaseCard: typeof import("../app/components/ui/BaseCard.vue")['default']
export const UiBaseDropdown: typeof import("../app/components/ui/BaseDropdown.vue")['default']
export const UiBaseInput: typeof import("../app/components/ui/BaseInput.vue")['default']
export const UiBaseModal: typeof import("../app/components/ui/BaseModal.vue")['default']
export const UiBaseTable: typeof import("../app/components/ui/BaseTable.vue")['default']
export const UiToastContainer: typeof import("../app/components/ui/ToastContainer.vue")['default']
export const UiToastNotification: typeof import("../app/components/ui/ToastNotification.vue")['default']
export const NuxtWelcome: typeof import("../node_modules/nuxt/dist/app/components/welcome.vue")['default']
export const NuxtLayout: typeof import("../node_modules/nuxt/dist/app/components/nuxt-layout")['default']
export const NuxtErrorBoundary: typeof import("../node_modules/nuxt/dist/app/components/nuxt-error-boundary.vue")['default']
export const ClientOnly: typeof import("../node_modules/nuxt/dist/app/components/client-only")['default']
export const DevOnly: typeof import("../node_modules/nuxt/dist/app/components/dev-only")['default']
export const ServerPlaceholder: typeof import("../node_modules/nuxt/dist/app/components/server-placeholder")['default']
export const NuxtLink: typeof import("../node_modules/nuxt/dist/app/components/nuxt-link")['default']
export const NuxtLoadingIndicator: typeof import("../node_modules/nuxt/dist/app/components/nuxt-loading-indicator")['default']
export const NuxtTime: typeof import("../node_modules/nuxt/dist/app/components/nuxt-time.vue")['default']
export const NuxtRouteAnnouncer: typeof import("../node_modules/nuxt/dist/app/components/nuxt-route-announcer")['default']
export const NuxtImg: typeof import("../node_modules/nuxt/dist/app/components/nuxt-stubs")['NuxtImg']
export const NuxtPicture: typeof import("../node_modules/nuxt/dist/app/components/nuxt-stubs")['NuxtPicture']
export const ErrorMessage: typeof import("vee-validate")['ErrorMessage']
export const Field: typeof import("vee-validate")['Field']
export const FieldArray: typeof import("vee-validate")['FieldArray']
export const Form: typeof import("vee-validate")['Form']
export const NuxtPage: typeof import("../node_modules/nuxt/dist/pages/runtime/page")['default']
export const NoScript: typeof import("../node_modules/nuxt/dist/head/runtime/components")['NoScript']
export const Link: typeof import("../node_modules/nuxt/dist/head/runtime/components")['Link']
export const Base: typeof import("../node_modules/nuxt/dist/head/runtime/components")['Base']
export const Title: typeof import("../node_modules/nuxt/dist/head/runtime/components")['Title']
export const Meta: typeof import("../node_modules/nuxt/dist/head/runtime/components")['Meta']
export const Style: typeof import("../node_modules/nuxt/dist/head/runtime/components")['Style']
export const Head: typeof import("../node_modules/nuxt/dist/head/runtime/components")['Head']
export const Html: typeof import("../node_modules/nuxt/dist/head/runtime/components")['Html']
export const Body: typeof import("../node_modules/nuxt/dist/head/runtime/components")['Body']
export const NuxtIsland: typeof import("../node_modules/nuxt/dist/app/components/nuxt-island")['default']
export const NuxtRouteAnnouncer: typeof import("../node_modules/nuxt/dist/app/components/server-placeholder")['default']
export const LazyCoreAppNavigation: LazyComponent<typeof import("../app/components/core/AppNavigation.vue")['default']>
export const LazyFeedbackConfettiCelebration: LazyComponent<typeof import("../app/components/feedback/ConfettiCelebration.vue")['default']>
export const LazyFeedbackSuccessCelebration: LazyComponent<typeof import("../app/components/feedback/SuccessCelebration.vue")['default']>
export const LazyFormsCustomerForm: LazyComponent<typeof import("../app/components/forms/CustomerForm.vue")['default']>
export const LazyFormsOrderForm: LazyComponent<typeof import("../app/components/forms/OrderForm.vue")['default']>
export const LazyFormsProductForm: LazyComponent<typeof import("../app/components/forms/ProductForm.vue")['default']>
export const LazyUiBaseAlert: LazyComponent<typeof import("../app/components/ui/BaseAlert.vue")['default']>
export const LazyUiBaseBadge: LazyComponent<typeof import("../app/components/ui/BaseBadge.vue")['default']>
export const LazyUiBaseButton: LazyComponent<typeof import("../app/components/ui/BaseButton.vue")['default']>
export const LazyUiBaseCard: LazyComponent<typeof import("../app/components/ui/BaseCard.vue")['default']>
export const LazyUiBaseDropdown: LazyComponent<typeof import("../app/components/ui/BaseDropdown.vue")['default']>
export const LazyUiBaseInput: LazyComponent<typeof import("../app/components/ui/BaseInput.vue")['default']>
export const LazyUiBaseModal: LazyComponent<typeof import("../app/components/ui/BaseModal.vue")['default']>
export const LazyUiBaseTable: LazyComponent<typeof import("../app/components/ui/BaseTable.vue")['default']>
export const LazyUiToastContainer: LazyComponent<typeof import("../app/components/ui/ToastContainer.vue")['default']>
export const LazyUiToastNotification: LazyComponent<typeof import("../app/components/ui/ToastNotification.vue")['default']>
export const LazyNuxtWelcome: LazyComponent<typeof import("../node_modules/nuxt/dist/app/components/welcome.vue")['default']>
export const LazyNuxtLayout: LazyComponent<typeof import("../node_modules/nuxt/dist/app/components/nuxt-layout")['default']>
export const LazyNuxtErrorBoundary: LazyComponent<typeof import("../node_modules/nuxt/dist/app/components/nuxt-error-boundary.vue")['default']>
export const LazyClientOnly: LazyComponent<typeof import("../node_modules/nuxt/dist/app/components/client-only")['default']>
export const LazyDevOnly: LazyComponent<typeof import("../node_modules/nuxt/dist/app/components/dev-only")['default']>
export const LazyServerPlaceholder: LazyComponent<typeof import("../node_modules/nuxt/dist/app/components/server-placeholder")['default']>
export const LazyNuxtLink: LazyComponent<typeof import("../node_modules/nuxt/dist/app/components/nuxt-link")['default']>
export const LazyNuxtLoadingIndicator: LazyComponent<typeof import("../node_modules/nuxt/dist/app/components/nuxt-loading-indicator")['default']>
export const LazyNuxtTime: LazyComponent<typeof import("../node_modules/nuxt/dist/app/components/nuxt-time.vue")['default']>
export const LazyNuxtRouteAnnouncer: LazyComponent<typeof import("../node_modules/nuxt/dist/app/components/nuxt-route-announcer")['default']>
export const LazyNuxtImg: LazyComponent<typeof import("../node_modules/nuxt/dist/app/components/nuxt-stubs")['NuxtImg']>
export const LazyNuxtPicture: LazyComponent<typeof import("../node_modules/nuxt/dist/app/components/nuxt-stubs")['NuxtPicture']>
export const LazyErrorMessage: LazyComponent<typeof import("vee-validate")['ErrorMessage']>
export const LazyField: LazyComponent<typeof import("vee-validate")['Field']>
export const LazyFieldArray: LazyComponent<typeof import("vee-validate")['FieldArray']>
export const LazyForm: LazyComponent<typeof import("vee-validate")['Form']>
export const LazyNuxtPage: LazyComponent<typeof import("../node_modules/nuxt/dist/pages/runtime/page")['default']>
export const LazyNoScript: LazyComponent<typeof import("../node_modules/nuxt/dist/head/runtime/components")['NoScript']>
export const LazyLink: LazyComponent<typeof import("../node_modules/nuxt/dist/head/runtime/components")['Link']>
export const LazyBase: LazyComponent<typeof import("../node_modules/nuxt/dist/head/runtime/components")['Base']>
export const LazyTitle: LazyComponent<typeof import("../node_modules/nuxt/dist/head/runtime/components")['Title']>
export const LazyMeta: LazyComponent<typeof import("../node_modules/nuxt/dist/head/runtime/components")['Meta']>
export const LazyStyle: LazyComponent<typeof import("../node_modules/nuxt/dist/head/runtime/components")['Style']>
export const LazyHead: LazyComponent<typeof import("../node_modules/nuxt/dist/head/runtime/components")['Head']>
export const LazyHtml: LazyComponent<typeof import("../node_modules/nuxt/dist/head/runtime/components")['Html']>
export const LazyBody: LazyComponent<typeof import("../node_modules/nuxt/dist/head/runtime/components")['Body']>
export const LazyNuxtIsland: LazyComponent<typeof import("../node_modules/nuxt/dist/app/components/nuxt-island")['default']>
export const LazyNuxtRouteAnnouncer: LazyComponent<typeof import("../node_modules/nuxt/dist/app/components/server-placeholder")['default']>

export const componentNames: string[]
