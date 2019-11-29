const bcrypt = require('bcrypt');
const mongoose = require('mongoose');


const userSchema = new mongoose.Schema({
  email: { type: String,
    unique: true,
    minlength: [5, 'Email must be at least 5 characters.'],
    maxlength: [35, 'Email must be less than 35 characters.'],
  },
  password: {
    type: String,
    unique : true
  },
  passwordResetToken: String,
  passwordResetExpires: Date,
  emailVerificationToken: String,
  emailAndAccountVerified: {
    type: Boolean,
    default: false
  },
  profile: {
    username: String,
    gender: {
      type : String,
      enum: ['Male' , 'Female' , 'Other', 'Muski' , 'Zenski']
    },
    birthday:Date,
    phone: String,
    picture: String,
    country: String,
    city : String
  },
  ifAdmin: {
    type: Boolean,
    default : false
  },
  facebook: String,
  twitter: String,
  google: String,
  // instagram: String,


}, { timestamps: true });



/**
 * Password hash middleware called before saving user
 */
userSchema.pre('save', function save(next) {
  const user = this;
  if (!user.isModified('password')) { return next(); }
  bcrypt.genSalt(10, (err, salt) => {
    if (err) { return next(err); }
    bcrypt.hash(user.password, salt, (err, hash) => {
      if (err) { return next(err); }
      user.password = hash;
      next();
    });
  });
});



/**
 * Helper method for validating user's password.
 */
userSchema.methods.comparePassword = function comparePassword(candidatePassword, cb) {
  return bcrypt.compareSync(candidatePassword, this.password);
};

const User = mongoose.model('User', userSchema);

module.exports = userSchema;
