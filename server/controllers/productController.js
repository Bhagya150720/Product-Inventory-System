import Product from '../models/Product.js';
import Category from '../models/Category.js';


export const getProducts = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 5;
    const search = req.query.search || '';
    const categoriesStr = req.query.categories || '';

    
    const query = { isDeleted: false };

    if (search) {
      query.name = { $regex: search, $options: 'i' };
    }

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

export const createProduct = async (req, res, next) => {
    try{
         const {name,description,quantity,categories}=req.body;

          const errors={};

          if(!name || name.trim()==='')
          {
            errors.name="Product name is required";
          }
          else{
              const duplicate=await Product.findOne({
                name:{$regex:`^${name.trim()}`,$options:'i'},
                isDeleted:false,
              });

              if(duplicate)
              {
                errors.name="A Product with this name already exists";
              }
          }
          if(quantity===undefined || quantity===null || quantity==="" )
          {
            errors.quantity="Quantity is required"; 
          } else {
              const qty=Number(quantity);
              if(isNaN(qty)||qty<0||!Number.isInteger(qty))
              {
                errors.quantity="Quantity must be a Positive whole number";
              }
          }

          if(Object.keys(errors).length>0)
          {
            return res.status(400).json({
              success:false,
              message:"validation failed",
              errors,
            })
          }

          const product = new Product({
            name: name.trim(),
            description: description ? description.trim() : '',
            quantity: Number(quantity),
            categories,
          });

          const saveProduct = await product.save();

          const populateProduct = await Product.findById(saveProduct._id).populate("categories", "name");

          res.status(201).json({
            success: true,
            product: populateProduct         
          });  
    }
    catch(error)
    {
       res.status(500).json({
        success:false,
        message:error.message
       });
    }
};


export const deleteProduct = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product || product.isDeleted) {
      return res.status(404).json({
        success: false,
        message: 'Product not found or already deleted'
      });
    }

   
    product.isDeleted = true;
    await product.save();

    res.status(200).json({
      success: true,
      message: 'Product deleted successfully',
    });
  } catch (error) {
    next(error);
  }
};
