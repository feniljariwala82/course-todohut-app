import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class extends BaseSchema {
  protected tableName = 'tasks'

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id').primary()
      table.string('title', 50).notNullable()
      table.string('description', 400).notNullable()
      table
        .enu('priority', ['important', 'unimportant', 'urgent', 'future_scope'])
        .defaultTo('important')
        .notNullable()
      table.integer('user_id').unsigned().references('users.id').onDelete('CASCADE') // delete post when user is deleted
      table.timestamp('created_at', { useTz: true })
      table.timestamp('updated_at', { useTz: true })
    })
  }

  public async down() {
    this.schema.dropTable(this.tableName)
  }
}
