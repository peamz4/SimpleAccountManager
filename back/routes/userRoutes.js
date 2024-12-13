const express = require('express');
const userController = require('../controllers/userController');

const router = express.Router();

router.get('/getall', userController.getAllUsers);

router.get('/get/:id', userController.getUserById);

router.post('/create', userController.createUser);

router.put('/update/:id', userController.updateUser);

router.delete('/delete/:id', userController.deleteUser);

router.get('/gethn/:hn', userController.getUserByHn);

router.put('/updatehn/:hn', userController.updateUserByHn);

router.delete('/deletehn/:hn', userController.deleteUserByHn);

router.post('/check', userController.checkDuplicateUser);

module.exports = router;