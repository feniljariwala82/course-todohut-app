import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import User from 'App/Models/User'
import LoginValidator from 'App/Validators/LoginValidator'
import SignupValidator from 'App/Validators/SignupValidator'

const HEADER_KEY = 'App-User-Agent'
const CLIENT_AGENT = {
  WEB: 'TodoHutWebApp/1.0',
  MOBILE: 'TodoHutMobileApp/1.0',
}

export default class AuthController {
  public async login({ request, response, auth }: HttpContextContract) {
    /**
     * when we set Accept=application/json
     * then we don't need to manually define such reporter every time we make api request
     * ref: https://docs.adonisjs.com/guides/validator/introduction#requests-with-acceptapplicationjson-header
     */

    /**
     * Validate request body against the schema
     */
    const payload = await request.validate(LoginValidator)

    try {
      const agent = request.header(HEADER_KEY)
      switch (agent) {
        case CLIENT_AGENT.WEB: {
          await auth.use('web').attempt(payload.email, payload.password)
          return response.ok({ message: 'Logged in' })
        }

        case CLIENT_AGENT.MOBILE: {
          const user = await auth.use('api').attempt(payload.email, payload.password)
          return response.ok(user.token)
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
     * when we set Accept=application/json
     * then we don't need to manually define such reporter every time we make api request
     * ref: https://docs.adonisjs.com/guides/validator/introduction#requests-with-acceptapplicationjson-header
     */

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

      return response.ok({ message: result })
    } catch (error) {
      console.error(error)
      return response.badRequest(error.message)
    }
  }
}
