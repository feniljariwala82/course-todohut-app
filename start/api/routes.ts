import Route from '@ioc:Adonis/Core/Route'

Route.group(() => {
  Route.get('test', () => 'Hello world')
}).prefix('api')
