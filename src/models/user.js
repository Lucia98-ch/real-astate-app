import bcrypt from 'bcryptjs'
import mongoose, {Schema} from 'mongoose'
import paginate from 'mongoose-paginate-v2'
import virtuals from 'mongoose-lean-virtuals'

import {EnumRole, EnumStatus} from '../utils/enums'
import {transform} from '../config/model'
import PubSub from '../sockets/pubsub'
import valid from '../utils/valid'

const collection = 'users'

const schema = new Schema({
    firstName: {type: String, required: true},
    lastName: {type: String, required: true},
    email: {
        type: String,
        trim: true,
        sparse: true,
        validate: [valid.email, 'email is invalid'],
        required: [true, 'email required'],
        unique: [true, 'User with email exits'],
        lowercase: true
    },
    phone: {
        type: String,
        trim: true,
        sparse: true,
        validate: [valid.phone, 'phone is invalid'],
        required: [true, 'phone required'],
        unique: [true, 'User with phone exits'],
        lowercase: true
    },
    role: {
        type: String,
        set: v => v.toUpperCase(),
        default: EnumRole.CLIENT
    },
    status: {
        type: String,
        set: v => v.toUpperCase(),
        default: EnumStatus.ACTIVE
    },
    password: {type: String, required: true},
    isEmailVerified: {type: Boolean, default: false},
    isPhoneVerified: {type: Boolean, default: false},
    isPasswordSet: {type: Boolean, default: false},
}, {timestamps: true})

schema.index({firstName: 'text', lastName : 'text', email : 'text', phone : 'text'}, {
    weights: {
        firstName: 1,
        lastName: 2,
        email: 3,
        phone: 4
    }
})

schema.plugin(paginate)
schema.plugin(virtuals)

schema.pre('save', function (next) {
    this.wasNew = this.isNew

    if (this.isNew || this.isModified('password')) {
        bcrypt.genSalt(10, (error, salt) => {
            if (error) return next(error)
            bcrypt.hash(this.password, salt, (error, hash) => {
                if (error) return next(error)
                this.password = hash
                next()
            })
        })
    } else {
        next()
    }
})

schema.post('save', async function (doc, next) {
    const action = this.wasNew ? 'save' : 'edit'
    PubSub.publish(action, collection, doc)

    if (this.wasNew) {
        //TODO(Send welcome email)
        // await MailController.welcome(doc)
    }

    next()
})

schema.post('remove', (doc, next) => {
    PubSub.publish('delete', collection, doc)
    next()
})

schema.virtual('isAdmin').get(function () {
    return this.role === EnumRole.ADMIN
})

schema.virtual('isBlocked').get(function () {
    return this.status !== EnumStatus.ACTIVE
})

schema.virtual('name').get(function () {
    return this.firstName + ' ' + this.lastName
})

schema.virtual('date').get(function () {
    return this.createdAt.toISOString().slice(0, 10)
})

if (!schema.options.toObject) schema.options.toObject = {}
schema.options.toObject.transform = (doc, ret) => transform(ret)

schema.methods.comparePasswords = async function (candidatePassword) {
    return await bcrypt.compare(candidatePassword, this.password)
}

export default mongoose.model(collection, schema)