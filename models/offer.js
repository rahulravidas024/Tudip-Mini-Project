const mongoose = require("mongoose");
const ObjectId = mongoose.Schema.Types.ObjectId;

const offerSchema = new mongoose.Schema(
  {
    userId: {
      type: ObjectId,
      ref: "User",
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    productId: {
      type: ObjectId,
      ref: "Product",
      required: true,
    },
    quantity: {
      type: Number,
      default: 1,
    },
    title: {
      type: String,
    },
    claimedCount: {
      type: Number,
      default: 1,
    },
    pointsPerOffer: {
      type: Number,
      default: 1,
    },
  },
  { timestamps: true }
);

const Offer = mongoose.model("Offer", offerSchema);

exports.createOffer = (data) => {
  return new Promise((resolve, reject) => {
    Offer.create(data)
      .then((create) => {
        resolve(create);
      })
      .catch((error) => {
        reject(error);
      });
  });
};

exports.getOffer = () => {
  return new Promise((resolve, reject) => {
    Offer.find()
      .then((data) => {
        resolve(data);
      })
      .catch((error) => {
        reject(error);
      });
  });
};

exports.findOffer = (offerId) => {
  return new Promise((resolve, reject) => {
    Offer.findById(offerId)
      .then((data) => {
        resolve(data);
      })
      .catch((error) => {
        reject(error);
      });
  });
};

exports.updateOffer = (offerId, data) => {
  return new Promise((resolve, reject) => {
    Offer.findOneAndUpdate({ _id: offerId }, { $set: data }, { new: true })
      .then((data) => {
        resolve(data);
      })
      .catch((error) => {
        reject(error);
      });
  });
};

exports.deleteOffer = (offerId) => {
  return new Promise((resolve, reject) => {
    Offer.findOneAndDelete({ _id: offerId })
      .then((data) => {
        resolve(data);
      })
      .catch((error) => {
        reject(error);
      });
  });
};
