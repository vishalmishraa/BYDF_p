const mongoose = require('mongoose');
var findOrCreate = require('mongoose-findorcreate');
const passportLocalMongoose = require('passport-local-mongoose');
const Schema = mongoose.Schema;


const UserSchema = new Schema({
    email: {
        type: String,
        unique: [true, 'This email is already in use']
   },

    provider: String,
    contact: Number,
    created:
        { type: Date, default: Date.now },
    userid: String,
    displayName: String,
    image: [
        {
            url: String,
            filename: String
        }

    ]
});

UserSchema.plugin(passportLocalMongoose);
UserSchema.plugin(findOrCreate);



module.exports = mongoose.model('User', UserSchema);
