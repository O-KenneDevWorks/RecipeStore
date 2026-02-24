import mongoose from "mongoose";
import bcrypt from "bcrypt";

// ==========================
// User Schema Interface
// ==========================

interface IUser extends mongoose.Document {
    _id: mongoose.Types.ObjectId;
    name: string;
    email: string;
    password: string;
    refreshToken: string | null;
    createdAt: Date;
    updatedAt: Date;
    comparePassword(candidatePassword: string): Promise<boolean>;
}

// ==========================
// User Schema
// ==========================

/**
 * User Schema
 * Defines the structure of documents for the User collection in MongoDB.
 * Includes authentication fields and methods for secure password management.
 */
const UserSchema = new mongoose.Schema({
    // User's full name (required)
    name: {
        type: String,
        required: true,
        trim: true
    },
    // User's email address (required, unique)
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true,
        match: [/^\S+@\S+\.\S+$/, 'Please enter a valid email address']
    },
    // User's hashed password (required)
    password: {
        type: String,
        required: true,
        minlength: 6
    },
    // Refresh token for JWT authentication
    refreshToken: {
        type: String,
        default: null
    },
    // Account creation date
    createdAt: {
        type: Date,
        default: Date.now
    },
    // Last update date
    updatedAt: {
        type: Date,
        default: Date.now
    }
}, {
    timestamps: true
});

// ==========================
// Pre-save Middleware
// ==========================

/**
 * Hash the password before saving to the database
 * Only hash if the password is new or modified
 */
UserSchema.pre('save', async function(next) {
    // Only hash the password if it has been modified (or is new)
    if (!this.isModified('password')) {
        return next();
    }

    try {
        // Generate a salt and hash the password
        const salt = await bcrypt.genSalt(10);
        this.password = await bcrypt.hash(this.password, salt);
        next();
    } catch (error) {
        next(error as Error);
    }
});

// ==========================
// Instance Methods
// ==========================

/**
 * Compare a candidate password with the user's hashed password
 * @param candidatePassword - The password to compare
 * @returns {Promise<boolean>} - True if passwords match, false otherwise
 */
UserSchema.methods.comparePassword = async function(candidatePassword: string): Promise<boolean> {
    try {
        return await bcrypt.compare(candidatePassword, this.password);
    } catch (error) {
        return false;
    }
};

/**
 * Return user object without sensitive information
 * @returns User object without password and refreshToken
 */
UserSchema.methods.toJSON = function() {
    const userObject = this.toObject();
    delete userObject.password;
    delete userObject.refreshToken;
    return userObject;
};

const User = mongoose.model<IUser>('User', UserSchema);

export default User