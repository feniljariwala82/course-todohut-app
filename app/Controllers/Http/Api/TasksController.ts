import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Task from 'App/Models/Task'
import User from 'App/Models/User'
import CreateTaskValidator from 'App/Validators/CreateTaskValidator'
import UpdateTaskValidator from 'App/Validators/UpdateTaskValidator'

export default class TasksController {
  public index = async ({ auth, response }: HttpContextContract) => {
    try {
      const user = await User.getAllTaskByUserId(auth.user!.id)
      return response.ok(user.tasks)
    } catch (error) {
      console.error(error)
      return response.badRequest(error.message)
    }
  }

  public store = async ({ request, auth, response }: HttpContextContract) => {
    const payload = await request.validate(CreateTaskValidator)

    try {
      const result = await Task.storeTask({
        title: payload.title,
        description: payload.description,
        priority: payload.priority,
        userId: auth.user!.id,
      })
      return response.ok({ message: result })
    } catch (error) {
      console.error(error)
      return response.badRequest(error.message)
    }
  }

  public show = async ({ params, response, bouncer }: HttpContextContract) => {
    const { id } = params

    try {
      const task = await Task.findOrFail(id)

      // authorization
      await bouncer.authorize('showTask', task)

      return response.ok(task)
    } catch (error) {
      console.error(error)
      return response.badRequest(error.message)
    }
  }

  public update = async ({ request, params, response, bouncer }: HttpContextContract) => {
    const { id } = params

    const payload = await request.validate(UpdateTaskValidator)

    try {
      const task = await Task.findOrFail(id)

      // authorization
      await bouncer.authorize('editTask', task)

      const result = await Task.updateTask({
        id,
        title: payload.title,
        description: payload.description,
        priority: payload.priority,
      })
      return response.ok({ message: result })
    } catch (error) {
      console.error(error)
      return response.badRequest(error.message)
    }
  }

  public destroy = async ({ params, response, bouncer }: HttpContextContract) => {
    const { id } = params

    try {
      const task = await Task.findOrFail(id)

      // authorization
      await bouncer.authorize('editTask', task)

      const result = await Task.deleteTaskById(id)
      return response.ok({ message: result })
    } catch (error) {
      console.error(error)
      return response.badRequest(error.message)
    }
  }
}
