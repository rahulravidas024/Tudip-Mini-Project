const mongoose = require("mongoose");
const ObjectId = mongoose.Schema.Types.ObjectId;

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    gender: {
      type: String,
      lowercase: true,
      enum: ["male", "female", "other"],
    },
    mobileNumber: {
      type: Number,
      required: true,
      unique: true,
    },
    pincode: {
      type: Number,
    },
    address: {
      type: String,
    },
    role: {
      type: String,
    },
    isActive: {
      type: Boolean,
      required: true,
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    favoriteProducts: [
      {
        type: ObjectId,
        ref: "Product",
      },
    ],
  },
  { timestamps: true }
);

const User = mongoose.model("User", userSchema);

exports.findUser = (userId) => {
  return new Promise((resolve, reject) => {
    User.findOne({ _id: userId, isActive: true })
      .then((data) => {
        resolve(data);
      })
      .catch((error) => {
        reject(error);
      });
  });
};

exports.findEmail = (email) => {
  return new Promise((resolve, reject) => {
    User.findOne({ email: email })
      .then((data) => {
        resolve(data);
      })
      .catch((error) => {
        reject(error);
      });
  });
};

exports.findMobileNumber = (mobileNumber) => {
  return new Promise((resolve, reject) => {
    User.findOne({ mobileNumber: mobileNumber })
      .then((data) => {
        resolve(data);
      })
      .catch((error) => {
        reject(error);
      });
  });
};

exports.createUser = (data) => {
  return new Promise((resolve, reject) => {
    User.create(data)
      .then((createData) => {
        resolve(createData);
      })
      .catch((error) => {
        reject(error);
      });
  });
};

exports.getALlUser = () => {
  return new Promise((resolve, reject) => {
    User.find()
      .then((getData) => {
        resolve(getData);
      })
      .catch((error) => {
        reject(error);
      });
  });
};

exports.getUserByQueryString = (userId) => {
  return new Promise((resolve, reject) => {
    User.findOne({ _id: userId }, { _id: 0, name: 1, password: 1, gender: 1 })
      .then((getData) => {
        resolve(getData);
      })
      .catch((error) => {
        reject(error);
      });
  });
};

exports.getUserByQueryParams = (userId) => {
  return new Promise((resolve, reject) => {
    User.findOne({ _id: userId }, { _id: 0, name: 1, password: 1, gender: 1 })
      .then((getData) => {
        resolve(getData);
      })
      .catch((error) => {
        reject(error);
      });
  });
};

exports.getUserByLimit = (limit) => {
  return new Promise((resolve, reject) => {
    User.find({}, { _id: 0, name: 1, mobileNumber: 1, gender: 1 })
      .limit(limit)
      .then((getData) => {
        resolve(getData);
      })
      .catch((error) => {
        reject(error);
      });
  });
};

exports.updateUser = (data, userId) => {
  return new Promise((resolve, reject) => {
    User.findOneAndUpdate({ _id: userId }, { $set: data }, { new: true })
      .then((userUpdated) => {
        resolve(userUpdated);
      })
      .catch((error) => {
        reject(error);
      });
  });
};

exports.deleteUser = (userId) => {
  return new Promise((resolve, reject) => {
    User.findOneAndUpdate({ _id: userId }, { $set: { isActive: false } })
      .then((data) => {
        resolve(data);
      })
      .catch((error) => {
        reject(error);
      });
  });
};

exports.getFilteredUser = async (data) => {
  let { name, email, role, isActive } = data;

  let filterUser = User.find({});

  if (name) {
    filterUser = filterUser.find({ name: { $regex: new RegExp(name, "i") } });
  }
  if (email) {
    filterUser = filterUser.find({
      email: { $regex: new RegExp(email, "i") },
    });
  }
  if (role) {
    filterUser = filterUser.find({ role: { $regex: new RegExp(role, "i") } });
  }
  if (isActive) {
    filterUser = filterUser.find({
      isActive: isActive,
    });
  }

  return new Promise((resolve, reject) => {
    filterUser
      .sort({ name: 1 })
      .then((data) => {
        resolve(data);
      })
      .catch((error) => {
        reject(error);
      });
  });
};

exports.addFavoriteProduct = (userId, product) => {
  return new Promise((resolve, reject) => {
    User.findOneAndUpdate(
      { _id: userId },
      { $addToSet: { favoriteProducts: product } },
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

exports.getAllFavoriteProduct = (userId) => {
  return new Promise((resolve, reject) => {
    User.findById(userId)
      .populate("favoriteProducts")
      .then((data) => {
        resolve(data);
      })
      .catch((error) => {
        reject(error);
      });
  });
};

exports.removeFavoriteProduct = (userId, productId) => {
  return new Promise((resolve, reject) => {
    User.findOneAndUpdate(
      { _id: userId },
      { $pull: { favoriteProducts: productId } },
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

exports.verifyEmail = async (userId) => {
  return new Promise((resolve, reject) => {
    User.findOneAndUpdate({ _id: userId }, { $set: { isVerified: true } })
      .then((data) => {
        resolve(data);
      })
      .catch((error) => {
        reject(error);
      });
  });
};
