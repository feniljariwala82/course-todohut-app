import { DateTime } from 'luxon'
import { BaseModel, column } from '@ioc:Adonis/Lucid/Orm'

export default class Task extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public title: string

  @column()
  public description: string

  @column()
  public priority: string

  @column()
  public user_id: number

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime

  public static storeTask = async (data: StoreTaskType) => {
    await this.create({
      title: data.title,
      description: data.description,
      priority: data.priority,
      user_id: data.userId,
    })

    return Promise.resolve('Task created')
  }

  public static updateTask = async (data: UpdateTaskType) => {
    const exists = await this.find(data.id)
    if (!exists) {
      return Promise.reject(new Error('Task not found'))
    }

    if (data.title) {
      exists.title = data.title
    }

    if (data.description) {
      exists.description = data.description
    }

    if (data.priority) {
      exists.priority = data.priority
    }

    await exists.save()

    return Promise.resolve('Task updated')
  }

  public static deleteTaskById = async (id: number) => {
    const task = await this.findOrFail(id)
    await task.delete()
    return Promise.resolve('Task deleted')
  }
}
