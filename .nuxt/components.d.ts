
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
      'AppNavigation': typeof import("../app/components/AppNavigation.vue")['default']
    'ConfettiCelebration': typeof import("../app/components/ConfettiCelebration.vue")['default']
    'DelightfulToast': typeof import("../app/components/DelightfulToast.vue")['default']
    'DelightfulTooltip': typeof import("../app/components/DelightfulTooltip.vue")['default']
    'MagicalLoader': typeof import("../app/components/MagicalLoader.vue")['default']
    'MagicalParticles': typeof import("../app/components/MagicalParticles.vue")['default']
    'MetricCard': typeof import("../app/components/MetricCard.vue")['default']
    'QuickActionCard': typeof import("../app/components/QuickActionCard.vue")['default']
    'SuccessCelebration': typeof import("../app/components/SuccessCelebration.vue")['default']
    'FormsCustomerForm': typeof import("../app/components/forms/CustomerForm.vue")['default']
    'FormsOrderForm': typeof import("../app/components/forms/OrderForm.vue")['default']
    'FormsProductForm': typeof import("../app/components/forms/ProductForm.vue")['default']
    'UiBadge': typeof import("../app/components/ui/Badge.vue")['default']
    'UiButton': typeof import("../app/components/ui/Button.vue")['default']
    'UiCard': typeof import("../app/components/ui/Card.vue")['default']
    'UiInput': typeof import("../app/components/ui/Input.vue")['default']
    'UiModal': typeof import("../app/components/ui/Modal.vue")['default']
    'UiPagination': typeof import("../app/components/ui/Pagination.vue")['default']
    'UiSelect': typeof import("../app/components/ui/Select.vue")['default']
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
    'Icon': typeof import("../node_modules/@nuxt/icon/dist/runtime/components/index")['default']
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
      'LazyAppNavigation': LazyComponent<typeof import("../app/components/AppNavigation.vue")['default']>
    'LazyConfettiCelebration': LazyComponent<typeof import("../app/components/ConfettiCelebration.vue")['default']>
    'LazyDelightfulToast': LazyComponent<typeof import("../app/components/DelightfulToast.vue")['default']>
    'LazyDelightfulTooltip': LazyComponent<typeof import("../app/components/DelightfulTooltip.vue")['default']>
    'LazyMagicalLoader': LazyComponent<typeof import("../app/components/MagicalLoader.vue")['default']>
    'LazyMagicalParticles': LazyComponent<typeof import("../app/components/MagicalParticles.vue")['default']>
    'LazyMetricCard': LazyComponent<typeof import("../app/components/MetricCard.vue")['default']>
    'LazyQuickActionCard': LazyComponent<typeof import("../app/components/QuickActionCard.vue")['default']>
    'LazySuccessCelebration': LazyComponent<typeof import("../app/components/SuccessCelebration.vue")['default']>
    'LazyFormsCustomerForm': LazyComponent<typeof import("../app/components/forms/CustomerForm.vue")['default']>
    'LazyFormsOrderForm': LazyComponent<typeof import("../app/components/forms/OrderForm.vue")['default']>
    'LazyFormsProductForm': LazyComponent<typeof import("../app/components/forms/ProductForm.vue")['default']>
    'LazyUiBadge': LazyComponent<typeof import("../app/components/ui/Badge.vue")['default']>
    'LazyUiButton': LazyComponent<typeof import("../app/components/ui/Button.vue")['default']>
    'LazyUiCard': LazyComponent<typeof import("../app/components/ui/Card.vue")['default']>
    'LazyUiInput': LazyComponent<typeof import("../app/components/ui/Input.vue")['default']>
    'LazyUiModal': LazyComponent<typeof import("../app/components/ui/Modal.vue")['default']>
    'LazyUiPagination': LazyComponent<typeof import("../app/components/ui/Pagination.vue")['default']>
    'LazyUiSelect': LazyComponent<typeof import("../app/components/ui/Select.vue")['default']>
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
    'LazyIcon': LazyComponent<typeof import("../node_modules/@nuxt/icon/dist/runtime/components/index")['default']>
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

