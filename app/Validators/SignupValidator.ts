import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { CustomMessages, rules, schema } from '@ioc:Adonis/Core/Validator'

export default class SignupValidator {
  constructor(protected ctx: HttpContextContract) {}

  public schema = schema.create({
    firstName: schema.string([rules.required(), rules.alpha(), rules.trim(), rules.maxLength(50)]),
    lastName: schema.string([rules.required(), rules.alpha(), rules.trim(), rules.maxLength(50)]),
    email: schema.string([rules.required(), rules.email(), rules.trim()]),
    password: schema.string([rules.required(), rules.trim(), rules.minLength(8)]),
  })

  public messages: CustomMessages = {
    'email.required': 'Email is required',
    'email.email': 'Email should be a valid email address',
    'password.required': 'Password is required',
    'password.minLength': 'Password should have at least 8 characters',
  }
}
