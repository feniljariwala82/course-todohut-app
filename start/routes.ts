import Route from '@ioc:Adonis/Core/Route'
import './api/routes'

Route.group(() => {
  Route.get('/', 'AuthController.login').as('login')
  Route.post('/login', 'AuthController.loginPost').as('loginPost')
  Route.route('/signup', ['GET', 'POST'], 'AuthController.signup').as('signup')
}).middleware('isGuest')

Route.get('/logout', 'AuthController.logout').as('logout').middleware('auth')

Route.resource('tasks', 'TasksController').middleware({
  '*': 'auth',
})
