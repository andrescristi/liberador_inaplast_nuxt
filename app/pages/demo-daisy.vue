<template>
  <div class="min-h-screen p-8">
    <!-- Header -->
    <div class="glass-card p-6 mb-8">
      <h1 class="text-3xl font-bold text-primary-800 mb-4">
        DaisyUI + #799EFF Primary Integration Demo
      </h1>
      <p class="text-primary-600 mb-4">
        This page demonstrates the new #799EFF primary color integration with DaisyUI components and glassmorphism design system.
      </p>
      
      <!-- Theme Switcher -->
      <div class="flex gap-4 items-center">
        <span class="text-primary-700">Theme:</span>
        <button 
          @click="switchToDaisyTheme" 
          class="btn-glass-secondary"
          :class="{ 'btn-glass-primary': isDaisyThemeActive }"
        >
          DaisyUI Theme
        </button>
        <button 
          @click="switchToGlassTheme" 
          class="btn-glass-secondary"
          :class="{ 'btn-glass-primary': !isDaisyThemeActive }"
        >
          Glass Theme
        </button>
      </div>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
      <!-- DaisyUI Components with Glass -->
      <div class="space-y-6">
        <h2 class="text-2xl font-bold text-primary-800">DaisyUI + Primary Glass Components</h2>
        
        <!-- Buttons -->
        <div class="glass-card p-6">
          <h3 class="text-lg font-semibold text-primary-800 mb-4">Enhanced Primary Buttons</h3>
          <div class="flex flex-wrap gap-3">
            <DaisyButton variant="primary" :glass="true">Primary Glass</DaisyButton>
            <DaisyButton variant="secondary" :glass="true">Secondary Glass</DaisyButton>
            <DaisyButton variant="accent" :glass="true">Accent Glass</DaisyButton>
            <DaisyButton variant="ghost" :glass="true">Ghost Glass</DaisyButton>
            <DaisyButton variant="primary" :loading="true" :glass="true">Loading</DaisyButton>
            <DaisyButton variant="primary" icon="lucide:heart" :glass="true">With Icon</DaisyButton>
          </div>
        </div>

        <!-- Cards -->
        <div class="space-y-4">
          <h3 class="text-lg font-semibold text-primary-800">Enhanced Primary Cards</h3>
          
          <DaisyCard
            title="Glass Card with DaisyUI"
            description="This card uses DaisyUI structure with #799EFF primary glassmorphism styling."
            badge="New"
            :glass="true"
            :actions="[
              { label: 'Learn More', onClick: () => console.log('Learn more clicked') },
              { label: 'Buy Now', onClick: () => console.log('Buy now clicked'), variant: 'primary' }
            ]"
          />
          
          <DaisyCard
            title="Image Card"
            description="Card with image and enhanced #799EFF primary glass effects."
            :glass="true"
          >
            <template #image>
              <div class="w-full h-48 bg-gradient-to-r from-purple-400 to-blue-500 rounded-xl flex items-center justify-center">
                <span class="text-white text-xl font-bold">Demo Image</span>
              </div>
            </template>
          </DaisyCard>
        </div>

        <!-- Pure DaisyUI Components -->
        <div class="glass-card p-6">
          <h3 class="text-lg font-semibold text-primary-800 mb-4">Primary-Themed DaisyUI Components</h3>
          
          <!-- Form Controls -->
          <div class="space-y-4">
            <div>
              <label class="daisy-label">
                <span class="daisy-label-text text-primary-700">Email</span>
              </label>
              <input type="email" placeholder="Email" :class="getDaisyGlassClasses('input')" />
            </div>
            
            <div>
              <label class="daisy-label">
                <span class="daisy-label-text text-primary-700">Message</span>
              </label>
              <textarea placeholder="Your message" :class="getDaisyGlassClasses('textarea')"></textarea>
            </div>
            
            <div>
              <label class="daisy-label">
                <span class="daisy-label-text text-primary-700">Country</span>
              </label>
              <select :class="getDaisyGlassClasses('select')">
                <option disabled selected>Pick your country</option>
                <option>United States</option>
                <option>Canada</option>
                <option>Mexico</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      <!-- Original Glass Components -->
      <div class="space-y-6">
        <h2 class="text-2xl font-bold text-primary-800">Original Glass Components</h2>
        
        <!-- Original Buttons -->
        <div class="glass-card p-6">
          <h3 class="text-lg font-semibold text-primary-800 mb-4">Original Glass Buttons</h3>
          <div class="flex flex-wrap gap-3">
            <Button variant="primary">Primary Glass</Button>
            <Button variant="secondary">Secondary Glass</Button>
            <Button variant="destructive">Destructive Glass</Button>
            <Button variant="magical" sparkle>Magical Button</Button>
            <Button variant="primary" :loading="true">Loading</Button>
            <Button variant="primary" icon="lucide:star">With Icon</Button>
          </div>
        </div>

        <!-- Original Cards -->
        <div class="space-y-4">
          <h3 class="text-lg font-semibold text-primary-800">Original Glass Cards</h3>
          
          <Card title="Original Glass Card" hover>
            <p class="text-primary-600">
              This is your original glass card component with all the magical animations and effects.
            </p>
            <template #footer>
              <div class="flex justify-end space-x-3">
                <Button variant="secondary">Cancel</Button>
                <Button variant="primary">Confirm</Button>
              </div>
            </template>
          </Card>
        </div>

        <!-- Comparison Table -->
        <div class="glass-card p-6">
          <h3 class="text-lg font-semibold text-primary-800 mb-4">Comparison</h3>
          <div class="overflow-x-auto">
            <table class="daisy-table daisy-table-zebra w-full">
              <thead>
                <tr class="text-primary-800">
                  <th>Aspect</th>
                  <th>DaisyUI + Glass</th>
                  <th>Original Glass</th>
                </tr>
              </thead>
              <tbody class="text-primary-600">
                <tr>
                  <td>Development Speed</td>
                  <td>⚡ Fast</td>
                  <td>🐌 Custom</td>
                </tr>
                <tr>
                  <td>Customization</td>
                  <td>⚙️ Limited</td>
                  <td>🎨 Full Control</td>
                </tr>
                <tr>
                  <td>Bundle Size</td>
                  <td>📦 Larger</td>
                  <td>🪶 Optimized</td>
                </tr>
                <tr>
                  <td>Maintenance</td>
                  <td>🔄 Community</td>
                  <td>🛠️ Your Code</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <!-- Status Alerts -->
        <div class="space-y-3">
          <h3 class="text-lg font-semibold text-primary-800">Alerts with Primary Glass</h3>
          <div :class="getDaisyGlassClasses('alert')" class="daisy-alert daisy-alert-info">
            <Icon name="lucide:info" class="w-5 h-5" />
            <span class="text-primary-800">DaisyUI info alert with #799EFF glass effect!</span>
          </div>
          <div :class="getDaisyGlassClasses('alert')" class="daisy-alert daisy-alert-success">
            <Icon name="lucide:check-circle" class="w-5 h-5" />
            <span class="text-primary-800">Success alert with #799EFF glassmorphism!</span>
          </div>
          <div :class="getDaisyGlassClasses('alert')" class="daisy-alert daisy-alert-warning">
            <Icon name="lucide:alert-triangle" class="w-5 h-5" />
            <span class="text-primary-800">Warning alert with #799EFF glass styling!</span>
          </div>
        </div>
      </div>
    </div>

    <!-- Footer -->
    <div class="glass-card p-6 mt-8">
      <h3 class="text-lg font-semibold text-primary-800 mb-2">#799EFF Integration Strategy</h3>
      <p class="text-primary-600 mb-4">
        The new #799EFF primary color is now perfectly integrated with DaisyUI components, providing 
        a cohesive and professional design system that maintains the beautiful glassmorphism effects 
        while ensuring consistent branding throughout your application.
      </p>
      <div class="flex gap-3">
        <DaisyButton variant="primary" icon="lucide:book" :glass="true">
          View Documentation
        </DaisyButton>
        <Button variant="magical" sparkle>
          Create Magic ✨
        </Button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  layout: 'default'
})

const { switchToDaisyTheme, switchToGlassTheme, getDaisyGlassClasses, isDaisyThemeActive } = useDaisyUI()
</script>