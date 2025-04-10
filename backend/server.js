require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bson = require('bson');

const Group = require('./models/Group');
const User = require('./models/User');
const Post = require('./models/Post');
const Recommendation = require('./models/Recommendation');
const Expense = require('./models/Expense');
const Trip = require('./models/Trip');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/WeTravel', {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
    .then(() => console.log('Connected to MongoDB'))
    .catch(err => console.error('MongoDB connection error:', err));

const db = mongoose.connection;

const groupRoutes = require('./routes/groups');
const userRoutes = require('./routes/users');
const postRoutes = require('./routes/posts');
const recommendationRoutes = require('./routes/recommendations')
const expenseRoutes = require('./routes/expenses')
const tripRoutes = require('./routes/trips')

const authRoutes = require('./routes/auth');

app.use('/api/groups', groupRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/posts', postRoutes);
app.use('/api/recommendations', recommendationRoutes);
app.use('/api/expenses', expenseRoutes);
app.use('/api/trips', tripRoutes);

app.get('/api/check-init', async (req, res) => {
    try {
        const groupCount = await Group.countDocuments();
        const userCount = await User.countDocuments();
        const postCount = await Post.countDocuments();
        const recommendationCount = await Recommendation.countDocuments();
        const expenseCount = await Expense.countDocuments();
        
        res.json({
            needsInit: groupCount === 0 || userCount === 0 || postCount === 0 || recommendationCount === 0 || expenseCount === 0,
            counts: {
                groups: groupCount,
                users: userCount,
                posts: postCount,
                recommendations: recommendationCount,
                eexpenses: expenseCount
            }
        });
    } catch (error) {
        res.status(500).json({ error: 'Failed to check initialization status' });
    }
});

app.post('/api/init-data', async (req, res) => {
    try {
        const groupCount = await Group.countDocuments();
        const userCount = await User.countDocuments();
        const postCount = await Post.countDocuments();
        const recommendationCount = await Recommendation.countDocuments();
        const expenseCount = await Expense.countDocuments();

        if (groupCount > 0 && userCount > 0 && postCount > 0 && recommendationCount > 0 && expenseCount > 0) {
            return res.json({
                message: 'Database already initialized',
                groupsCount: groupCount,
                usersCount: userCount,
                postsCount: postCount,
                recommendationsCount: recommendationCount,
                expensesCount: expenseCount
            });
        }
        
        var json1 = require("./data/dummy_data/users.json");
        json1 = bson.EJSON.parse(JSON.stringify(json1));
        
        const processedUsers = json1.map(user => {
            // const userId = user._id.$oid;
            return user;
        });
        
        await User.deleteMany({});
        await db.collection("users").insertMany(processedUsers);

        res.json({
            message: 'Data initialized successfully',
            usersCount: userCount

        });
    } catch (error) {
        console.error('Error initializing data:', error);
        res.status(500).json({ error: 'Error initializing data', details: error.message });
    }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});