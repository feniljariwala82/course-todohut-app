import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class CookieParser {
  public async handle({ request }: HttpContextContract, next: () => Promise<void>) {
    const token = request.cookie('x-auth-token')

    console.log(request.request.headers, 'before')

    // With default value
    request.header('Authorization', `Bearer ${token}`)

    console.log(request.request.headers, 'after')

    // code for middleware goes here. ABOVE THE NEXT CALL
    await next()
  }
}
