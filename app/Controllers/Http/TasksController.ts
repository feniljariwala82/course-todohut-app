import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Task from 'App/Models/Task'
import CreateTaskValidator from 'App/Validators/CreateTaskValidator'
import User from 'App/Models/User'
import UpdateTaskValidator from 'App/Validators/UpdateTaskValidator'

export default class TasksController {
  public index = async ({ view, auth, session, response }: HttpContextContract) => {
    try {
      const user = await User.getAllTaskByUserId(auth.user!.id)
      const html = await view.render('tasks/index', { tasks: user.tasks })
      return html
    } catch (error) {
      console.error(error)
      session.flash('error', error.message)
      return response.redirect().back()
    }
  }

  public create = async ({ view }: HttpContextContract) => {
    const html = await view.render('tasks/create')
    return html
  }

  public store = async ({ request, auth, session, response }: HttpContextContract) => {
    const payload = await request.validate(CreateTaskValidator)

    try {
      const result = await Task.storeTask({
        title: payload.title,
        description: payload.description,
        priority: payload.priority,
        userId: auth.user!.id,
      })
      session.flash('success', result)
      return response.redirect().toRoute('tasks.index')
    } catch (error) {
      console.error(error)
      session.flash('error', error.message)
      return response.redirect().back()
    }
  }

  public show = async ({ params, session, response, view, bouncer }: HttpContextContract) => {
    const { id } = params

    try {
      const task = await Task.findOrFail(id)

      // authorization
      await bouncer.authorize('showTask', task)

      const html = await view.render('tasks/show', { task })
      return html
    } catch (error) {
      console.error(error)
      session.flash('error', error.message)
      return response.redirect().toRoute('tasks.index')
    }
  }

  public edit = async ({ params, session, response, view, bouncer }: HttpContextContract) => {
    const { id } = params

    try {
      const task = await Task.findOrFail(id)

      // authorization
      await bouncer.authorize('editTask', task)

      const html = await view.render('tasks/edit', { task })
      return html
    } catch (error) {
      console.error(error)
      session.flash('error', error.message)
      return response.redirect().toRoute('tasks.index')
    }
  }

  public update = async ({ request, params, session, response, bouncer }: HttpContextContract) => {
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
      session.flash('success', result)
      return response.redirect().toRoute('tasks.show', { id })
    } catch (error) {
      console.error(error)
      session.flash('error', error.message)
      return response.redirect().back()
    }
  }

  public destroy = async ({ params, session, response, bouncer }: HttpContextContract) => {
    const { id } = params

    try {
      const task = await Task.findOrFail(id)

      // authorization
      await bouncer.authorize('editTask', task)

      const result = await Task.deleteTaskById(id)
      session.flash('success', result)
      return response.redirect().toRoute('tasks.index')
    } catch (error) {
      console.error(error)
      session.flash('error', error.message)
      return response.redirect().back()
    }
  }
}
