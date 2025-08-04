<template>
  <div class="navigation-showcase space-y-8">
    <!-- Horizontal Navigation Bar -->
    <div class="demo-section">
      <h3 class="text-lg font-semibold text-primary-800 mb-4">Horizontal Navigation</h3>
      <nav class="glass-nav rounded-xl p-4">
        <div class="flex items-center justify-between">
          <div class="flex items-center space-x-6">
            <div class="glass-icon-container w-10 h-10">
              <Icon name="lucide:zap" class="w-5 h-5 text-primary-600" />
            </div>
            <div class="hidden md:flex items-center space-x-4">
              <a 
                v-for="item in horizontalNavItems" 
                :key="item.label"
                :href="item.href"
                :class="[
                  'nav-link-magical',
                  { 'active': item.active }
                ]"
                @click.prevent="setActive(item.label)"
              >
                <Icon :name="item.icon" class="w-4 h-4 mr-2" />
                {{ item.label }}
              </a>
            </div>
          </div>
          
          <!-- Mobile menu button -->
          <button 
            class="md:hidden glass-icon-container w-10 h-10"
            @click="mobileMenuOpen = !mobileMenuOpen"
            :aria-expanded="mobileMenuOpen"
            aria-label="Toggle mobile menu"
          >
            <Icon :name="mobileMenuOpen ? 'lucide:x' : 'lucide:menu'" class="w-5 h-5 text-primary-600" />
          </button>
        </div>
        
        <!-- Mobile menu -->
        <div 
          v-if="mobileMenuOpen"
          class="md:hidden mt-4 pt-4 border-t border-primary-200 animate-fade-in"
        >
          <div class="flex flex-col space-y-2">
            <a 
              v-for="item in horizontalNavItems" 
              :key="`mobile-${item.label}`"
              :href="item.href"
              :class="[
                'nav-link-magical block',
                { 'active': item.active }
              ]"
              @click.prevent="setActive(item.label)"
            >
              <Icon :name="item.icon" class="w-4 h-4 mr-2" />
              {{ item.label }}
            </a>
          </div>
        </div>
      </nav>
    </div>

    <!-- Vertical Sidebar Navigation -->
    <div class="demo-section">
      <h3 class="text-lg font-semibold text-primary-800 mb-4">Vertical Sidebar</h3>
      <div class="flex gap-6">
        <nav class="glass-nav rounded-xl p-4 w-64">
          <div class="space-y-2">
            <div class="text-primary-400 text-xs uppercase tracking-wide font-semibold mb-4 px-3">
              Main Menu
            </div>
            <a 
              v-for="item in sidebarNavItems.main" 
              :key="item.label"
              :href="item.href"
              :class="[
                'nav-link-magical flex items-center w-full',
                { 'active': item.active }
              ]"
              @click.prevent="setActive(item.label)"
            >
              <Icon :name="item.icon" class="w-4 h-4 mr-3" />
              {{ item.label }}
              <span v-if="item.badge" class="ml-auto daisy-badge daisy-badge-sm glass-badge">
                {{ item.badge }}
              </span>
            </a>
            
            <div class="text-primary-400 text-xs uppercase tracking-wide font-semibold mb-4 mt-8 px-3">
              Settings
            </div>
            <a 
              v-for="item in sidebarNavItems.settings" 
              :key="item.label"
              :href="item.href"
              :class="[
                'nav-link-magical flex items-center w-full',
                { 'active': item.active }
              ]"
              @click.prevent="setActive(item.label)"
            >
              <Icon :name="item.icon" class="w-4 h-4 mr-3" />
              {{ item.label }}
            </a>
          </div>
        </nav>
        
        <div class="flex-1 glass-card p-6 min-h-[300px]">
          <div class="text-center py-12">
            <div class="glass-icon-container w-16 h-16 mx-auto mb-4">
              <Icon name="lucide:layout" class="w-8 h-8 text-primary-600" />
            </div>
            <p class="text-primary-600">Content area for sidebar navigation</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Tab Navigation -->
    <div class="demo-section">
      <h3 class="text-lg font-semibold text-primary-800 mb-4">Tab Navigation</h3>
      <div class="glass-card p-6">
        <div class="daisy-tabs daisy-tabs-bordered mb-6">
          <a 
            v-for="tab in tabItems" 
            :key="tab.id"
            :class="[
              'daisy-tab daisy-tab-lg text-primary-500',
              {
                'daisy-tab-active text-primary-700 border-primary-400': activeTab === tab.id,
                'hover:text-primary-700': activeTab !== tab.id
              }
            ]"
            @click="activeTab = tab.id"
          >
            <Icon :name="tab.icon" class="w-4 h-4 mr-2" />
            {{ tab.label }}
          </a>
        </div>
        
        <div class="tab-content">
          <div v-for="tab in tabItems" :key="`content-${tab.id}`" v-show="activeTab === tab.id">
            <div class="glass-bg-light rounded-lg p-6">
              <h4 class="text-lg font-semibold text-primary-800 mb-3">{{ tab.label }} Content</h4>
              <p class="text-primary-600 mb-4">{{ tab.description }}</p>
              <div class="flex gap-3">
                <DaisyButton size="sm" variant="primary">Primary Action</DaisyButton>
                <DaisyButton size="sm" variant="ghost">Secondary</DaisyButton>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Breadcrumb Navigation -->
    <div class="demo-section">
      <h3 class="text-lg font-semibold text-primary-800 mb-4">Breadcrumb Navigation</h3>
      <div class="glass-card p-6">
        <nav class="text-sm" aria-label="Breadcrumb">
          <ol class="daisy-breadcrumbs text-primary-500">
            <li>
              <a href="#" class="hover:text-primary-700 transition-colors flex items-center">
                <Icon name="lucide:home" class="w-4 h-4 mr-1" />
                Home
              </a>
            </li>
            <li>
              <a href="#" class="hover:text-primary-700 transition-colors">
                Components
              </a>
            </li>
            <li>
              <a href="#" class="hover:text-primary-700 transition-colors">
                Navigation
              </a>
            </li>
            <li class="text-primary-800 font-medium" aria-current="page">
              Showcase
            </li>
          </ol>
        </nav>
      </div>
    </div>

    <!-- Bottom Navigation (Mobile) -->
    <div class="demo-section">
      <h3 class="text-lg font-semibold text-primary-800 mb-4">Bottom Navigation</h3>
      <div class="max-w-sm mx-auto">
        <nav class="glass-nav rounded-t-xl p-2">
          <div class="flex items-center justify-around">
            <button 
              v-for="item in bottomNavItems" 
              :key="item.label"
              :class="[
                'flex flex-col items-center p-2 rounded-lg transition-all duration-200',
                {
                  'bg-primary-100 text-primary-800': item.active,
                  'text-primary-600 hover:text-primary-800 hover:bg-primary-50': !item.active
                }
              ]"
              @click="setBottomNavActive(item.label)"
            >
              <Icon :name="item.icon" class="w-5 h-5 mb-1" />
              <span class="text-xs font-medium">{{ item.label }}</span>
              <div v-if="item.badge" class="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full"></div>
            </button>
          </div>
        </nav>
      </div>
    </div>

    <!-- Floating Action Navigation -->
    <div class="demo-section">
      <h3 class="text-lg font-semibold text-primary-800 mb-4">Floating Action Menu</h3>
      <div class="glass-card p-6 relative min-h-[200px]">
        <p class="text-primary-600 mb-4">
          Click the floating action button to see the menu expand.
        </p>
        
        <!-- Main FAB -->
        <div 
          class="absolute bottom-6 right-6"
          @mouseenter="fabMenuOpen = true"
          @mouseleave="fabMenuOpen = false"
        >
          <!-- FAB Menu Items -->
          <div 
            v-if="fabMenuOpen"
            class="absolute bottom-16 right-0 space-y-3 animate-fade-in"
          >
            <div 
              v-for="(item, index) in fabMenuItems" 
              :key="item.label"
              class="flex items-center"
              :style="{ animationDelay: `${index * 0.1}s` }"
            >
              <span class="bg-glass-bg-primary-strong text-primary-800 text-sm px-3 py-1 rounded-lg mr-3 whitespace-nowrap shadow-primary">
                {{ item.label }}
              </span>
              <button class="glass-fab w-10 h-10 hover:scale-110">
                <Icon :name="item.icon" class="w-5 h-5 text-primary-600" />
              </button>
            </div>
          </div>
          
          <!-- Main FAB Button -->
          <button 
            class="glass-fab w-14 h-14"
            :class="{ 'rotate-45': fabMenuOpen }"
          >
            <Icon name="lucide:plus" class="w-6 h-6 text-primary-600" />
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
interface NavItem {
  label: string
  href: string
  icon: string
  active?: boolean
  badge?: string | number
}

