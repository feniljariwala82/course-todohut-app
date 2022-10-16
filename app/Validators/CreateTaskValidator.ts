import { schema, CustomMessages, rules } from '@ioc:Adonis/Core/Validator'
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class CreateTaskValidator {
  constructor(protected ctx: HttpContextContract) {}

  public schema = schema.create({
    title: schema.string([rules.required(), rules.maxLength(50), rules.trim()]),
    description: schema.string([rules.required(), rules.maxLength(400), rules.trim()]),
    priority: schema.enum(['important', 'unimportant', 'urgent', 'future_scope'] as const, [
      rules.required(),
    ]),
  })

  public messages: CustomMessages = {
    'title.required': 'Title is required',
    'title.maxLength': 'Title can not be longer than 50 characters',

    'description.required': 'Description is required',
    'description.maxLength': 'Description can not be longer than 400 characters',

    'priority.required': 'Priority is required',
    'priority.enum': 'Priority can not be none',
  }
}
