<template>
  <div class="data-table-container space-y-6">
    <!-- Table Header with Controls -->
    <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
      <div>
        <h3 class="text-lg font-semibold text-primary-800 mb-1">{{ title }}</h3>
        <p v-if="description" class="text-sm text-primary-600">{{ description }}</p>
      </div>
      
      <div class="flex flex-wrap gap-3">
        <!-- Search -->
        <div v-if="searchable" class="relative">
          <Icon name="lucide:search" class="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-primary-400" />
          <input
            v-model="searchQuery"
            type="text"
            placeholder="Search..."
            class="form-input-glass pl-9 pr-4 py-2 w-64"
          />
        </div>
        
        <!-- Actions -->
        <div class="flex gap-2">
          <DaisyButton size="sm" variant="ghost" icon="lucide:filter" @click="showFilters = !showFilters">
            Filter
          </DaisyButton>
          <DaisyButton size="sm" variant="ghost" icon="lucide:download" @click="exportData">
            Export
          </DaisyButton>
          <DaisyButton v-if="allowCreate" size="sm" variant="primary" icon="lucide:plus" @click="createNew">
            Add New
          </DaisyButton>
        </div>
      </div>
    </div>

    <!-- Filters Panel -->
    <div v-if="showFilters" class="glass-card p-4 animate-fade-in">
      <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label class="form-label text-sm">Status</label>
          <select v-model="filters.status" class="form-input-glass">
            <option value="">All Status</option>
            <option value="active">Active</option>
            <option value="pending">Pending</option>
            <option value="completed">Completed</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>
        <div>
          <label class="form-label text-sm">Date Range</label>
          <select v-model="filters.dateRange" class="form-input-glass">
            <option value="">All Time</option>
            <option value="today">Today</option>
            <option value="week">This Week</option>
            <option value="month">This Month</option>
            <option value="year">This Year</option>
          </select>
        </div>
        <div class="flex items-end gap-2">
          <DaisyButton size="sm" variant="ghost" @click="clearFilters">Clear</DaisyButton>
          <DaisyButton size="sm" variant="primary" @click="applyFilters">Apply</DaisyButton>
        </div>
      </div>
    </div>

    <!-- Data Table -->
    <div class="data-table-glass overflow-hidden">
      <div class="overflow-x-auto">
        <table class="daisy-table daisy-table-zebra w-full">
          <thead class="bg-glass-bg-primary-light">
            <tr>
              <th v-if="selectable" class="w-12">
                <input 
                  type="checkbox" 
                  class="daisy-checkbox daisy-checkbox-sm"
                  :checked="allSelected"
                  @change="toggleSelectAll"
                />
              </th>
              <th 
                v-for="column in columns" 
                :key="column.key"
                :class="[
                  'text-primary-800 font-medium',
                  { 'cursor-pointer hover:bg-glass-bg-primary-medium': column.sortable }
                ]"
                @click="column.sortable ? sortBy(column.key) : null"
              >
                <div class="flex items-center gap-2">
                  {{ column.label }}
                  <div v-if="column.sortable" class="flex flex-col">
                    <Icon 
                      name="lucide:chevron-up" 
                      class="w-3 h-3"
                      :class="[
                        sortField === column.key && sortOrder === 'asc' 
                          ? 'text-primary-700' 
                          : 'text-primary-400'
                      ]"
                    />
                    <Icon 
                      name="lucide:chevron-down" 
                      class="w-3 h-3 -mt-1"
                      :class="[
                        sortField === column.key && sortOrder === 'desc' 
                          ? 'text-primary-700' 
                          : 'text-primary-400'
                      ]"
                    />
                  </div>
                </div>
              </th>
              <th v-if="actions && actions.length > 0" class="w-24 text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr 
              v-for="(item, index) in paginatedData" 
              :key="item.id || index"
              class="hover:bg-glass-bg-primary-light transition-colors"
            >
              <td v-if="selectable">
                <input 
                  type="checkbox" 
                  class="daisy-checkbox daisy-checkbox-sm"
                  :checked="selectedItems.includes(item.id)"
                  @change="toggleItemSelection(item.id)"
                />
              </td>
              <td 
                v-for="column in columns" 
                :key="column.key"
                class="text-primary-600"
              >
                <div v-if="column.type === 'badge'" class="flex items-center">
                  <span 
                    :class="[
                      'daisy-badge daisy-badge-sm',
                      getBadgeClass(item[column.key])
                    ]"
                  >
                    {{ formatCellValue(item[column.key], column) }}
                  </span>
                </div>
                <div v-else-if="column.type === 'avatar'" class="flex items-center gap-3">
                  <div class="daisy-avatar">
                    <div class="w-8 h-8 rounded-full glass-icon-container">
                      <img v-if="item[column.key]" :src="item[column.key]" :alt="item.name" class="rounded-full" />
                      <Icon v-else name="lucide:user" class="w-4 h-4 text-primary-600" />
                    </div>
                  </div>
                  <span>{{ item.name || 'Unknown' }}</span>
                </div>
                <div v-else-if="column.type === 'currency'" class="font-mono">
                  {{ formatCurrency(item[column.key]) }}
                </div>
                <div v-else-if="column.type === 'date'" class="text-sm">
                  {{ formatDate(item[column.key]) }}
                </div>
                <div v-else>
                  {{ formatCellValue(item[column.key], column) }}
                </div>
              </td>
              <td v-if="actions && actions.length > 0" class="text-center">
                <div class="flex justify-center gap-1">
                  <button
                    v-for="action in actions"
                    :key="action.label"
                    :class="[
                      'glass-icon-container w-8 h-8',
                      action.variant === 'danger' ? 'hover:bg-error-100 hover:border-error-300' : ''
                    ]"
                    :title="action.label"
                    @click="action.handler(item)"
                  >
                    <Icon :name="action.icon" class="w-4 h-4 text-primary-600" />
                  </button>
                </div>
              </td>
            </tr>
            
            <!-- Empty State -->
            <tr v-if="paginatedData.length === 0">
              <td :colspan="totalColumns" class="text-center py-12">
                <div class="empty-state">
                  <div class="glass-icon-container w-16 h-16 mx-auto mb-4">
                    <Icon name="lucide:inbox" class="w-8 h-8 text-primary-400" />
                  </div>
                  <h3 class="empty-state-title">No data found</h3>
                  <p class="empty-state-description">
                    {{ searchQuery ? 'No results match your search criteria.' : 'There are no items to display.' }}
                  </p>
                  <DaisyButton v-if="allowCreate && !searchQuery" variant="primary" size="sm" @click="createNew">
                    Add First Item
                  </DaisyButton>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Pagination -->
      <div v-if="paginatedData.length > 0" class="flex flex-col sm:flex-row justify-between items-center p-4 border-t border-primary-200 bg-glass-bg-primary-light">
        <div class="text-sm text-primary-600 mb-4 sm:mb-0">
          Showing {{ startIndex + 1 }} to {{ Math.min(endIndex, filteredData.length) }} of {{ filteredData.length }} results
        </div>
        
        <div class="flex items-center gap-2">
          <select v-model="itemsPerPage" class="form-input-glass text-sm py-1 px-2">
            <option :value="10">10 per page</option>
            <option :value="20">20 per page</option>
            <option :value="50">50 per page</option>
            <option :value="100">100 per page</option>
          </select>
          
          <div class="daisy-join">
            <button 
              class="daisy-join-item daisy-btn daisy-btn-sm glass-icon-container"
              :disabled="currentPage === 1"
              @click="goToPage(currentPage - 1)"
            >
              <Icon name="lucide:chevron-left" class="w-4 h-4" />
            </button>
            
            <button
              v-for="page in visiblePages"
              :key="page"
              class="daisy-join-item daisy-btn daisy-btn-sm"
              :class="[
                currentPage === page 
                  ? 'bg-primary-200 text-primary-800 border-primary-300' 
                  : 'glass-icon-container'
              ]"
              @click="goToPage(page)"
            >
              {{ page }}
            </button>
            
            <button 
              class="daisy-join-item daisy-btn daisy-btn-sm glass-icon-container"
              :disabled="currentPage === totalPages"
              @click="goToPage(currentPage + 1)"
            >
              <Icon name="lucide:chevron-right" class="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Selected Items Actions -->
    <div 
      v-if="selectedItems.length > 0" 
      class="glass-card p-4 flex items-center justify-between animate-fade-in"
    >
      <span class="text-primary-800">{{ selectedItems.length }} item(s) selected</span>
      <div class="flex gap-2">
        <DaisyButton size="sm" variant="ghost" @click="bulkDelete">Delete Selected</DaisyButton>
        <DaisyButton size="sm" variant="primary" @click="bulkExport">Export Selected</DaisyButton>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