export const AppNavigation: typeof import("../app/components/AppNavigation.vue")['default']
export const ConfettiCelebration: typeof import("../app/components/ConfettiCelebration.vue")['default']
export const DelightfulToast: typeof import("../app/components/DelightfulToast.vue")['default']
export const DelightfulTooltip: typeof import("../app/components/DelightfulTooltip.vue")['default']
export const MagicalLoader: typeof import("../app/components/MagicalLoader.vue")['default']
export const MagicalParticles: typeof import("../app/components/MagicalParticles.vue")['default']
export const MetricCard: typeof import("../app/components/MetricCard.vue")['default']
export const QuickActionCard: typeof import("../app/components/QuickActionCard.vue")['default']
export const SuccessCelebration: typeof import("../app/components/SuccessCelebration.vue")['default']
export const FormsCustomerForm: typeof import("../app/components/forms/CustomerForm.vue")['default']
export const FormsOrderForm: typeof import("../app/components/forms/OrderForm.vue")['default']
export const FormsProductForm: typeof import("../app/components/forms/ProductForm.vue")['default']
export const UiBadge: typeof import("../app/components/ui/Badge.vue")['default']
export const UiButton: typeof import("../app/components/ui/Button.vue")['default']
export const UiCard: typeof import("../app/components/ui/Card.vue")['default']
export const UiInput: typeof import("../app/components/ui/Input.vue")['default']
export const UiModal: typeof import("../app/components/ui/Modal.vue")['default']
export const UiPagination: typeof import("../app/components/ui/Pagination.vue")['default']
export const UiSelect: typeof import("../app/components/ui/Select.vue")['default']
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
export const Icon: typeof import("../node_modules/@nuxt/icon/dist/runtime/components/index")['default']
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
export const LazyAppNavigation: LazyComponent<typeof import("../app/components/AppNavigation.vue")['default']>
export const LazyConfettiCelebration: LazyComponent<typeof import("../app/components/ConfettiCelebration.vue")['default']>
export const LazyDelightfulToast: LazyComponent<typeof import("../app/components/DelightfulToast.vue")['default']>
export const LazyDelightfulTooltip: LazyComponent<typeof import("../app/components/DelightfulTooltip.vue")['default']>
export const LazyMagicalLoader: LazyComponent<typeof import("../app/components/MagicalLoader.vue")['default']>
export const LazyMagicalParticles: LazyComponent<typeof import("../app/components/MagicalParticles.vue")['default']>
export const LazyMetricCard: LazyComponent<typeof import("../app/components/MetricCard.vue")['default']>
export const LazyQuickActionCard: LazyComponent<typeof import("../app/components/QuickActionCard.vue")['default']>
export const LazySuccessCelebration: LazyComponent<typeof import("../app/components/SuccessCelebration.vue")['default']>
export const LazyFormsCustomerForm: LazyComponent<typeof import("../app/components/forms/CustomerForm.vue")['default']>
export const LazyFormsOrderForm: LazyComponent<typeof import("../app/components/forms/OrderForm.vue")['default']>
export const LazyFormsProductForm: LazyComponent<typeof import("../app/components/forms/ProductForm.vue")['default']>
export const LazyUiBadge: LazyComponent<typeof import("../app/components/ui/Badge.vue")['default']>
export const LazyUiButton: LazyComponent<typeof import("../app/components/ui/Button.vue")['default']>
export const LazyUiCard: LazyComponent<typeof import("../app/components/ui/Card.vue")['default']>
export const LazyUiInput: LazyComponent<typeof import("../app/components/ui/Input.vue")['default']>
export const LazyUiModal: LazyComponent<typeof import("../app/components/ui/Modal.vue")['default']>
export const LazyUiPagination: LazyComponent<typeof import("../app/components/ui/Pagination.vue")['default']>
export const LazyUiSelect: LazyComponent<typeof import("../app/components/ui/Select.vue")['default']>
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
export const LazyIcon: LazyComponent<typeof import("../node_modules/@nuxt/icon/dist/runtime/components/index")['default']>
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
