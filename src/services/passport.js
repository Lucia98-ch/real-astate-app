import passport from 'passport'
import CustomStrategy from 'passport-custom'
import {ExtractJwt, Strategy} from 'passport-jwt'

import {criteria} from '../utils/valid'
import User from '../models/user'

require('dotenv').config()

const opt = {
    jwtFromRequest: ExtractJwt.fromHeader('authorization'),
    secretOrKey: process.env.JWT_TOKEN
}

passport.serializeUser((user, done) =>
    done(null, user))

passport.deserializeUser((user, done) =>
    done(null, user))

passport.use(new CustomStrategy(async (req, done) => {
    const {username, password} = req.body
    if (!criteria(username)) return done(null, false)

    try {
        const user = await User.findOne(criteria(username))
        if (!user) return done(null, false)

        const isMatch = await user.comparePasswords(password)
        return done(null, isMatch ? user : null)
    } catch (e) {
        return done(e)
    }
}))

passport.use(new Strategy(opt, async (payload, done) => {
        try {
            const user = await User.findById(payload.sub)
            return done(null, user || false)
        } catch (e) {
            return done(e, false)
        }
    }
))