export interface TableColumn {
  key: string
  label: string
  sortable?: boolean
  type?: 'text' | 'badge' | 'avatar' | 'currency' | 'date'
  format?: (value: any) => string
}

export interface TableAction {
  label: string
  icon: string
  handler: (item: any) => void
  variant?: 'default' | 'danger'
}

interface Props {
  /** Table title */
  title?: string
  /** Table description */
  description?: string
  /** Column definitions */
  columns: TableColumn[]
  /** Table data */
  data: any[]
  /** Available actions for each row */
  actions?: TableAction[]
  /** Enable search functionality */
  searchable?: boolean
  /** Enable row selection */
  selectable?: boolean
  /** Allow creation of new items */
  allowCreate?: boolean
  /** Items per page options */
  itemsPerPage?: number
  /** Enable glassmorphism effects */
  glass?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  title: 'Data Table',
  searchable: true,
  selectable: false,
  allowCreate: true,
  itemsPerPage: 10,
  glass: true,
  data: () => [
    {
      id: 1,
      name: 'John Doe',
      email: 'john@example.com',
      status: 'active',
      role: 'Admin',
      avatar: null,
      amount: 1250.00,
      created_at: '2024-01-15T10:30:00Z',
      orders: 15
    },
    {
      id: 2,
      name: 'Jane Smith',
      email: 'jane@example.com',
      status: 'pending',
      role: 'User',
      avatar: null,
      amount: 850.50,
      created_at: '2024-01-20T14:22:00Z',
      orders: 8
    },
    {
      id: 3,
      name: 'Mike Johnson',
      email: 'mike@example.com',
      status: 'completed',
      role: 'Manager',
      avatar: null,
      amount: 2100.75,
      created_at: '2024-01-25T09:15:00Z',
      orders: 23
    },
    {
      id: 4,
      name: 'Sarah Wilson',
      email: 'sarah@example.com',
      status: 'cancelled',
      role: 'User',
      avatar: null,
      amount: 320.00,
      created_at: '2024-01-28T16:45:00Z',
      orders: 3
    }
  ],
  columns: () => [
    { key: 'name', label: 'Name', sortable: true, type: 'avatar' },
    { key: 'email', label: 'Email', sortable: true },
    { key: 'role', label: 'Role', sortable: true },
    { key: 'status', label: 'Status', sortable: true, type: 'badge' },
    { key: 'amount', label: 'Amount', sortable: true, type: 'currency' },
    { key: 'orders', label: 'Orders', sortable: true },
    { key: 'created_at', label: 'Created', sortable: true, type: 'date' }
  ],
  actions: () => [
    { label: 'Edit', icon: 'lucide:edit', handler: (item) => console.log('Edit:', item) },
    { label: 'View', icon: 'lucide:eye', handler: (item) => console.log('View:', item) },
    { label: 'Delete', icon: 'lucide:trash', handler: (item) => console.log('Delete:', item), variant: 'danger' }
  ]
})

