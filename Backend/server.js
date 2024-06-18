import app from './app.js'; // Ensure correct file extension (.js)
import dotenv from "dotenv";
import connectDatabase from './config/database.js';
import cloudinary from 'cloudinary';

dotenv.config({path:"backend/config/config.env"}); //Config

//Connecting to database
connectDatabase();
 cloudinary.config({
    cloud_name:'db0qas9mi',
    api_key:'926927634226477',
    api_secret:'N5X44-jEDWY6tRmsl6lLIT4l7Mo'
 })
//  console.log(process.env.CLOUDINARY_API_KEY);

app.listen(process.env.PORT,()=>{
    console.log(`Server is Working on http://localhost:${process.env.PORT}`)
})