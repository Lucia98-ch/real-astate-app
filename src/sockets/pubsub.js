export default {
    publish: (action, collection, doc, id) => {
        try {
            if (io) {
                doc.user && io.emit(doc.user.id + ':' + collection + ':' + action, doc)
                doc.id && io.emit(doc.id + ':' + collection + ':' + action, doc)
                id && io.emit(id + ':' + collection + ':' + action, doc)
                io.emit('admin:' + collection + ':' + action, doc)
            }
        } catch (e) {
            console.log(e)
        }
    }
}