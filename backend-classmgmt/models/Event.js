const mongoose = require('mongoose');

// Comment Schema
const commentSchema = new mongoose.Schema({
  content: {
    type: String,
    required: true,
    trim: true
  },
  userId: {
    type: String,
    required: true
  },
  userName: {
    type: String,
    required: true
  },
  userPhotoUrl: String,
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Event Schema
const eventSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  date: {
    type: Date,
    required: true
  },
  caption: {
    type: String,
    required: true,
    trim: true
  },
  tags: [{
    type: String,
    enum: ['Academic', 'Cultural', 'Sports', 'Technical', 'Workshop', 'Industrial Visit', 'Other']
  }],
  images: [{
    url: {
      type: String,
      validate: {
        validator: v => /^https?:\/\/.+\.(jpg|jpeg|png|gif)$/.test(v),
        message: props => `${props.value} is not a valid image URL`
      }
    },
    caption: String
  }],
  classId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Class',
    required: true,
    index: true
  },
  semesterId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Semester',
    required: true
  },
  postedBy: {
    uid: String,
    name: String,
    photoUrl: String
  },
  likes: [{
    userId: String,
    userName: String
  }],
  comments: [commentSchema]
}, { timestamps: true }); // Automatically adds createdAt and updatedAt

// Indexes for performance
eventSchema.index({ classId: 1, date: -1 });
eventSchema.index({ classId: 1, semesterId: 1 });
eventSchema.index({ tags: 1 });

// Virtual fields
eventSchema.virtual('likeCount').get(function () {
  return this.likes.length;
});
eventSchema.virtual('commentCount').get(function () {
  return this.comments.length;
});

const Event = mongoose.model('Event', eventSchema);
module.exports = Event;
