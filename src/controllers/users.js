import responseHandler from '../utils/response/handler'
import resp from '../utils/response/status'
import UserRepo from '../repos/user'

export default {
    get: async (req, res, next) => {
        const {query, params: {id}, headers: {refid}, user} = req
        try {
            const {status, data} = await UserRepo.get(id, query, user, refid)
            return responseHandler(res, status, data)
        } catch (e) {
            next(e)
        }
    },
    create: async (req, res, next) => {
        const {body, params: {ref}, headers: {refid}, user} = req

        try {
            if (ref && ref.match(/bulk/gi)) {
                if (!(user.isAdmin && refid && refid.match(/dashboard/gi))) {
                    const {status, data} = resp.not_permitted
                    return responseHandler(res, status, data)
                }

                await body.map(async card => await UserRepo.add(card))
                const {status, data} = resp.transaction_complete
                return responseHandler(res, status, data)
            } else {
                const {status, data} = await UserRepo.add(body, user, refid)
                return responseHandler(res, status, data)
            }
        } catch (e) {
            next(e)
        }
    },
    update: async (req, res, next) => {
        try {
            const {status, data} = await UserRepo.edit(req.params.id, req.body, req.user)
            return responseHandler(res, status, data)
        } catch (e) {
            next(e)
        }
    },
    delete: async (req, res, next) => {
        try {
            const {status, data} = await UserRepo.del(req.params.id, req.user)
            return responseHandler(res, status, data)
        } catch (e) {
            next(e)
        }
    }
}