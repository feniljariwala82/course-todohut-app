import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import User from 'App/Models/User'
import LoginValidator from 'App/Validators/LoginValidator'
import SignupValidator from 'App/Validators/SignupValidator'

export default class AuthController {
  public signup = async ({ view, request, session, response }: HttpContextContract) => {
    switch (request.method()) {
      case 'POST':
        /**
         * Validate request body against the schema
         */
        const payload = await request.validate(SignupValidator)

        try {
          const result = await User.storeUser({
            email: payload.email,
            firstName: payload.firstName,
            lastName: payload.lastName,
            password: payload.password,
          })

          session.flash('success', result)
          return response.redirect().toPath('/')
        } catch (error) {
          console.error(error)
          session.flash('error', error.message)
          return response.redirect().back()
        }

      // GET
      default:
        const html = await view.render('auth/signup')
        return html
    }
  }

  public login = async ({ view }: HttpContextContract) => {
    const html = await view.render('auth/login')
    return html
  }

  public loginPost = async ({ request, response, session, auth }: HttpContextContract) => {
    /**
     * Validate request body against the schema
     */
    const payload = await request.validate(LoginValidator)

    try {
      await auth.use('web').attempt(payload.email, payload.password)
      session.flash('success', 'Logged in')
      return response.redirect().toRoute('tasks.index')
    } catch (error) {
      console.error(error)
      session.flash('error', error.message)
      return response.redirect().back()
    }
  }

  public logout = async ({ auth, response }: HttpContextContract) => {
    await auth.use('web').logout()
    return response.redirect().toRoute('login')
  }
}
