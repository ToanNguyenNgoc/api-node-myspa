const mongoose = require('mongoose');
const express = require('express');
const app = express();
const port = 3004;
const dotenv = require('dotenv');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const cors = require('cors');
const initializeFirebase = require('./config/firebase.config')
const swaggerUI = require('swagger-ui-express');
// const multer = require('multer')
// const upload = multer({ dest: 'uploads/' })

const bannersTypeRoute = require('./routes/bannersTypeRoute');
const bannersRoute = require('./routes/bannersRoute');
const tikitokRoute = require('./routes/tiktokRoute');
const authRoute = require('./routes/authRoute');
const userRoute = require('./routes/userRoute');
const historyViewRoute = require('./routes/historyViewRoute');
const feedbackRoute = require('./routes/feedbackRoute');
const feedbackFeatureRoute = require('./routes/feedbackFeatureRoute');
const feedbackCateRoute = require('./routes/feedbackCateRoute')
const trendCateRoute = require('./routes/trendCateRoute');
const trendRoute = require('./routes/trendRoute');
const organizationRoute = require('./routes/organizationsRoute');
const trendServiceRoute = require('./routes/trendServiceRoute');
const mediaRoute = require('./routes/mediaRoute')
const uploadRoute = require('./routes/uploadRoute')
const searchHistoryRoute = require('./routes/searchHistoryRoute');
const lolRoute = require("./routes/lolRoute");
const htmlMetadataRoute = require("./routes/htmlMetadataRoute");
const vnpayRoute = require("./routes/vnpayRoute")
const userZaloRoute = require("./routes/userZaloRoute")
const mobaRoute = require("./routes/mobaRoute")
const myspaWheelRoute = require("./routes/myspaWheelRoute")
const swaggerJsDoc = require("swagger-jsdoc");
const swagger = require('./docs/_swagger')

dotenv.config();
initializeFirebase();
mongoose.connect((process.env.MONGO_URL), {
	useNewUrlParser: true,
	useUnifiedTopology: true,
})

app.use(bodyParser.json({ limit: '50mb' }));
// app.use(cors({
//     methods: ['GET', 'HEAD', 'PUT', 'PATCH', 'POST', 'DELETE'],
//     origin: [
//         "https://beautyx.vn",
//         "https://beautyx.vercel.app",
//         "https://beautyx-spa.web.app",
//         "http://localhost:3000"
//     ],
//     optionsSuccessStatus: 200,
// }));
app.use(cors())
app.use(morgan('common'));

// ROUTER
app.use('/v1/banners_type', bannersTypeRoute);
app.use('/v1/banners', bannersRoute);
app.use('/v1/trend_cates', trendCateRoute);
app.use('/v1/trends', trendRoute);
app.use('/v1/tiktok', tikitokRoute);
app.use('/v1/auth', authRoute);
app.use('/v1/users', userRoute);
app.use('/v1/history', historyViewRoute);
app.use('/v1/feedbacks', feedbackRoute);
app.use('/v1/feedback_features', feedbackFeatureRoute);
app.use('/v1/feedback_cates', feedbackCateRoute);
app.use('/v1/organizations', organizationRoute);
app.use('/v1/trends_services', trendServiceRoute);
app.use('/media', mediaRoute);
app.use('/v1/upload', uploadRoute);
app.use('/v1/search_history', searchHistoryRoute);
app.use('/v1/lols', lolRoute);
app.use('/v1/html_metadata', htmlMetadataRoute);
app.use('/v1/vnpay', vnpayRoute)
app.use('/v1/zalo', userZaloRoute)
app.use('/v1/moba', mobaRoute)
app.use('/v1/myspa-wheel', myspaWheelRoute)

//[SWAGGER]
const specs = swaggerJsDoc(swagger);
app.use("/docs", swaggerUI.serve, swaggerUI.setup(specs));


app.listen(port, () => {
	console.log(`Example app listening on port ${port}`);
})