import mongoose from 'mongoose'

export default {
    connect: async () => {
        try {
            return await mongoose.connect('mongodb+srv://cribhunter:<password>@cluster0.dmvag.mongodb.net/<dbname>?retryWrites=true&w=majority', {
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