interface StoreTaskType {
  title: string
  description: string
  priority: string
  userId: number
}

interface UpdateTaskType {
  id: number
  title?: string
  description?: string
  priority?: string
}
