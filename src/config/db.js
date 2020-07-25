import mongoose from 'mongoose'

export default {
    connect: async () => {
        try {
            return await mongoose.connect('mongodb://localhost:27017/estate', {
                useUnifiedTopology: true,
                useFindAndModify: false,
                useNewUrlParser: true,
                useCreateIndex: true
            })
        } catch (e) {
            console.log(e)
        }
    }
}