import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { AuthenticationError } from 'apollo-server-express';
import dotenv from 'dotenv';

dotenv.config();

export default {

    newLeader: async (parent, args, { models }) => {
        console.log(args);
        return models.Leader.create({
            nameLatin: args.name,
            nameOriginal: args.name
        });
    },

    signUp: async (parent, { username, email, password }, { models }) => {
        // normalize email address
        email = email.trim().toLowerCase();
        // hash the password
        const hashed = await bcrypt.hash(password, 10);
        try {
            const user = await models.User.create({
                username,
                email,
                password: hashed
            });

            // create and return the json web token
            return jwt.sign({ id: user._id }, process.env.JWT_SECRET, {expiresIn: '1m'});
        } catch (err) {
            console.log(err);
            // if there's a problem creating the account, throw an error
            throw new Error('Error creating account');
        }
    },

    signIn: async (parent, { username, email, password }, { models }) => {
        if (email) {
            // normalize email address
            email = email.trim().toLowerCase();
        }

        const user = await models.User.findOne({ $or: [{ email }, { username }] });

        // if no user is found, throw an authentication error
        if (!user) {
            throw new AuthenticationError('Error signing in');
        }

        // if the passwords don't match, throw an authentication error
        const valid = await bcrypt.compare(password, user.password);
        if (!valid) {
            throw new AuthenticationError('Error signing in');
        }

        // create and return the json web token
        return jwt.sign({ id: user._id }, process.env.JWT_SECRET);
    },

    deleteUser: async (parent, {username}, {models}) => {
        const result = await models.User.deleteOne({username: username});
        return JSON.stringify(result);
    }
};