import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { rules, schema } from '@ioc:Adonis/Core/Validator'
import User from 'App/Models/User'

export default class AuthController {
  public signup = async ({ view, request, session, response }: HttpContextContract) => {
    switch (request.method()) {
      case 'POST':
        /**
         * Schema definition
         */
        const postSchema = schema.create({
          firstName: schema.string([
            rules.required(),
            rules.alpha(),
            rules.trim(),
            rules.maxLength(50),
          ]),
          lastName: schema.string([
            rules.required(),
            rules.alpha(),
            rules.trim(),
            rules.maxLength(50),
          ]),
          email: schema.string([rules.required(), rules.email(), rules.trim()]),
          password: schema.string([rules.required(), rules.trim(), rules.minLength(8)]),
        })

        /**
         * Validate request body against the schema
         */
        const payload = await request.validate({
          schema: postSchema,
          messages: {
            'firstName.required': 'First name is required',
            'firstName.alpha': 'The first name must contain letters only',
            'firstName.maxLength': 'The first name should be maximum 50 characters long',

            'lastName.required': 'Last name is required',
            'lastName.alpha': 'The last name must contain letters only',
            'lastName.maxLength': 'The last name should be maximum 50 characters long',

            'email.required': 'Email is required',
            'email.email': 'Email should be a valid email address',

            'password.required': 'Password is required',
            'password.minLength': 'Password should have at least 8 characters',
          },
        })

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
     * Schema definition
     */
    const postSchema = schema.create({
      email: schema.string([rules.required(), rules.email(), rules.trim()]),
      password: schema.string([rules.required(), rules.trim(), rules.minLength(8)]),
    })

    /**
     * Validate request body against the schema
     */
    const payload = await request.validate({
      schema: postSchema,
      messages: {
        'email.required': 'Email is required',
        'email.email': 'Email should be a valid email address',

        'password.required': 'Password is required',
        'password.minLength': 'Password should have at least 8 characters',
      },
    })

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
