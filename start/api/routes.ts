import Route from '@ioc:Adonis/Core/Route'

Route.group(() => {
  Route.post('login', 'Api/AuthController.login')
  Route.post('signup', 'Api/AuthController.signup')
}).prefix('api')
