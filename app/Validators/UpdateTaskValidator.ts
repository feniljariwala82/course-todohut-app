import { schema, CustomMessages, rules } from '@ioc:Adonis/Core/Validator'
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class UpdateTaskValidator {
  constructor(protected ctx: HttpContextContract) {}

  public schema = schema.create({
    title: schema.string.optional([rules.maxLength(50), rules.trim()]),
    description: schema.string.optional([rules.maxLength(400), rules.trim()]),
    priority: schema.enum.optional(['important', 'unimportant', 'urgent', 'future_scope'] as const),
  })

  public messages: CustomMessages = {
    'title.maxLength': 'Title can not be longer than 50 characters',

    'description.maxLength': 'Description can not be longer than 400 characters',

    'priority.enum': 'Priority can not be none',
  }
}
