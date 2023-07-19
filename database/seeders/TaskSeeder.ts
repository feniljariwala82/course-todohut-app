import BaseSeeder from '@ioc:Adonis/Lucid/Seeder'
import TaskFactory from 'Database/factories/TaskFactory'
import UserFactory from 'Database/factories/UserFactory'

export default class extends BaseSeeder {
  public async run() {
    // Write your database queries inside the run method
    await UserFactory.createMany(20)
    await TaskFactory.createMany(20)
  }
}
