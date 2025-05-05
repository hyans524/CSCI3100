require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bson = require('bson');
const path = require('path');
const fs = require('fs');

const Group = require('./models/Group');
const User = require('./models/User');
const Post = require('./models/Post');
const Recommendation = require('./models/Recommendation');
const Expense = require('./models/Expense');
const Trip = require('./models/Trip');

const app = express();

// Middleware
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true
}));
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

// Test endpoint for basic connectivity testing
app.get('/api/test', (req, res) => {
  res.json({ 
    message: 'API is working',
    timestamp: new Date().toISOString()
  });
});

app.get('/api/check-init', async (req, res) => {
    try {
        const groupCount = await Group.countDocuments();
        const userCount = await User.countDocuments();
        const postCount = await Post.countDocuments();
        const recommendationCount = await Recommendation.countDocuments();
        const expenseCount = await Expense.countDocuments();
        const tripCount = await Trip.countDocuments();
        
        res.json({
            needsInit: groupCount === 0 || userCount === 0 || postCount === 0 || recommendationCount === 0 || expenseCount === 0 || tripCount == 0,
            counts: {
                groups: groupCount,
                users: userCount,
                posts: postCount,
                recommendations: recommendationCount,
                expenses: expenseCount,
                trips: tripCount
            }
        });
    } catch (error) {
        res.status(500).json({ error: 'Failed to check initialization status' });
    }
});

app.get('/api/init-data', async (req, res) => {
    try {
        const groupCount = await Group.countDocuments();
        const userCount = await User.countDocuments();
        const postCount = await Post.countDocuments();
        const recommendationCount = await Recommendation.countDocuments();
        const expenseCount = await Expense.countDocuments();
        const tripCount = await Trip.countDocuments();

        if (groupCount > 0 && userCount > 0 && postCount > 0 && recommendationCount > 0 && expenseCount > 0 && tripCount > 0) {
            return res.json({
                message: 'Database already initialized',
                groupsCount: groupCount,
                usersCount: userCount,
                postsCount: postCount,
                recommendationsCount: recommendationCount,
                expensesCount: expenseCount,
                tripsCount: tripCount
            });
        }
        
        // Load and process User data
        var user_json = require("./data/dummy_data/user.json");
        user_json = bson.EJSON.parse(JSON.stringify(user_json));
        const processedUsers = user_json.map(user => {
            return user;
        });
        await db.collection("users").deleteMany({});
        await db.collection("users").insertMany(processedUsers);
        console.log(`Initialized ${processedUsers.length} users`);
        
        // Load and process Group data
        var group_json = require("./data/dummy_data/group.json");
        group_json = bson.EJSON.parse(JSON.stringify(group_json));
        const processedGroups = group_json.map(group => {
            return group;
        });
        await db.collection("groups").deleteMany({});
        await db.collection("groups").insertMany(processedGroups);
        console.log(`Initialized ${processedGroups.length} groups`);
        
        // Load and process Expense data
        var expense_json = require("./data/dummy_data/expense.json");
        expense_json = bson.EJSON.parse(JSON.stringify(expense_json));
        const processedExpenses = expense_json.map(expense => {
            return expense;
        });
        await db.collection("expenses").deleteMany({});
        await db.collection("expenses").insertMany(processedExpenses);
        console.log(`Initialized ${processedExpenses.length} expenses`);

        // Load and process Trip data
        var trip_json = require("./data/dummy_data/trip.json");
        trip_json = bson.EJSON.parse(JSON.stringify(trip_json));
        const processedTrips = trip_json.map(trip => {
            return trip;
        });
        await db.collection("trips").deleteMany({});
        await db.collection("trips").insertMany(processedTrips);
        console.log(`Initialized ${processedTrips.length} trips`);

        res.json({
            message: 'Data initialized successfully',
            groupsCount: await Group.countDocuments(),
            usersCount: await User.countDocuments(),
            postsCount: await Post.countDocuments(),
            recommendationsCount: await Recommendation.countDocuments(),
            expensesCount: await Expense.countDocuments(),
            tripsCount: await Trip.countDocuments()
        });
    } catch (error) {
        console.error('Error initializing data:', error);
        res.status(500).json({ error: 'Error initializing data', details: error.message });
    }
});

app.get('/api/test-post', async (req, res) => {
    try {
        let jsonPosts = require("./data/dummy_data/post.json");
        jsonPosts = bson.EJSON.parse(JSON.stringify(jsonPosts));

        const processedPosts = await Promise.all(jsonPosts.map(async (post) => {
            const user = await User.findOne({id: Number(post.user_id)});
            if (!user) throw new Error(`User with id ${post.user_id} not found`);

            const imagePath = path.join(__dirname, './data/dummy_data', post.image); 
            const imageBuffer = fs.readFileSync(imagePath).toString('base64');

            const comments = await Promise.all(post.comments.map(async comment => {
                const commentUser = await User.findOne({id: Number(comment.user_id)} );
                if (!commentUser) throw new Error(`User with id ${comment.user_id} not found`);
                
                return {
                    user_id: commentUser._id,
                    text: comment.text,
                    date: new Date(comment.date)
                };
            }));

            const likes = await Promise.all(post.likes.map(async likeId => {
                const likeUser = await User.findOne({ id: Number(likeId) });
                return likeUser ? likeUser._id : null;
            })).then(results => results.filter(Boolean));

            return {
                ...post,
                user_id: user._id, 
                image: imageBuffer,
                start_date: new Date(post.start_date),
                end_date: new Date(post.end_date),
                comments,
                likes
            };
        }));

        await Post.deleteMany({});
        await db.collection("posts").insertMany(processedPosts);

        res.json({
            message: 'Data initialized successfully',
            postsCount: await Post.countDocuments()
        });
    } catch (error) {
        console.error('Error initializing data:', error);
        res.status(500).json({ error: 'Error initializing data', details: error.message });
    }
});

// Add this to server.js for debugging
app.get('/api/diagnostics', async (req, res) => {
    try {
      // Fetch a sample trip and group
      const sampleTrip = await Trip.findOne().lean();
      let groupInfo = null;
      
      if (sampleTrip && sampleTrip.group_id) {
        // Check if group_id is a string or ObjectId
        const groupIdType = typeof sampleTrip.group_id;
        const isObjectId = sampleTrip.group_id instanceof mongoose.Types.ObjectId;
        
        // Try to find the group
        const group = await Group.findOne({ group_id: sampleTrip.group_id }).lean();
        groupInfo = {
          found: !!group,
          groupDetails: group,
          idType: groupIdType,
          isObjectId
        };
      }
      
      // Return diagnostic info
      res.json({
        tripExample: sampleTrip,
        groupReference: groupInfo,
        collections: {
          tripCount: await Trip.countDocuments(),
          groupCount: await Group.countDocuments()
        }
      });
    } catch (error) {
      console.error('Diagnostic error:', error);
      res.status(500).json({ error: error.message });
    }
  });

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(500).json({ message: 'Server error', error: err.message });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});