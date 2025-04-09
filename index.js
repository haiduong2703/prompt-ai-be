const express = require('express');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const ddosProtection = require('./middleware/ddosProtection');
const dotenv = require('dotenv');
const cors = require("cors");
const multer = require('multer');
const mammoth = require('mammoth');
const XLSX = require('xlsx');
const sequelize = require('./config/database.js');
const { runTask } = require('./utils/worker');
const compression = require('compression');
const { apiLimiter, authLimiter, uploadLimiter, paymentLimiter } = require('./middleware/rateLimiter');

const userRoutes = require('./routes/userRoutes');
const promptRoutes = require('./routes/promptRoutes');
const categoryRoutes = require("./routes/categoryRoutes");
const contactRoutes = require("./routes/contactRoutes");
const sectionRoutes = require("./routes/sectionRoutes");
const blogCategoryRoutes = require("./routes/blogCategoryRoutes");
const blogRoutes = require("./routes/blogRoutes");
const subscriptionRotues = require("./routes/subscriptionRotues");
const topicRoutes = require("./routes/topicRoutes");
const promptFavorite = require("./routes/promptFavoriteRoutes.js");
const productRoutes = require("./routes/productRoutes.js");
const deviceLogRoutes = require("./routes/deviceLogRoutes.js");
const paymentRouters = require("./routes/paymentRouters.js");
const referralRoutes = require("./routes/referralRoutes.js");
const Prompt = require('./models/Prompt.js');
const Topic = require('./models/Topic.js');
const Category = require('./models/Category.js');
const Referral = require('./models/Referral.js');
const chatGPTRoutes = require("./routes/chatGPTRoutes.js");
require('./cronJob.js');

dotenv.config();
const app = express();

// Nén dữ liệu trước khi gửi để giảm bandwith và tăng tốc độ
app.use(compression());

// Static resources không chịu rate limit
app.use("/uploads", express.static("uploads"));

// Sử dụng helmet để bảo vệ HTTP headers
app.use(helmet());

// Sử dụng middleware chống DDoS
app.use(ddosProtection);

app.use(cors({
    origin: ["https://www.prom.vn", "https://prom.vn"],
    // origin: "*",
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"]
}));

app.use(express.json());

// Áp dụng rate limiter cho các loại API khác nhau
app.use('/api/users', authLimiter);
app.use('/api/payment', paymentLimiter);
app.use('/api/upload', uploadLimiter);

// Áp dụng API limiter cho các routes còn lại
app.use('/api', apiLimiter);

const upload = multer({ dest: 'uploads/' });

app.post('/api/upload-word', upload.single('file'), async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ error: 'No file uploaded' });
        }
        console.log(req.file)
        // Đọc file Word và chuyển đổi sang HTML
        const result = await mammoth.convertToHtml({ path: req.file.path });
        console.log(result)
        const htmlContent = result.value; // Nội dung HTML

        // Trả về HTML cho frontend
        res.status(200).json({ html: htmlContent });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error processing the file' });
    }
});

app.post('/api/upload-excel', upload.single('file'), async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ error: 'No file uploaded' });
        }

        // Process the Excel file in a worker thread
        const result = await runTask('excel-processor.js', {
            filePath: req.file.path
        });

        if (!result.success) {
            throw new Error(result.error);
        }

        // Respond with success
        res.status(200).json({
            message: 'Data successfully saved to database',
            count: result.count,
            success: true,
            data: result.data
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error processing the Excel file or saving to database' });
    }
});

// Đổi các routes để sử dụng rate limiter
app.use('/api/users', userRoutes);
app.use('/api/prompts', promptRoutes);
app.use("/api/categories", categoryRoutes);
app.use("/api/contact", contactRoutes);
app.use("/api/sections", sectionRoutes);
app.use("/api/blogcategory", blogCategoryRoutes);
app.use("/api/blog", blogRoutes);
app.use("/api/subscriptions", subscriptionRotues);
app.use("/api/topic", topicRoutes);
app.use("/api/promptfavorite", promptFavorite);
app.use("/api/products", productRoutes);
app.use("/api/devicelogs", deviceLogRoutes);
app.use("/api/payment", paymentRouters);
app.use("/api/referral", referralRoutes);
app.use("/api/chat", chatGPTRoutes);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));



