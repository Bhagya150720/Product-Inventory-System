import Product from '../models/Product.js';
import Category from '../models/Category.js';

// @desc    Get all products (filtered, paginated, and non-deleted)
// @route   GET /api/products
// @access  Public
export const getProducts = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 5;
    const search = req.query.search || '';
    const categoriesStr = req.query.categories || '';

    // Only query active (non-deleted) products
    const query = { isDeleted: false };

    // Search by product name (case-insensitive regex)
    if (search) {
      query.name = { $regex: search, $options: 'i' };
    }

    // Filter by categories (matches products belonging to ANY of selected categories)
    if (categoriesStr) {
      const categoryIds = categoriesStr.split(',').filter(id => id.trim() !== '');
      if (categoryIds.length > 0) {
        query.categories = { $in: categoryIds };
      }
    }

    const skip = (page - 1) * limit;

    const totalProducts = await Product.countDocuments(query);
    const products = await Product.find(query)
      .populate('categories', 'name')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const totalPages = Math.ceil(totalProducts / limit);

    res.status(200).json({
      success: true,
      products,
      pagination: {
        currentPage: page,
        totalPages,
        totalProducts,
        limit,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create a new product
// @route   POST /api/products
// @access  Public
export const createProduct = async (req, res, next) => {
  try {
    const { name, description, quantity, categories } = req.body;

    // Server-side validations
    if (!name || name.trim() === '') {
      res.status(400);
      throw new Error('Product name is required');
    }

    if (quantity === undefined || quantity === null) {
      res.status(400);
      throw new Error('Quantity is required');
    }

    const qtyNumber = Number(quantity);
    if (isNaN(qtyNumber) || !Number.isInteger(qtyNumber) || qtyNumber < 0) {
      res.status(400);
      throw new Error('Quantity must be a non-negative integer');
    }

    if (!categories || !Array.isArray(categories) || categories.length === 0) {
      res.status(400);
      throw new Error('At least one category must be selected');
    }

    // Verify all category IDs exist in db
    const categoryCount = await Category.countDocuments({ _id: { $in: categories } });
    if (categoryCount !== categories.length) {
      res.status(400);
      throw new Error('One or more selected categories are invalid');
    }

    // Check for case-insensitive duplicate name among active products
    const normalizedName = name.trim();
    const duplicate = await Product.findOne({
      name: { $regex: `^${normalizedName}$`, $options: 'i' },
      isDeleted: false,
    });

    if (duplicate) {
      res.status(400);
      throw new Error('A product with this name already exists');
    }

    const product = new Product({
      name: normalizedName,
      description: description ? description.trim() : '',
      quantity: qtyNumber,
      categories,
    });

    const savedProduct = await product.save();
    const populatedProduct = await Product.findById(savedProduct._id).populate('categories', 'name');

    res.status(201).json({
      success: true,
      product: populatedProduct,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Soft delete a product
// @route   DELETE /api/products/:id
// @access  Public
export const deleteProduct = async (req, res, next) => {
  try {
    const product = await Product.findOne({ _id: req.params.id, isDeleted: false });

    if (!product) {
      res.status(404);
      throw new Error('Product not found or already deleted');
    }

    // Soft delete by updating flag
    product.isDeleted = true;
    await product.save();

    res.status(200).json({
      success: true,
      message: 'Product soft-deleted successfully',
    });
  } catch (error) {
    next(error);
  }
};
