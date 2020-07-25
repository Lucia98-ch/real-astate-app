import io from 'socket.io'

export default server => {
    global.io = io.listen(server, {
        handlePreflightRequest: (req, res) => {
            res.writeHead(200, {
                'Access-Control-Allow-Headers ': 'Content-Type, Authorization ',
                'Access-Control-Allow-Origin ': req.headers.origin,
                'Access-Control-Allow-Credentials ': true
            })
            res.end()
        }
    })
}