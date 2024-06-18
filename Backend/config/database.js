import mongoose from 'mongoose';

const connectDatabase = () => {
  mongoose.connect(process.env.DB_URI,)
    .then(() => {
      console.log(`MongoDB connected with server ${mongoose.connection.host}`);
    })
    .catch((err) => {
      console.error(`MongoDB connection error: ${err}`);
    });
}

export default connectDatabase
