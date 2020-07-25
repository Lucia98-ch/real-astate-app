export const transform = ret => {
    delete ret._id
    delete ret.__v
    delete ret.password
    delete ret.createdAt
    delete ret.updatedAt
    return ret
}