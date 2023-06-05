import Route from '@ioc:Adonis/Core/Route'

Route.group(() => {
  Route.post('login', 'Api/AuthController.login')
  Route.post('signup', 'Api/AuthController.signup')
  Route.post('logout', 'Api/AuthController.logout')
  /**
   * overriding alias name to avoid conflicts create by adonisjs
   */
  Route.resource('tasks', 'TasksController').apiOnly().as('api_tasks')
}).prefix('api')
