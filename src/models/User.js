const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')

const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    phone: { type: String, required: true, unique: true, sparse: true},
    password: { type: String, required: true },
    regionLGA: { type: String, required: true },
    state: { type: String, required: false },
    officeAddress: { type: String, required: false },
    skill: { type: String, required: false },
    dateOfBirth: { type: String, required: false },
    gender: { type: String, required: false },
    idCard: { type: String, required: false },
    idCardID: { type: String, required: false },
    avatar:{type: String, required:false},
    bio:{type:String, required:false},
    skill:{type:[], required:false},
    about:{type:String, required:false},
    lastSeen: { type: Date, default: Date.now },
    email_verified: { type: Boolean, default: false },
    status: { type: Boolean, default: false },
    user_type: { type: String, enum: ['admin', 'user', 'artisan'], default: 'user' },
    created_at: { type: Date, default: Date.now },
    updated_at: { type: Date, default:Date.now},
    });


    userSchema.pre('save', async function (next) {
        if (!this.isModified('password')) return next();
        this.password = await bcrypt.hash(this.password, 10);
        next();
      });
      
      userSchema.methods.comparePassword = async function (password) {
        return bcrypt.compare(password, this.password);
      };
      
      module.exports = mongoose.model('User',userSchema);