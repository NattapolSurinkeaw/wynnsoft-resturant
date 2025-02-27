import { Sequelize, DataTypes } from "sequelize";
import { sequelize } from "../util/database";
import { PostImage } from "./postImage";

const Post = sequelize.define(
  "Post",
  {
    id: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      primaryKey: true,
    },
    post_code: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    store_id: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    caption: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    status: {
      type: DataTypes.STRING(20),
      allowNull: false,
    },
    display: {
      type: DataTypes.STRING(10),
      allowNull: false,
    },
    post_fashion: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
  },
  {
    sequelize,
    tableName: "post",
    timestamp: false,
  }
);

Post.hasMany(PostImage, {
  foreignKey: "post_id",
  targetKey: "id",
});

PostImage.belongsTo(Post, {
  foreignKey: "post_id",
  targetKey: "id",
});

export { Post };
