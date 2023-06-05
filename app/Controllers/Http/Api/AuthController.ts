import Env from '@ioc:Adonis/Core/Env'
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { rules, schema, validator } from '@ioc:Adonis/Core/Validator'

export default class AuthController {
  public async login({ request, response, auth }: HttpContextContract) {
    console.log(request.all())

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
      reporter: validator.reporters.api,
    })

    try {
      const user = await auth.use('api').attempt(payload.email, payload.password, {
        expiresIn: '2 hours',
      })
      response.cookie('adonis-session', user.token, {
        /**
         * When setting the httpOnly attribute to true for a cookie,
         * it means that the cookie cannot be accessed or modified by client-side JavaScript code.
         * The cookie is only accessible by the server and is not exposed to any client-side scripts running in the browser.
         */
        httpOnly: true,
        /**
         * When setting the secure attribute to true for a cookie,
         * it means that the cookie should only be sent over secure (HTTPS) connections. In other words,
         * the cookie will only be transmitted if the request is made using an encrypted connection.
         */
        secure: Env.get('NODE_ENV') === 'production',
        /**
         * Lax: The cookie is sent in cross-origin GET requests,
         * such as when a user clicks on a link from an external website.
         * This is the default value and balances security and usability.
         */
        sameSite: 'lax',
        /**
         * default expiry time of cookie
         */
        maxAge: '2h',
      })
      return response.ok(user.user)
    } catch (error) {
      console.error(error)
      return response.badRequest(error.message)
    }
  }

  public async logout({ response, auth }: HttpContextContract) {
    try {
      await auth.use('api').revoke()
      response.clearCookie('adonis-session')
      return response.ok('Logged out')
    } catch (error) {
      console.error(error)
      return response.badRequest(error.message)
    }
  }
}
