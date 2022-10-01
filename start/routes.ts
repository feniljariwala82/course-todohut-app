/*
|--------------------------------------------------------------------------
| Routes
|--------------------------------------------------------------------------
|
| This file is dedicated for defining HTTP routes. A single file is enough
| for majority of projects, however you can define routes in different
| files and just make sure to import them inside this file. For example
|
| Define routes in following two files
| ├── start/routes/cart.ts
| ├── start/routes/customer.ts
|
| and then import them inside `start/routes.ts` as follows
|
| import './routes/cart'
| import './routes/customer''
|
*/

import Route from '@ioc:Adonis/Core/Route'
import Database from '@ioc:Adonis/Lucid/Database'
import User from 'App/Models/User'

Route.get('/', async ({ view }) => {
  return view.render('welcome')
})

Route.get('/users', async ({ response }) => {
  try {
    // const users = await Database.from('users').select('*')
    const users = await User.all()
    return response.status(200).json(users)
  } catch (error) {
    console.error(error)
    return response.status(400).json(error.message)
  }
})

Route.post('/users', async ({ response, request }) => {
  const { email, password, firstName, lastName } = request.all()
  try {
    await Database.insertQuery().table('users').insert({
      email: email,
      password: password,
      first_name: firstName,
      last_name: lastName,
    })
    return response.status(200).json('User inserted')
  } catch (error) {
    console.error(error)
    return response.status(400).json(error.message)
  }
})

Route.put('/users/:id', async ({ response, params, request }) => {
  const { id } = params
  const { firstName, lastName } = request.all()
  try {
    await Database.from('users').where('id', id).update({
      first_name: firstName,
      last_name: lastName,
    })
    return response.status(200).json('User updated')
  } catch (error) {
    console.error(error)
    return response.status(400).json(error.message)
  }
})

Route.delete('/users/:id', async ({ response, params }) => {
  const { id } = params
  try {
    await Database.from('users').where('id', id).delete()
    return response.status(200).json('User deleted')
  } catch (error) {
    console.error(error)
    return response.status(400).json(error.message)
  }
})

Route.get('/users/raw', async ({ response }) => {
  try {
    // const users = await Database.rawQuery('select * from users where id = ? and first_name = ?', [
    //   11,
    //   'fenil',
    // ])
    const users = await Database.rawQuery('select * from users where ?? = ?', [
      'users.id',
      11,
    ]).exec()
    return response.status(200).json(users)
  } catch (error) {
    console.error(error)
    return response.status(400).json(error.message)
  }
})
