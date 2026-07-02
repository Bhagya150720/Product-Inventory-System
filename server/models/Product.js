import mongoose from 'mongoose';

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Product name is required'],
      trim: true,
    },
    description: {
      type: String,
      trim: true,
      default: '',
    },
    quantity: {
      type: Number,
      required: [true, 'Quantity is required'],
      min: [0, 'Quantity cannot be negative'],
      validate: {
        validator: Number.isInteger,
        message: 'Quantity must be an integer',
      },
    },
    categories: {
      type: [
        {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'Category',
        },
      ],
      validate: {
        validator: function (val) {
          return val && val.length > 0;
        },
        message: 'At least one category must be selected',
      },
    },
    isDeleted: {
      type: Boolean,
      required: true,
      default: false,
    },
  },
  { timestamps: true }
);

// Partial unique index for name uniqueness among active products
productSchema.index(
  { name: 1 },
  { unique: true, partialFilterExpression: { isDeleted: false } }
);

const Product = mongoose.model('Product', productSchema);
export default Product;
