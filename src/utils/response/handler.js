export default (res, status, data) => {
    const {statusCode = 200, statusMessage = 'Ok'} = status
    res.statusMessage = statusMessage
    const resp = res.status(statusCode)
    return resp.send(statusCode < 400 ? data : statusMessage)
}