const emit = defineEmits<{
  'create-new': []
  'export-data': [data: any[]]
  'bulk-delete': [ids: any[]]
  'bulk-export': [items: any[]]
}>()

// Reactive state
const searchQuery = ref('')
const showFilters = ref(false)
const currentPage = ref(1)
const itemsPerPage = ref(props.itemsPerPage)
const sortField = ref('')
const sortOrder = ref<'asc' | 'desc'>('asc')
const selectedItems = ref<any[]>([])

const filters = ref({
  status: '',
  dateRange: ''
})

// Computed properties
const filteredData = computed(() => {
  let result = [...props.data]
  
  // Apply search
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    result = result.filter(item => 
      Object.values(item).some(value => 
        String(value).toLowerCase().includes(query)
      )
    )
  }
  
  // Apply filters
  if (filters.value.status) {
    result = result.filter(item => item.status === filters.value.status)
  }
  
  // Apply sorting
  if (sortField.value) {
    result.sort((a, b) => {
      const aVal = a[sortField.value]
      const bVal = b[sortField.value]
      
      if (aVal < bVal) return sortOrder.value === 'asc' ? -1 : 1
      if (aVal > bVal) return sortOrder.value === 'asc' ? 1 : -1
      return 0
    })
  }
  
  return result
})

const totalPages = computed(() => Math.ceil(filteredData.value.length / itemsPerPage.value))

const startIndex = computed(() => (currentPage.value - 1) * itemsPerPage.value)
const endIndex = computed(() => currentPage.value * itemsPerPage.value)

const paginatedData = computed(() => 
  filteredData.value.slice(startIndex.value, endIndex.value)
)

const visiblePages = computed(() => {
  const pages = []
  const start = Math.max(1, currentPage.value - 2)
  const end = Math.min(totalPages.value, currentPage.value + 2)
  
  for (let i = start; i <= end; i++) {
    pages.push(i)
  }
  
  return pages
})

