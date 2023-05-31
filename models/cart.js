const mongoose = require("mongoose");
const ObjectId = mongoose.Schema.Types.ObjectId;

const cartSchema = new mongoose.Schema(
  {
    userId: {
      type: ObjectId,
      required: true,
      ref: "User",
    },
    items: [
      {
        _id: false,
        productId: {
          type: ObjectId,
          required: true,
          ref: "Product",
        },
        quantity: {
          type: Number,
          required: true,
          min: 1,
        },
      },
    ],
    totalPrice: {
      type: Number,
    },
    totalItems: {
      type: Number,
    },
  },
  { timestamps: true }
);

const Cart = mongoose.model("Cart", cartSchema);

exports.findCart = (userId) => {
  return new Promise((resolve, reject) => {
    Cart.findOne({ userId: userId })
      .then((cartData) => {
        resolve(cartData);
      })
      .catch((error) => {
        reject(error);
      });
  });
};

exports.createCart = (filter) => {
  return new Promise((resolve, reject) => {
    Cart.create(filter)
      .then((create) => {
        resolve(create);
      })
      .catch((error) => {
        reject(error);
      });
  });
};

exports.getCart = (userId) => {
  return new Promise((resolve, reject) => {
    Cart.findOne(
      { userId: userId },
      { _id: 0, createdAt: 0, updatedAt: 0, __v: 0 }
    )
      .populate({
        path: "items.productId",
        select: "-_id -createdAt -updatedAt -__v",
      })
      .then((data) => {
        resolve(data);
      })
      .catch((error) => {
        reject(error);
      });
  });
};

exports.updateIfProductExist = (userId, productId, product) => {
  return new Promise((resolve, reject) => {
    Cart.findOneAndUpdate(
      { userId: userId, "items.productId": productId },
      { $inc: { totalPrice: +product.price, "items.$.quantity": +1 } },
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

exports.updateIfProductNotExist = (userId, productId, product) => {
  return new Promise((resolve, reject) => {
    Cart.findOneAndUpdate(
      { userId: userId },
      {
        $addToSet: { items: { productId: productId, quantity: 1 } },
        $inc: { totalPrice: +product.price, totalItems: +1 },
      },
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

exports.incrementQuantity = (
  userId,
  productId,
  incrementQuantity,
  updatedPrice
) => {
  return new Promise((resolve, reject) => {
    Cart.findOneAndUpdate(
      { userId: userId, "items.productId": productId },
      {
        $inc: {
          totalPrice: +updatedPrice,
          "items.$.quantity": +incrementQuantity,
        },
      },
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

exports.decrementQuantity = (
  userId,
  productId,
  decrementQuantity,
  updatedPrice
) => {
  return new Promise((resolve, reject) => {
    Cart.findOneAndUpdate(
      { userId: userId, "items.productId": productId },
      {
        $inc: {
          totalPrice: -updatedPrice,
          "items.$.quantity": -decrementQuantity,
        },
      },
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

exports.removeProduct = (userId, productId, product) => {
  return new Promise((resolve, reject) => {
    Cart.findOneAndUpdate(
      { userId: userId, "items.productId": productId },
      {
        $pull: { items: { productId: productId } },
        $inc: { totalPrice: -product.price, totalItems: -1 },
      },
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

exports.sortCartProduct = (userId) => {
  return new Promise((resolve, reject) => {
    Cart.findOne(
      { userId: userId },
      { _id: 0, createdAt: 0, updatedAt: 0, __v: 0 }
    )
      .populate({
        path: "items.productId",
        select: "name description price city state country -_id",
      })
      .then((data) => {
        resolve(data);
      })
      .catch((error) => {
        reject(error);
      });
  });
};

exports.searchProductInCart = (userId, name, city) => {
  return new Promise((resolve, reject) => {
    Cart.findOne({ userId: userId })
      .populate({
        path: "items.productId",
        match: {
          name: { $regex: new RegExp(name, "i") },
          city: { $regex: new RegExp(city, "i") },
        },
      })
      .then((filterCart) => {
        filterCart = filterCart.items.filter((x) => x.productId !== null);
        resolve(filterCart);
      })
      .catch((error) => {
        reject(error);
      });
  });
};

exports.deleteCart = (userId) => {
  return new Promise((resolve, reject) => {
    Cart.findOneAndUpdate(
      { userId: userId },
      { $set: { items: [], totalPrice: 0, totalItems: 0 } },
      { $new: true }
    )
      .then((data) => {
        resolve(data);
      })
      .catch((error) => {
        reject(error);
      });
  });
};
