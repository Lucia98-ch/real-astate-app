import Auth from './controllers/auth'
import Session from './controllers/sessions'
import User from './controllers/users'

export default app => {
    app.get('/api/v1/', (req, res) =>
        res.send({message: 'Welcome to Real Estate API'}))

    app.post('/api/v1/login', Auth.login)
    app.post('/api/v1/register', Auth.register)

    app.post('/api/v1/session', Session.create)
    app.delete('/api/v1/session', Session.delete)

    app.get('/api/v1/users(/:id|)', Auth.secure, User.get)
    app.post('/api/v1/user', Auth.secure, User.create)
    app.put('/api/v1/user/:id', Auth.secure, User.update)
    app.delete('/api/v1/user/:id', Auth.secure, User.delete)
}