const allSelected = computed(() => 
  paginatedData.value.length > 0 && 
  paginatedData.value.every(item => selectedItems.value.includes(item.id))
)

const totalColumns = computed(() => {
  let count = props.columns.length
  if (props.selectable) count++
  if (props.actions && props.actions.length > 0) count++
  return count
})

// Methods
const sortBy = (field: string) => {
  if (sortField.value === field) {
    sortOrder.value = sortOrder.value === 'asc' ? 'desc' : 'asc'
  } else {
    sortField.value = field
    sortOrder.value = 'asc'
  }
  currentPage.value = 1
}

const goToPage = (page: number) => {
  if (page >= 1 && page <= totalPages.value) {
    currentPage.value = page
  }
}

const toggleSelectAll = () => {
  if (allSelected.value) {
    selectedItems.value = selectedItems.value.filter(id => 
      !paginatedData.value.some(item => item.id === id)
    )
  } else {
    const newSelections = paginatedData.value
      .map(item => item.id)
      .filter(id => !selectedItems.value.includes(id))
    selectedItems.value = [...selectedItems.value, ...newSelections]
  }
}

const toggleItemSelection = (id: any) => {
  const index = selectedItems.value.indexOf(id)
  if (index > -1) {
    selectedItems.value.splice(index, 1)
  } else {
    selectedItems.value.push(id)
  }
}

const clearFilters = () => {
  filters.value = {
    status: '',
    dateRange: ''
  }
  currentPage.value = 1
}

const applyFilters = () => {
  currentPage.value = 1
}

const createNew = () => {
  emit('create-new')
}

const exportData = () => {
  emit('export-data', filteredData.value)
}

const bulkDelete = () => {
  emit('bulk-delete', selectedItems.value)
  selectedItems.value = []
}

const bulkExport = () => {
  const selectedData = props.data.filter(item => selectedItems.value.includes(item.id))
  emit('bulk-export', selectedData)
}

// Formatting helpers
const formatCellValue = (value: any, column: TableColumn) => {
  if (column.format) {
    return column.format(value)
  }
  return value
}

const formatCurrency = (value: number) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD'
  }).format(value)
}

const formatDate = (value: string) => {
  return new Date(value).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  })
}

const getBadgeClass = (status: string) => {
  const statusClasses = {
    active: 'daisy-badge-success',
    pending: 'daisy-badge-warning',
    completed: 'daisy-badge-info',
    cancelled: 'daisy-badge-error'
  } as const
  
  return statusClasses[status as keyof typeof statusClasses] || 'daisy-badge-neutral'
}

// Reset page when search changes
watch(searchQuery, () => {
  currentPage.value = 1
})

watch(itemsPerPage, () => {
  currentPage.value = 1
})
</script>

<style scoped>
/* Data table container styling */
.data-table-container {
  width: 100%;
}

/* Enhanced glass data table with #799EFF primary integration */
.data-table-glass {
  background: var(--glass-bg-primary);
  backdrop-filter: var(--blur-md);
  -webkit-backdrop-filter: var(--blur-md);
  border: 1px solid var(--glass-border-primary);
  border-radius: var(--radius-glass);
  overflow: hidden;
  box-shadow: var(--shadow-primary);
  position: relative;
}

