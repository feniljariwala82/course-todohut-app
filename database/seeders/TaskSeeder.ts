import BaseSeeder from '@ioc:Adonis/Lucid/Seeder'
import User from 'App/Models/User'
import TaskFactory from 'Database/factories/TaskFactory'
import UserFactory from 'Database/factories/UserFactory'

export default class extends BaseSeeder {
  public async run() {
    // Write your database queries inside the run method

    await User.create({
      email: 'fenil@email.com',
      first_name: 'fenil',
      last_name: 'jariwala',
      password: '12345678',
    })

    await UserFactory.createMany(20)
    await TaskFactory.createMany(20)
  }
}