interface TabItem {
  id: string
  label: string
  icon: string
  description: string
}

// Reactive state
const mobileMenuOpen = ref(false)
const activeTab = ref('overview')
const fabMenuOpen = ref(false)

// Navigation data
const horizontalNavItems = ref<NavItem[]>([
  { label: 'Dashboard', href: '#', icon: 'lucide:layout-dashboard', active: true },
  { label: 'Orders', href: '#', icon: 'lucide:shopping-cart' },
  { label: 'Products', href: '#', icon: 'lucide:package' },
  { label: 'Customers', href: '#', icon: 'lucide:users' },
  { label: 'Analytics', href: '#', icon: 'lucide:bar-chart-3' }
])

const sidebarNavItems = ref<{
  main: NavItem[]
  settings: NavItem[]
}>({
  main: [
    { label: 'Dashboard', href: '#', icon: 'lucide:layout-dashboard', active: true },
    { label: 'Orders', href: '#', icon: 'lucide:shopping-cart', badge: '12' },
    { label: 'Products', href: '#', icon: 'lucide:package' },
    { label: 'Customers', href: '#', icon: 'lucide:users' },
    { label: 'Reports', href: '#', icon: 'lucide:file-text' }
  ],
  settings: [
    { label: 'Account', href: '#', icon: 'lucide:user' },
    { label: 'Preferences', href: '#', icon: 'lucide:settings' },
    { label: 'Help', href: '#', icon: 'lucide:help-circle' }
  ]
})