.data-table-glass::before {
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

/* Table styling */
.daisy-table {
  background: transparent;
}

.daisy-table th {
  background: var(--glass-bg-primary-light);
  color: var(--primary-800);
  border-bottom: 1px solid var(--glass-border-primary-light);
  font-weight: 600;
  font-size: 0.875rem;
  padding: 1rem;
  text-shadow: 0 1px 2px rgba(121, 158, 255, 0.1);
}

.daisy-table td {
  color: var(--primary-600);
  border-bottom: 1px solid var(--glass-border-primary-light);
  padding: 1rem;
}

.daisy-table tr:hover {
  background: var(--glass-bg-primary-light);
  box-shadow: 0 2px 8px rgba(121, 158, 255, 0.1);
}

.daisy-table tr:last-child td {
  border-bottom: none;
}

/* Enhanced zebra striping with primary glass effect */
.daisy-table-zebra tbody tr:nth-child(even) {
  background: rgba(121, 158, 255, 0.02);
}

.daisy-table-zebra tbody tr:nth-child(even):hover {
  background: var(--glass-bg-primary-light);
  box-shadow: 0 2px 8px rgba(121, 158, 255, 0.1);
}

/* Badge styling in table */
.daisy-table .daisy-badge {
  backdrop-filter: var(--blur-sm);
  -webkit-backdrop-filter: var(--blur-sm);
  font-size: 0.75rem;
}

/* Action buttons styling */
.glass-icon-container {
  transition: all 0.2s ease-in-out;
}

.glass-icon-container:hover {
  transform: scale(1.1);
  background: var(--glass-bg-primary-medium);
  border-color: var(--primary-400);
  box-shadow: 0 4px 12px rgba(121, 158, 255, 0.2);
}

/* Enhanced pagination styling with primary colors */
.daisy-join .daisy-btn {
  backdrop-filter: var(--blur-sm);
  -webkit-backdrop-filter: var(--blur-sm);
  background: var(--glass-bg-primary-light);
  border-color: var(--glass-border-primary-light);
  color: var(--primary-600);
  box-shadow: 0 2px 4px rgba(121, 158, 255, 0.1);
}

.daisy-join .daisy-btn:hover {
  background: var(--glass-bg-primary-medium);
  color: var(--primary-800);
  border-color: var(--primary-400);
  box-shadow: 0 4px 8px rgba(121, 158, 255, 0.15);
}

.daisy-join .daisy-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

/* Empty state styling */
.empty-state {
  padding: 3rem 1.5rem;
  text-align: center;
}

.empty-state-title {
  font-size: 1.25rem;
  font-weight: 600;
  color: var(--primary-800);
  margin-bottom: 0.5rem;
  text-shadow: 0 1px 2px rgba(121, 158, 255, 0.1);
}

.empty-state-description {
  color: var(--primary-600);
  margin-bottom: 1.5rem;
  max-width: 28rem;
  margin-left: auto;
  margin-right: auto;
  line-height: 1.6;
}

/* Enhanced checkbox styling with primary colors */
.daisy-checkbox {
  accent-color: var(--primary-500);
  transform: scale(1.1);
  transition: all 0.2s ease;
}

.daisy-checkbox:checked {
  box-shadow: 0 0 0 2px rgba(121, 158, 255, 0.3);
}

.daisy-checkbox:focus {
  outline: 2px solid var(--primary-400);
  outline-offset: 2px;
}

/* Enhanced form input styling with primary theming */
.data-table-container .form-input-glass {
  background: var(--glass-bg-primary-light);
  border: 1px solid var(--glass-border-primary-light);
  color: var(--primary-800);
  box-shadow: 0 2px 4px rgba(121, 158, 255, 0.05);
  transition: all 0.2s ease;
}

.data-table-container .form-input-glass:focus {
  background: var(--glass-bg-primary-medium);
  border-color: var(--primary-400);
  box-shadow: 0 0 0 3px rgba(121, 158, 255, 0.2), 0 4px 8px rgba(121, 158, 255, 0.1);
  transform: translateY(-1px);
}

.data-table-container .form-input-glass::placeholder {
  color: var(--primary-400);
  font-style: italic;
}

/* Enhanced avatar styling with primary colors */
.daisy-avatar .glass-icon-container {
  background: var(--glass-bg-primary-medium);
  border: 1px solid var(--glass-border-primary-light);
  box-shadow: 0 2px 8px rgba(121, 158, 255, 0.1);
}

/* Responsive adjustments */
@media (max-width: 768px) {
  .data-table-container .flex.justify-between {
    flex-direction: column;
    align-items: stretch;
    gap: 1rem;
  }
  
  .data-table-container .w-64 {
    width: 100%;
  }
  
  .daisy-table th,
  .daisy-table td {
    padding: 0.75rem 0.5rem;
    font-size: 0.875rem;
  }
  
  .data-table-container .grid.grid-cols-3 {
    grid-template-columns: 1fr;
  }
}

/* Animation classes */
.animate-fade-in {
  animation: fadeIn 0.3s ease-out;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* Enhanced sorting indicator styling */
.daisy-table th.cursor-pointer:hover {
  background: var(--glass-bg-primary-medium);
  box-shadow: 0 2px 8px rgba(121, 158, 255, 0.15);
  transform: translateY(-1px);
  transition: all 0.2s ease;
}

/* Print styles */
@media print {
  .data-table-container .flex.justify-between,
  .data-table-container .glass-card:last-child {
    display: none;
  }
  
  .data-table-glass {
    box-shadow: none;
    border: 1px solid #000;
  }
  
  .daisy-table th,
  .daisy-table td {
    color: #000;
    background: transparent;
  }
}
</style>