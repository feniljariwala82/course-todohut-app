import Route from '@ioc:Adonis/Core/Route'

Route.get('/', 'AuthController.login').as('login')
Route.post('/login', 'AuthController.loginPost').as('loginPost')
Route.route('/signup', ['GET', 'POST'], 'AuthController.signup').as('signup')
Route.get('/logout', 'AuthController.logout').as('logout')

Route.resource('tasks', 'TasksController')
