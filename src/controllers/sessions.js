import responseHandler from '../utils/response/handler'
import resp from '../utils/response/status'

const secure = process.env.NODE_ENV === 'production'

export default {
    create: async (req, res) => {
        const maxAge = 60 * 60 * 24 * 28 * 1000
        const {token} = req.body

        res.cookie('session', token, {maxAge, httpOnly: true, secure})
        const {status, data} = resp.ok()
        return responseHandler(res, status, data)
    },
    delete: (req, res) => {
        res.clearCookie('session')
        const {status, data} = resp.ok()
        return responseHandler(res, status, data)
    }
}