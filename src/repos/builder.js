import resp from '../utils/response/status'
import {EnumStatus} from '../utils/enums'

const queryBuilder = args => {
    const {order, orderBy} = args

    const opts = {
        page: 1,
        limit: 50,
        sort: {createdAt: -1}
    }

    if (order && orderBy) opts.sort[orderBy] = order === 'desc' ? -1 : 1

    return {...opts, ...args}
}

const project = docs => docs.map(doc => doc.toObject({virtuals: true}))

const spread = pair => {
    const key = Object.keys(pair)[0]
    return {key, value: pair[key]}
}

export default {
    find: async (model, query) => {
        const {docs, ...rest} = await model.paginate({}, queryBuilder(query))
        return resp.list({docs: project(docs), ...rest})
    },
    findByUser: async (model, pair) => {
        const {key, value} = spread(pair)
        const docs = await model.find({[key]: value})
        return resp.list(project(docs))
    },
    findOne: async (name, model, pair, user, isPublic) => {
        if (user.status === EnumStatus.BLOCKED) return resp.blocked

        const {key, value} = spread(pair)

        const doc = await model.findById(value)
        if (!doc) return resp.not_found(name)

        if (!isPublic) if (!(user.isAdmin || doc[key] === user.id)) return resp.not_permitted

        return resp.ok(doc)
    },
    delete: async (name, model, pair, user) => {
        if (user.status === EnumStatus.BLOCKED) return resp.blocked

        const {key, value} = spread(pair)

        try {
            if (!value) return resp.field_required('ID')

            const doc = await model.findById(value)
            if (!doc) return resp.not_found(name)

            if (!(user.isAdmin || doc[key] === user.id)) return resp.not_permitted
            await doc.remove()
            return resp.deleted(name)
        } catch (e) {
            console.error(e)
            return resp.unknown
        }
    }
}