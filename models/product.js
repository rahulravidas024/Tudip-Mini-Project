const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
    },
    description: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    city: {
      type: String,
    },
    state: {
      type: String,
    },
    country: {
      type: String,
    },
    image: {
      type: String,
      default: "No image",
    },
  },
  { timestamps: true }
);

const Product = mongoose.model("Product", productSchema);

exports.findName = (name) => {
  return new Promise((resolve, reject) => {
    Product.findOne({ name: name })
      .then((data) => {
        resolve(data);
      })
      .catch((error) => {
        reject(error);
      });
  });
};

exports.createProduct = (data) => {
  return new Promise((resolve, reject) => {
    Product.create(data)
      .then((create) => {
        resolve(create);
      })
      .catch((error) => {
        reject(error);
      });
  });
};

exports.getAllProduct = () => {
  return new Promise((resolve, reject) => {
    Product.find()
      .then((data) => {
        resolve(data);
      })
      .catch((error) => {
        reject(error);
      });
  });
};

exports.findProduct = (productId) => {
  return new Promise((resolve, reject) => {
    Product.findById(productId)
      .then((data) => {
        resolve(data);
      })
      .catch((error) => {
        reject(error);
      });
  });
};

exports.updateProduct = (productId, data) => {
  return new Promise((resolve, reject) => {
    Product.findOneAndUpdate({ _id: productId }, { $set: data }, { new: true })
      .then((data) => {
        resolve(data);
      })
      .catch((error) => {
        reject(error);
      });
  });
};

exports.searchProduct = async (data) => {
  let { name, price, city } = data;

  let search = Product.find({});

  if (name) {
    search = search.find({ name: { $regex: new RegExp(name, "i") } });
  }
  if (city) {
    search = search.find({ city: { $regex: new RegExp(city, "i") } });
  }
  if (price) {
    search = search.find({ price: { $lt: price } });
  }

  return new Promise((resolve, reject) => {
    search
      .then((data) => {
        resolve(data);
      })
      .catch((error) => {
        reject(error);
      });
  });
};

exports.sortProduct = async (data) => {
  let { name, price } = data;
  let filterProduct = Product.find({});
  if (name) {
    filterProduct = filterProduct.find().sort({ name: name });
  }

  if (price) {
    filterProduct = filterProduct.find().sort({ price: price });
  }

  return new Promise((resolve, reject) => {
    filterProduct
      .then((data) => {
        resolve(data);
      })
      .catch((error) => {
        reject(error);
      });
  });
};

exports.deleteProduct = (productId) => {
  return new Promise((resolve, reject) => {
    Product.findOneAndDelete({ _id: productId })
      .then((data) => {
        resolve(data);
      })
      .catch((error) => {
        reject(error);
      });
  });
};
