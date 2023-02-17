const mongoose = require('mongoose');
const express = require('express');
const app = express();
const port = 3001;
const dotenv = require('dotenv');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const cors = require('cors');
const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('./swaggerDocument')
// const multer = require('multer')
// const upload = multer({ dest: 'uploads/' })

const bannersTypeRoute = require('./router/bannersTypeRoute');
const bannersRoute = require('./router/bannersRoute');
const tikitokRoute = require('./router/tiktokRoute');
const authRoute = require('./router/authRoute');
const userRoute = require('./router/userRoute');
const historyViewRoute = require('./router/historyViewRoute');
const feedbackRoute = require('./router/feedbackRoute');
const feedbackFeatureRoute = require('./router/feedbackFeatureRoute');
const feedbackCateRoute = require('./router/feedbackCateRoute')
const trendCateRoute = require('./router/trendCateRoute');
const trendRoute = require('./router/trendRoute');
const organizationRoute = require('./router/organizationsRoute');
const trendServiceRoute = require('./router/trendServiceRoute');
const mediaRoute = require('./router/mediaRoute')
const searchHistoryRoute = require('./router/searchHistoryRoute')

dotenv.config();
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
var options = {
    customCss: '.swagger-ui .topbar { display: none }'
  };
app.use(cors())
app.use(morgan('common'));
app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument,options))

// ROUTER
app.use('/v1/banners_type', bannersTypeRoute);
app.use('/v1/banners', bannersRoute);
app.use('/v1/tiktok', tikitokRoute);
app.use('/v1/auth', authRoute);
app.use('/v1/users', userRoute);
app.use('/v1/history', historyViewRoute);
app.use('/v1/feedbacks', feedbackRoute);
app.use('/v1/feedback_features', feedbackFeatureRoute);
app.use('/v1/feedback_cates', feedbackCateRoute),
app.use('/v1/trend_cates', trendCateRoute)
app.use('/v1/trends', trendRoute)
app.use('/v1/organizations', organizationRoute)
app.use('/v1/trends_services', trendServiceRoute)
app.use('/v1/media', mediaRoute),
app.use('/v1/search_history', searchHistoryRoute)

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`);
})