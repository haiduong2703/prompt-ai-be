const { DataTypes } = require("sequelize");
const sequelize = require("../config/database"); // Import kết nối Sequelize
const User = require("./User"); // Import User để làm khóa ngoại
const BlogCategory = require("./BlogCategory"); // Import BlogCategory để làm khóa ngoại

const Blog = sequelize.define(
    "Blog",
    {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        title: {
            type: DataTypes.STRING(255),
            allowNull: false,
        },
        content: {
            type: DataTypes.TEXT("long"),
            allowNull: false,
        },
        is_premium: {
            type: DataTypes.BOOLEAN,
            defaultValue: false,
        },
        status: {
            type: DataTypes.ENUM("draft", "published"),
            defaultValue: "draft",
            allowNull: false,
        },
        author_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: User,
                key: "id",
            },
            onDelete: "CASCADE",
        },
        category_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: BlogCategory,
                key: "id",
            },
            onDelete: "CASCADE",
        },
        published_at: {
            type: DataTypes.DATE,
            allowNull: true,
        },
        slug: {
            type: DataTypes.STRING(255),
            allowNull: false,
            unique: true,
        },
        meta_description: {
            type: DataTypes.STRING(255),
        },
        featured_image: {
            type: DataTypes.STRING(255),
        },
    },
    {
        tableName: "blogs",
        timestamps: true,
        createdAt: "created_at",
        updatedAt: "updated_at",
    }
);

module.exports = Blog;
