import passport from 'passport'
import {encode} from 'jwt-simple'

import responseHandler from '../utils/response/handler'
import resp from '../utils/response/status'
import {criteria} from '../utils/valid'
import UserRepo from '../repos/user'

import '../services/passport'

const getToken = sub =>
    encode({sub, iat: new Date().getTime()}, process.env.JWT_TOKEN)

export default {
    register: async (req, res, next) => {
        try {
            const {status, data: payload} = await UserRepo.add(req.body, req.user, req.headers.refid)
            const data = payload ? {token: getToken(payload.id), payload} : null

            return responseHandler(res, status, data)
        } catch (e) {
            return next(e)
        }
    },
    login: (req, res, next) => {
        if (!req.body.password) {
            const {status} = resp.field_required('Password')
            return  responseHandler(res, status)
        }

        if (!criteria(req.body.username)) {
            const {status} = resp.invalid_field('email or phone number')
            return  responseHandler(res, status)
        }

        return passport.authenticate('custom', (err, user) => {
            if (err) return next(err)
            if (!user) {
                const {status} = resp.incorrect_field('password')
                return responseHandler(res, status)
            }
            req.logIn(user, err => {
                if (err) return next(err)
                const payload = user.toObject({virtuals: true})
                return responseHandler(res, resp.signedIn, {token: getToken(req.user.id), payload})
            })
        })(req, res, next)
    },
    secure: passport.authenticate('jwt', {session: false})
}