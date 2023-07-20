import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { rules, schema, validator } from '@ioc:Adonis/Core/Validator'
import User from 'App/Models/User'

const HEADER_KEY = 'App-User-Agent'
const CLIENT_AGENT = {
  WEB: 'TodoHutWebApp/1.0',
  MOBILE: 'TodoHutMobileApp/1.0',
}

export default class AuthController {
  public async login({ request, response, auth }: HttpContextContract) {
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
      /**
       * when we set Accept=application/json
       * then we don't need to manually define such reporter every time we make api request
       * ref: https://docs.adonisjs.com/guides/validator/introduction#requests-with-acceptapplicationjson-header
       */
      reporter: validator.reporters.api,
    })

    try {
      const agent = request.header(HEADER_KEY)
      switch (agent) {
        case CLIENT_AGENT.WEB: {
          await auth.use('web').attempt(payload.email, payload.password)
          return response.ok({ message: 'Logged in' })
        }

        case CLIENT_AGENT.MOBILE: {
          const user = await auth.use('api').attempt(payload.email, payload.password)
          return user.token
        }

        default:
          throw new Error('Invalid user agent')
      }
    } catch (error) {
      console.error(error)
      return response.badRequest(error.message)
    }
  }

  public async logout({ response, auth, request }: HttpContextContract) {
    try {
      const agent = request.header(HEADER_KEY)
      switch (agent) {
        case CLIENT_AGENT.WEB: {
          await auth.use('web').logout()
          break
        }

        case CLIENT_AGENT.MOBILE: {
          await auth.use('api').logout()
          break
        }

        default:
          throw new Error('Invalid user agent')
      }

      return response.ok({ message: 'Logged out' })
    } catch (error) {
      console.error(error)
      return response.badRequest(error.message)
    }
  }

  public async user({ response, auth }: HttpContextContract) {
    try {
      return response.ok(auth.user)
    } catch (error) {
      return response.badRequest(error.message)
    }
  }

  public async signup({ request, response }: HttpContextContract) {
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
      lastName: schema.string([rules.required(), rules.alpha(), rules.trim(), rules.maxLength(50)]),
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
      /**
       * when we set Accept=application/json
       * then we don't need to manually define such reporter every time we make api request
       * ref: https://docs.adonisjs.com/guides/validator/introduction#requests-with-acceptapplicationjson-header
       */
      reporter: validator.reporters.api,
    })

    try {
      const result = await User.storeUser({
        email: payload.email,
        firstName: payload.firstName,
        lastName: payload.lastName,
        password: payload.password,
      })

      return response.ok(result)
    } catch (error) {
      console.error(error)
      return response.badRequest(error.message)
    }
  }
}