const tabItems = ref<TabItem[]>([
  { 
    id: 'overview', 
    label: 'Overview', 
    icon: 'lucide:eye',
    description: 'Get a comprehensive view of your dashboard metrics and key performance indicators.'
  },
  { 
    id: 'analytics', 
    label: 'Analytics', 
    icon: 'lucide:trending-up',
    description: 'Dive deep into your data with advanced analytics and reporting tools.'
  },
  { 
    id: 'reports', 
    label: 'Reports', 
    icon: 'lucide:file-text',
    description: 'Generate and download detailed reports for your business operations.'
  },
  { 
    id: 'settings', 
    label: 'Settings', 
    icon: 'lucide:settings',
    description: 'Configure your preferences and manage account settings.'
  }
])

const bottomNavItems = ref<NavItem[]>([
  { label: 'Home', href: '#', icon: 'lucide:home', active: true },
  { label: 'Search', href: '#', icon: 'lucide:search' },
  { label: 'Notifications', href: '#', icon: 'lucide:bell', badge: '3' },
  { label: 'Profile', href: '#', icon: 'lucide:user' }
])

const fabMenuItems = ref<NavItem[]>([
  { label: 'Add Order', href: '#', icon: 'lucide:plus' },
  { label: 'New Customer', href: '#', icon: 'lucide:user-plus' },
  { label: 'Upload File', href: '#', icon: 'lucide:upload' }
])

// Methods
const setActive = (label: string) => {
  // Update horizontal nav
  horizontalNavItems.value.forEach(item => {
    item.active = item.label === label
  })
  
  // Update sidebar nav
  sidebarNavItems.value.main.forEach(item => {
    item.active = item.label === label
  })
  sidebarNavItems.value.settings.forEach(item => {
    item.active = item.label === label
  })
  
  // Close mobile menu
  mobileMenuOpen.value = false
}

const setBottomNavActive = (label: string) => {
  bottomNavItems.value.forEach(item => {
    item.active = item.label === label
  })
}

// Close mobile menu when clicking outside
onMounted(() => {
  const handleClickOutside = (event: Event) => {
    const target = event.target as Element
    if (!target.closest('.glass-nav') && mobileMenuOpen.value) {
      mobileMenuOpen.value = false
    }
  }
  
  document.addEventListener('click', handleClickOutside)
  
  onUnmounted(() => {
    document.removeEventListener('click', handleClickOutside)
  })
})
</script>

<style scoped>
/* Navigation showcase specific styling */
.navigation-showcase {
  width: 100%;
  max-width: none;
}

.demo-section {
  margin-bottom: 3rem;
}

/* Enhanced glass navigation with #799EFF primary styling */
.glass-nav {
  background: var(--glass-bg-primary);
  backdrop-filter: var(--blur-lg);
  -webkit-backdrop-filter: var(--blur-lg);
  border: 1px solid var(--glass-border-primary);
  box-shadow: var(--shadow-primary);
  position: relative;
}

.glass-nav::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 1px;
  background: linear-gradient(90deg, transparent, rgba(121, 158, 255, 0.4), transparent);
  opacity: 0.8;
  z-index: 1;
}

/* Enhanced magical navigation links with primary colors */
.nav-link-magical {
  display: flex;
  align-items: center;
  padding: 0.75rem 1rem;
  border-radius: 0.75rem;
  font-medium;
  color: var(--primary-600);
  text-decoration: none;
  transition: all 0.2s ease-in-out;
  position: relative;
  overflow: hidden;
  font-weight: 500;
}

.nav-link-magical:hover {
  color: var(--primary-800);
  background: var(--glass-bg-primary-light);
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(121, 158, 255, 0.15);
}

