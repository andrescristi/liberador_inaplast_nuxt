<template>
  <div class="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 py-16 px-6">
    <div class="max-w-7xl mx-auto">
      
      <!-- Brand Header -->
      <div class="text-center mb-20">
        <div class="inaplast-logo justify-center mb-8">
          <div class="inaplast-logo-icon">
            <Icon name="lucide:layers" class="w-6 h-6" />
          </div>
          <div>
            <div class="inaplast-logo-text">Inaplast</div>
            <div class="inaplast-logo-subtitle">Professional. Reliable. Modern.</div>
          </div>
        </div>
        
        <h1 class="text-4xl font-bold text-slate-800 mb-4 leading-tight">
          Minimalist Brand System
        </h1>
        <p class="text-lg text-slate-600 max-w-2xl mx-auto leading-relaxed">
          A strategic approach to brand identity through elegant restraint and purposeful design.
        </p>
      </div>

      <!-- Color System -->
      <section class="mb-20">
        <div class="inaplast-card mb-8">
          <h2 class="text-2xl font-semibold text-slate-800 mb-6">Strategic Color Usage</h2>
          <p class="text-slate-600 mb-8 leading-relaxed">
            Our primary color #799EFF is used strategically, appearing in maximum 20% of interface elements 
            to create strong brand recognition through the scarcity principle.
          </p>
          
          <!-- Primary Color Demo -->
          <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div class="text-center">
              <div class="w-20 h-20 mx-auto mb-4 rounded-xl" style="background: #799EFF;"></div>
              <h4 class="font-semibold text-slate-800 mb-2">Primary Brand</h4>
              <p class="text-sm text-slate-600">#799EFF</p>
              <p class="text-xs text-slate-500 mt-2">CTAs, Logo, Active States</p>
            </div>
            
            <div class="text-center">
              <div class="w-20 h-20 mx-auto mb-4 rounded-xl bg-slate-100 border-2 border-slate-200"></div>
              <h4 class="font-semibold text-slate-800 mb-2">Neutral Foundation</h4>
              <p class="text-sm text-slate-600">Gray Scale</p>
              <p class="text-xs text-slate-500 mt-2">80% of interface</p>
            </div>
            
            <div class="text-center">
              <div class="w-20 h-20 mx-auto mb-4 rounded-xl bg-emerald-500"></div>
              <h4 class="font-semibold text-slate-800 mb-2">Semantic Colors</h4>
              <p class="text-sm text-slate-600">Status Only</p>
              <p class="text-xs text-slate-500 mt-2">Success, Error, Warning</p>
            </div>
          </div>
        </div>
      </section>

      <!-- Button System -->
      <section class="mb-20">
        <div class="inaplast-card">
          <h2 class="text-2xl font-semibold text-slate-800 mb-6">Button Hierarchy</h2>
          <p class="text-slate-600 mb-8 leading-relaxed">
            Strategic button usage ensures clear action hierarchy and prevents visual noise.
          </p>
          
          <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
            <!-- Primary Button -->
            <div class="text-center">
              <button class="inaplast-btn-primary mb-4">
                Primary Action
              </button>
              <h4 class="font-semibold text-slate-800 mb-2">Primary Button</h4>
              <p class="text-sm text-slate-600">Maximum 1 per screen</p>
              <p class="text-xs text-slate-500 mt-2">Main CTAs only</p>
            </div>
            
            <!-- Secondary Button -->
            <div class="text-center">
              <button class="inaplast-btn-secondary mb-4">
                Secondary Action
              </button>
              <h4 class="font-semibold text-slate-800 mb-2">Secondary Button</h4>
              <p class="text-sm text-slate-600">Supporting actions</p>
              <p class="text-xs text-slate-500 mt-2">Professional and clean</p>
            </div>
            
            <!-- Glass Button -->
            <div class="text-center">
              <button class="inaplast-btn-glass mb-4">
                Glass Action
              </button>
              <h4 class="font-semibold text-slate-800 mb-2">Glass Button</h4>
              <p class="text-sm text-slate-600">Overlay contexts</p>
              <p class="text-xs text-slate-500 mt-2">Modern and minimal</p>
            </div>
          </div>
        </div>
      </section>

      <!-- Typography System -->
      <section class="mb-20">
        <div class="inaplast-card">
          <h2 class="text-2xl font-semibold text-slate-800 mb-6">Typography Hierarchy</h2>
          <p class="text-slate-600 mb-8 leading-relaxed">
            Clear hierarchy using Inter font family with purposeful weight variations.
          </p>
          
          <div class="space-y-6">
            <div class="border-l-4 border-slate-200 pl-6">
              <h1 class="text-4xl font-bold text-slate-800 mb-2">Hero Heading</h1>
              <p class="text-sm text-slate-500">36px, Bold (700) - Maximum impact</p>
            </div>
            
            <div class="border-l-4 border-slate-200 pl-6">
              <h2 class="text-2xl font-semibold text-slate-700 mb-2">Section Heading</h2>
              <p class="text-sm text-slate-500">24px, Semibold (600) - Section breaks</p>
            </div>
            
            <div class="border-l-4 border-slate-200 pl-6">
              <h3 class="text-lg font-medium text-slate-600 mb-2">Component Heading</h3>
              <p class="text-sm text-slate-500">18px, Medium (500) - Card titles</p>
            </div>
            
            <div class="border-l-4 border-slate-200 pl-6">
              <p class="text-base text-slate-600 mb-2">Body Text</p>
              <p class="text-sm text-slate-500">16px, Normal (400) - Primary content</p>
            </div>
            
            <div class="border-l-4 border-slate-200 pl-6">
              <p class="text-sm text-slate-500 mb-2">Supporting Text</p>
              <p class="text-sm text-slate-500">14px, Normal (400) - Metadata</p>
            </div>
          </div>
        </div>
      </section>

      <!-- Component Examples -->
      <section class="mb-20">
        <div class="inaplast-card mb-8">
          <h2 class="text-2xl font-semibold text-slate-800 mb-6">Core Components</h2>
          <p class="text-slate-600 mb-8 leading-relaxed">
            Consistent components that maintain brand identity while prioritizing usability.
          </p>
        </div>
        
        <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
          <!-- Form Example -->
          <div class="inaplast-card">
            <h3 class="text-lg font-semibold text-slate-800 mb-6">Professional Forms</h3>
            <form class="space-y-4" @submit.prevent>
              <div>
                <label class="block text-sm font-medium text-slate-700 mb-2">
                  Customer Name
                </label>
                <input 
                  type="text" 
                  class="inaplast-input" 
                  placeholder="Enter customer name"
                  v-model="demoForm.name"
                >
              </div>
              
              <div>
                <label class="block text-sm font-medium text-slate-700 mb-2">
                  Email Address
                </label>
                <input 
                  type="email" 
                  class="inaplast-input" 
                  placeholder="customer@example.com"
                  v-model="demoForm.email"
                >
              </div>
              
              <div class="flex gap-3 pt-4">
                <button type="submit" class="inaplast-btn-primary flex-1">
                  Save Customer
                </button>
                <button type="button" class="inaplast-btn-secondary">
                  Cancel
                </button>
              </div>
            </form>
          </div>
          
          <!-- Status Examples -->
          <div class="inaplast-card">
            <h3 class="text-lg font-semibold text-slate-800 mb-6">Status Indicators</h3>
            <div class="space-y-4">
              <div class="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
                <span class="text-slate-700">Order #12345</span>
                <span class="inaplast-status success">Completed</span>
              </div>
              
              <div class="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
                <span class="text-slate-700">Order #12346</span>
                <span class="inaplast-status warning">Pending</span>
              </div>
              
              <div class="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
                <span class="text-slate-700">Order #12347</span>
                <span class="inaplast-status error">Cancelled</span>
              </div>
              
              <div class="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
                <span class="text-slate-700">Order #12348</span>
                <span class="inaplast-status info">Processing</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- Navigation Example -->
      <section class="mb-20">
        <div class="inaplast-card">
          <h2 class="text-2xl font-semibold text-slate-800 mb-6">Navigation System</h2>
          <p class="text-slate-600 mb-8 leading-relaxed">
            Clean navigation that guides users without visual clutter.
          </p>
          
          <div class="inaplast-nav rounded-lg">
            <div class="max-w-4xl mx-auto px-6">
              <div class="flex items-center justify-between">
                <div class="inaplast-logo">
                  <div class="inaplast-logo-icon">
                    <Icon name="lucide:layers" class="w-5 h-5" />
                  </div>
                  <div class="inaplast-logo-text text-lg">Inaplast</div>
                </div>
                
                <nav class="flex items-center space-x-2">
                  <a href="#" class="inaplast-nav-link active">Dashboard</a>
                  <a href="#" class="inaplast-nav-link">Orders</a>
                  <a href="#" class="inaplast-nav-link">Customers</a>
                  <a href="#" class="inaplast-nav-link">Products</a>
                </nav>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- Brand Guidelines Summary -->
      <section class="mb-20">
        <div class="inaplast-card">
          <h2 class="text-2xl font-semibold text-slate-800 mb-6">Brand Implementation Rules</h2>
          
          <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h3 class="text-lg font-semibold text-emerald-700 mb-4 flex items-center gap-2">
                <Icon name="lucide:check-circle" class="w-5 h-5" />
                Do's
              </h3>
              <ul class="space-y-3 text-slate-600">
                <li class="flex items-start gap-2">
                  <Icon name="lucide:check" class="w-4 h-4 text-emerald-500 mt-0.5 flex-shrink-0" />
                  Use primary color strategically (max 20% of interface)
                </li>
                <li class="flex items-start gap-2">
                  <Icon name="lucide:check" class="w-4 h-4 text-emerald-500 mt-0.5 flex-shrink-0" />
                  Maintain generous white space for breathing room
                </li>
                <li class="flex items-start gap-2">
                  <Icon name="lucide:check" class="w-4 h-4 text-emerald-500 mt-0.5 flex-shrink-0" />
                  Follow typography hierarchy consistently
                </li>
                <li class="flex items-start gap-2">
                  <Icon name="lucide:check" class="w-4 h-4 text-emerald-500 mt-0.5 flex-shrink-0" />
                  Prioritize content readability above all
                </li>
                <li class="flex items-start gap-2">
                  <Icon name="lucide:check" class="w-4 h-4 text-emerald-500 mt-0.5 flex-shrink-0" />
                  Test accessibility in multiple scenarios
                </li>
              </ul>
            </div>
            
            <div>
              <h3 class="text-lg font-semibold text-red-700 mb-4 flex items-center gap-2">
                <Icon name="lucide:x-circle" class="w-5 h-5" />
                Don'ts
              </h3>
              <ul class="space-y-3 text-slate-600">
                <li class="flex items-start gap-2">
                  <Icon name="lucide:x" class="w-4 h-4 text-red-500 mt-0.5 flex-shrink-0" />
                  Overuse primary color (creates rainbow effect)
                </li>
                <li class="flex items-start gap-2">
                  <Icon name="lucide:x" class="w-4 h-4 text-red-500 mt-0.5 flex-shrink-0" />
                  Mix multiple font families or weights randomly
                </li>
                <li class="flex items-start gap-2">
                  <Icon name="lucide:x" class="w-4 h-4 text-red-500 mt-0.5 flex-shrink-0" />
                  Use decorative animations that distract
                </li>
                <li class="flex items-start gap-2">
                  <Icon name="lucide:x" class="w-4 h-4 text-red-500 mt-0.5 flex-shrink-0" />
                  Ignore accessibility requirements
                </li>
                <li class="flex items-start gap-2">
                  <Icon name="lucide:x" class="w-4 h-4 text-red-500 mt-0.5 flex-shrink-0" />
                  Create cramped layouts without spacing
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      <!-- Brand Personality -->
      <section>
        <div class="inaplast-card text-center">
          <h2 class="text-2xl font-semibold text-slate-800 mb-6">Brand Personality</h2>
          <div class="flex flex-wrap justify-center gap-4 mb-8">
            <span class="px-4 py-2 bg-slate-100 text-slate-700 rounded-full font-medium">Professional</span>
            <span class="px-4 py-2 bg-slate-100 text-slate-700 rounded-full font-medium">Reliable</span>
            <span class="px-4 py-2 bg-slate-100 text-slate-700 rounded-full font-medium">Modern</span>
            <span class="px-4 py-2 bg-slate-100 text-slate-700 rounded-full font-medium">Efficient</span>
            <span class="px-4 py-2 bg-slate-100 text-slate-700 rounded-full font-medium">Trustworthy</span>
          </div>
          <p class="text-lg text-slate-600 max-w-2xl mx-auto leading-relaxed">
            "Elegance Through Restraint" - We believe in the power of strategic simplicity 
            to create memorable, professional experiences that build trust and confidence.
          </p>
        </div>
      </section>
      
    </div>
  </div>
</template>

<script setup lang="ts">
// Demo form data
const demoForm = reactive({
  name: '',
  email: ''
})

// SEO
useSeoMeta({
  title: 'Inaplast Brand System - Minimalist Design Guidelines',
  description: 'Complete brand system showcasing strategic color usage, typography, and component design for professional applications.'
})
</script>

<style scoped>
/* Import the brand system */
@import url('/assets/css/inaplast-brand-system.css');

/* Additional showcase-specific styles */
.brand-showcase {
  font-family: var(--inaplast-font-family);
}

/* Demo interaction enhancements */
.inaplast-btn-primary:hover,
.inaplast-btn-secondary:hover,
.inaplast-btn-glass:hover {
  cursor: pointer;
}

/* Visual hierarchy enhancements */
section h2 {
  position: relative;
}

section h2::after {
  content: '';
  position: absolute;
  bottom: -8px;
  left: 0;
  width: 60px;
  height: 3px;
  background: var(--inaplast-primary);
  border-radius: 2px;
  opacity: 0.6;
}
</style>