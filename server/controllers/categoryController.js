const Category = require('../models/Category');
const Product = require('../models/Product');

exports.createCategory = async (req, res) => {
  try {
    const { name,categoryCode, description, icon, parent } = req.body;
    const category = new Category({ name,categoryCode, description, icon, parent: parent || null });
    await category.save();
    res.status(201).json(category);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.getCategories = async (req, res) => {
  try {
    const categories = await Category.find().populate('parent', 'name slug');
    res.json({ success: true, data: categories });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

exports.getCategoryById = async (req, res) => {
  try {
    const category = await Category.findById(req.params.id).populate('parent', 'name slug');
    if (!category) return res.status(404).json({ error: 'Category not found' });
    res.json(category);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.updateCategory = async (req, res) => {
  try {
    const { name,categoryCode, description, icon, parent } = req.body;
    const category = await Category.findByIdAndUpdate(req.params.id,
      { name,categoryCode, description, icon, parent: parent || null },
      { new: true, runValidators: true });
    if (!category) return res.status(404).json({ error: 'Category not found' });
    res.json(category);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.deleteCategory = async (req, res) => {
  try {
    // Products jinke category ye hai unka category field unset kar do (ya apne hisaab se handle karo)
    await Product.updateMany({ category: req.params.id }, { $unset: { category: "" } });

    const category = await Category.findByIdAndDelete(req.params.id);
    if (!category) return res.status(404).json({ error: 'Category not found' });
    res.json({ message: 'Category deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