.nav-link-magical.active {
  color: var(--primary-900);
  background: var(--glass-bg-primary-medium);
  box-shadow: 0 2px 8px rgba(121, 158, 255, 0.2), inset 0 1px 0 rgba(121, 158, 255, 0.1);
  font-weight: 600;
}

.nav-link-magical.active::before {
  content: '';
  position: absolute;
  left: 0;
  top: 0;
  bottom: 0;
  width: 3px;
  background: linear-gradient(to bottom, var(--primary-500), var(--primary-300));
  border-radius: 0 2px 2px 0;
  box-shadow: 0 0 8px rgba(121, 158, 255, 0.4);
}

/* Enhanced glass badge with primary styling */
.glass-badge {
  backdrop-filter: var(--blur-sm);
  -webkit-backdrop-filter: var(--blur-sm);
  background: var(--glass-bg-primary-light);
  border: 1px solid var(--glass-border-primary-light);
  color: var(--primary-700);
  font-size: 0.75rem;
  font-weight: 600;
  box-shadow: 0 2px 4px rgba(121, 158, 255, 0.1);
}

/* Enhanced tab styling with primary colors */
.daisy-tabs {
  border-bottom: 1px solid var(--primary-200);
  background: linear-gradient(180deg, transparent 0%, rgba(121, 158, 255, 0.02) 100%);
}

.daisy-tab {
  border-color: transparent;
  transition: all 0.2s ease-in-out;
}

.daisy-tab:hover {
  background: var(--glass-bg-primary-light);
  color: var(--primary-700);
}

.daisy-tab.daisy-tab-active {
  border-color: var(--primary-400);
  background: var(--glass-bg-primary-light);
  box-shadow: 0 2px 8px rgba(121, 158, 255, 0.15);
}

/* Tab content styling */
.tab-content > div {
  animation: fadeInUp 0.3s ease-out;
}

/* Bottom navigation styling */
.bottom-nav-item.active {
  position: relative;
}

.bottom-nav-item.active::before {
  content: '';
  position: absolute;
  top: -8px;
  left: 50%;
  transform: translateX(-50%);
  width: 24px;
  height: 3px;
  background: var(--primary-500);
  border-radius: 0 0 3px 3px;
  box-shadow: 0 2px 8px rgba(121, 158, 255, 0.3);
}

/* Enhanced Floating Action Button with primary colors */
.glass-fab {
  position: relative;
  backdrop-filter: var(--blur-md);
  -webkit-backdrop-filter: var(--blur-md);
  background: var(--glass-bg-primary-strong);
  border: 1px solid var(--glass-border-primary);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: var(--shadow-primary);
}

.glass-fab:hover {
  transform: scale(1.1);
  box-shadow: var(--shadow-primary-lg);
  background: var(--primary-600);
  border-color: var(--primary-400);
}

.glass-fab:hover .text-primary-600 {
  color: white;
}

.glass-fab.rotate-45 {
  transform: rotate(45deg);
}

/* FAB menu animations */
.glass-fab + div .glass-fab {
  animation: slideInRight 0.3s ease-out forwards;
  opacity: 0;
  transform: translateX(20px);
}

/* Enhanced breadcrumb styling with primary colors */
.daisy-breadcrumbs > li + li:before {
  content: '/';
  margin: 0 0.5rem;
  color: var(--primary-400);
  font-weight: 300;
}

.daisy-breadcrumbs li:last-child {
  color: var(--primary-800);
  font-weight: 600;
}

/* Animations */
@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes slideInRight {
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

.animate-fade-in {
  animation: fadeInUp 0.3s ease-out;
}

/* Badge indicator */
.relative .absolute {
  position: absolute;
}

/* Responsive adjustments */
@media (max-width: 768px) {
  .navigation-showcase .flex.gap-6 {
    flex-direction: column;
    gap: 1.5rem;
  }
  
  .navigation-showcase .w-64 {
    width: 100%;
  }
  
  .glass-fab {
    bottom: 1rem;
    right: 1rem;
  }
}

/* High contrast mode support */
@media (prefers-contrast: high) {
  .nav-link-magical.active {
    border: 2px solid var(--glass-border-strong);
  }
  
  .glass-badge {
    border-width: 2px;
    font-weight: 600;
  }
}

/* Reduced motion support */
@media (prefers-reduced-motion: reduce) {
  .nav-link-magical,
  .glass-fab,
  .daisy-tab {
    transition: none;
  }
  
  .nav-link-magical:hover {
    transform: none;
  }
  
  .glass-fab:hover {
    transform: scale(1.05);
  }
  
  .animate-fade-in {
    animation: none;
  }
  
  .tab-content > div {
    animation: none;
  }
}
</style>