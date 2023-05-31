const mongoose = require("mongoose");
const ObjectId = mongoose.Schema.Types.ObjectId;

const reviewSchema = new mongoose.Schema(
  {
    userId: {
      type: ObjectId,
      required: true,
      ref: "User",
    },
    productId: {
      type: ObjectId,
      required: true,
      ref: "Product",
    },
    rating: {
      type: Number,
      required: true,
    },
    review: {
      type: String,
    },
  },
  { timestamps: true }
);

const Review = mongoose.model("Review", reviewSchema);

exports.createReview = (obj) => {
  return new Promise((resolve, reject) => {
    Review.create(obj)
      .then((create) => {
        resolve(create);
      })
      .catch((error) => {
        reject(error);
      });
  });
};

exports.findReview = (userId) => {
  return new Promise((resolve, reject) => {
    Review.findOne({ userId: userId })
      .then((data) => {
        resolve(data);
      })
      .catch((error) => {
        reject(error);
      });
  });
};

exports.isProductExistInReview = (productId) => {
  return new Promise((resolve, reject) => {
    Review.findOne({ productId: productId })
      .then((data) => {
        resolve(data);
      })
      .catch((error) => {
        reject(error);
      });
  });
};

exports.getReview = (userId) => {
  return new Promise((resolve, reject) => {
    Review.find(
      { userId: userId },
      { _id: 0, productId: 1, rating: 1, review: 1 }
    )
      .populate({ path: "productId", select: "name price -_id" })
      .then((data) => {
        resolve(data);
      })
      .catch((error) => {
        reject(error);
      });
  });
};

exports.updateReview = (userId, productId, rating, review) => {
  return new Promise((resolve, reject) => {
    Review.findOneAndUpdate(
      { userId: userId, productId: productId },
      { $set: { rating, review } },
      { new: true }
    )
      .then((data) => {
        resolve(data);
      })
      .catch((error) => {
        reject(error);
      });
  });
};

exports.deleteRevew = (userId, productId) => {
  return new Promise((resolve, reject) => {
    Review.findOneAndDelete({
      userId: userId,
      productId: productId,
    })
      .then((data) => {
        resolve(data);
      })
      .catch((error) => {
        reject(error);
      });
  });
};
