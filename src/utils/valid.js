const CARD_REGEX = /^(\d{4}[- ]){3}\d{4}|\d{16}$/
const EMAIL_REGEX = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i
const PHONE_REGEX = /^\+(9[976]\d|8[987530]\d|6[987]\d|5[90]\d|42\d|3[875]\d|2[98654321]\d|9[8543210]|8[6421]|6[6543210]|5[87654321]|4[987654310]|3[9643210]|2[70]|7|1)\W*\d\W*\d\W*\d\W*\d\W*\d\W*\d\W*\d\W*\d\W*(\d{1,2})$/

const card = s => CARD_REGEX.test(s)
const email = s => EMAIL_REGEX.test(s)
const phone = s => PHONE_REGEX.test(s)

const fields = (model, body) => {
    const {__v, _id, id, user, createdAt, updatedAt, ...rest} = model.schema.tree

    let isValid = true

    for(const key of Object.keys(rest)) {
        if (rest[key].required) {
            if(body[key] === undefined) {
                isValid = false
                break
            }
        }
    }

    return isValid
}

export const criteria = s =>
    phone(s) ? {phone: s.replace(/[.\-()\/]/g, '')} : email(s) ? {email: s} : null

export default {
    card,
    email,
    phone,
    fields
}