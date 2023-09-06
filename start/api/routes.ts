import Route from '@ioc:Adonis/Core/Route'

Route.group(() => {
  Route.post('signup', 'AuthController.signup')
  Route.post('login', 'AuthController.login')

  Route.group(() => {
    Route.get('user', 'AuthController.user')
    Route.post('logout', 'AuthController.logout')
    /**
     * overriding alias name to avoid conflicts create by adonisjs
     */
    Route.resource('tasks', 'TasksController').apiOnly().as('api_tasks')
  }).middleware('apiAuth:web,api')
})
  .prefix('api')
  .namespace('App/Controllers/Http/Api')
