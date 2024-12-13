const User = require('../models/userModel');

const createUser = async (req, res) => {
    try {
        const user = new User(req.body);
        await user.save();
        res.status(201).send(user);
    } catch (error) {
        res.status(400).send(error);
    }
};

const getAllUsers = async (req, res) => {
    try {
        const users = await User.find({});
        res.status(200).send(users);
    } catch (error) {
        res.status(500).send(error);
    }
};

const getUserById = async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user) {
            return res.status(404).send();
        }
        res.status(200).send(user);
    } catch (error) {
        res.status(500).send(error);
    }
};

const updateUser = async (req, res) => {
    try {
        const user = await User.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
        if (!user) {
            return res.status(404).send();
        }
        res.status(200).send(user);
    } catch (error) {
        res.status(400).send(error);
    }
};

const deleteUser = async (req, res) => {
    try {
        const user = await User.findByIdAndDelete(req.params.id);
        if (!user) {
            return res.status(404).send();
        }
        res.status(200).send(user);
    } catch (error) {
        res.status(500).send(error);
    }
};

const getUserByHn = async (req, res) => {
    try {
        const user = await User.findOne({ hn: req.params.hn }); 
        if (!user) {
            return res.status(404).send();
        }
        res.status(200).send(user);
    } catch (error) {
        res.status(500).send(error); 
    }
};

const updateUserByHn = async (req, res) => {
    try {
        const user = await User.findOneAndUpdate({ hn: req.params.hn }, req.body, {
            new: true, 
            runValidators: true,
        });

        if (!user) {
            return res.status(404).send(); 
        }

        res.status(200).send(user); 
    } catch (error) {
        res.status(400).send(error);
    }
};

const deleteUserByHn = async (req, res) => {
    try {
        const user = await User.findOneAndDelete({ hn: req.params.hn });

        if (!user) {
            return res.status(404).send();
        }

        res.status(200).send({ message: 'User deleted successfully' }); 
    } catch (error) {
        res.status(500).send(error); 
    }
};

const checkDuplicateUser = async (req, res) => {
    const { hn, email, phone } = req.body;

    try {
        // ตรวจสอบว่ามีค่า hn, email และ phone ซ้ำในฐานข้อมูลหรือไม่
        const [hnExists, emailExists, phoneExists] = await Promise.all([
            User.exists({ hn }), 
            User.exists({ email }), 
            User.exists({ phone })
        ]);

        // ส่งผลลัพธ์กลับไปยังฝั่ง client
        res.status(200).json({ 
            hnExists: !!hnExists, 
            emailExists: !!emailExists, 
            phoneExists: !!phoneExists 
        });

    } catch (error) {
        console.error('Error checking duplicates:', error);
        res.status(500).json({ error: 'Server error' });
    }
};

module.exports = {
    getAllUsers,
    getUserById,
    createUser,
    updateUser,
    deleteUser,
    getUserByHn,
    updateUserByHn,
    deleteUserByHn,
    checkDuplicateUser
};