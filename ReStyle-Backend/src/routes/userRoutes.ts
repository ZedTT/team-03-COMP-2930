/**
 * A module that contains all the routes that are related to the users.
 */
import { Express } from 'express';
import { insertNewUser, getUser, updateUserDetails, getUserDetails } from '../controllers/userAccountController';
import { UserDetailsInterface } from '../models/UserDetailsInterface';
// ? https://www.npmjs.com/package/multer
import multer from 'multer';

const DIR = './uploads/'; // contains images

/**
 * Adding code to set the file names for multer
 * ? See https://www.npmjs.com/package/multer#diskstorage
 */
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, DIR)
    },
    filename: function (req, file, cb) {
        cb(null, file.fieldname + '-' + Date.now() + '.jpeg')
    }
})

//define the type of upload multer would be doing and pass in its destination, in our case, its a single file with the name photo
const uploadImg = multer({ storage: storage }).single('profilePic');

/**
 * All the user routes to export.
 * 
 * @param app an instance of express module initialized in server.ts file.
 */
const userRoutes = (app: Express) => {

    app.route('/api/users')
        /**
         * A get request to get the data for a specific user.
         */
        .get((request, response) => {
            getUser(response, request.query.uid)
        })
        /**
         * A post request to add a new user to the database.
         */
        .post((request, response) => {
            // get a user from the frontend
            const uid = request.body.uid;
            const userName = request.body.userName;
            const email = request.body.email;

            // insert the new user into the DB
            insertNewUser(response, uid, userName, email)
        });

    app.route('/api/userdetails')
        /**
         * A get request to retreive the user contact details. 
         * Anticipates a user id passed as a url parameter. 
         * '/api/userdetails?uid=someuid'
         */
        .get((request, response) => {
            getUserDetails(response, request.query.uid)
        })
        /**
         * A post request to store the entered by a user contact details and changed profile photo path.
         * Used on Edit Profile page.
         * 
         * Uses UserDetailsInterface as a format for data exchange.
         */
        .post((request, response) => {
            uploadImg(request, response, (err) => {
                if (err) {
                    console.log(err);
                    return response.status(422).send({ error: err.message })
                }

                const textFields = request.body;

                const userDetails: UserDetailsInterface = {
                    userId: textFields.userId,
                    displayname: textFields.displayname,
                    phone: textFields.phone,
                    email: textFields.email,
                    postalcode: textFields.postalcode,
                    city: textFields.city,
                    preferredContact: textFields.preferredContact,
                    profilePic: request.file ? request.file.filename : textFields.profilePic
                }
                updateUserDetails(response, userDetails)
            })
        })
}

export default userRoutes
