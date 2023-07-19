import Factory from '@ioc:Adonis/Lucid/Factory'
import Task from 'App/Models/Task'

export default Factory.define(Task, ({ faker }) => {
  return {
    priority: 'important',
    title: faker.lorem.words(2),
    description: faker.lorem.paragraph(),
    user_id: 1,
  }
}).build()
