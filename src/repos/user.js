import resp from '../utils/response/status'
import {EnumStatus} from '../utils/enums'
import RequestBuilder from './builder'
import valid from '../utils/valid'
import User from '../models/user'

export default {
    get: async (id, query, user, refid) => {
        if (user.status === EnumStatus.BLOCKED) return resp.blocked

        if (id) {
            const doc = await User.findById(id)
            if (!doc) return resp.not_found('User')

            if (!(user.isAdmin || doc.id === user.id)) return resp.not_permitted
            return resp.ok(doc)
        } else {
            if (!(user.isAdmin && refid && refid.match(/dashboard/gi))) return resp.not_permitted

            return await RequestBuilder.find(User, query)
        }
    },
    add: async body => {
        const {email, phone} = body
        const password = body.password || +new Date()
        const fields = {...body, password, isPasswordSet: !!body.password}

        if (!valid.fields(User, fields)) return resp.fields_empty
        if (!valid.email(email)) return resp.field_invalid('Email')
        if (!valid.phone(phone)) return resp.field_invalid('Phone')

        const isMatch = await User.findOne({$or: [{email}, {phone}]}).lean()
        if (isMatch) {
            if (isMatch.email === email) return resp.conflict('User with email')
            if (isMatch.phone === phone) return resp.conflict('User with phone')
            return resp.conflict('User')
        }

        const doc = await User.create(fields)

        return resp.created('Account', doc)
    },
    edit: async (id, body, user) => {
        if (user.status === EnumStatus.BLOCKED) return resp.blocked

        const {firstName, lastName, email, phone, status, isAdmin} = body

        let doc = user

        if (id) {
            doc = await User.findById(id)
            if (!doc) return resp.not_found('User')
        }

        if (!(doc.id === user.id || user.isAdmin)) return resp.not_permitted

        if (user.isAdmin) {
            if (isAdmin) doc.isAdmin = isAdmin
            if (status) doc.status = status
        }

        if (firstName) doc.firstName = firstName
        if (lastName) doc.lastName = lastName
        if (email) doc.email = email
        if (phone) doc.phone = phone

        await doc.save()

        return resp.updated('User', doc)
    },
    del: async (id, user) => RequestBuilder.delete('User', User, {id}, user)
}