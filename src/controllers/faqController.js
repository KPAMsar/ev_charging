const FAQ = require("../models/FAQ");

exports.createFAQ = async (req, res) => {
  try {
    const { question, answer } = req.body;
    if (!question || !answer) {
      return res
        .status(400)
        .json({ success: false, message: "Question and answer are required" });
    }
    const newFAQ = new FAQ({ question, answer });
    await newFAQ.save();
    return res.status(201).json({ success: true, faq: newFAQ });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ success: false, message: "Internal Server Error" });
  }
};

exports.getAllFAQs = async (req, res) => {
  try {
    const faqs = await FAQ.find();
    return res.json(faqs);
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ success: false, message: "Internal Server Error" });
  }
};

exports.getFAQById = async (req, res) => {
  try {
    const { id } = req.params;
    if (!id) {
      return res
        .status(400)
        .json({ success: false, message: "ID is required" });
    }
    const faq = await FAQ.findById(id);
    if (!faq) {
      return res.status(404).json({ success: false, message: "FAQ not found" });
    }
    return res.json(faq);
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ success: false, message: "Internal Server Error" });
  }
};

exports.updateFAQ = async (req, res) => {
  try {
    const { id } = req.params;
    const { question, answer } = req.body;
    if (!id || !question || !answer) {
      return res.status(400).json({
        success: false,
        message: "ID, question, and answer are required",
      });
    }
    const updatedFAQ = await FAQ.findByIdAndUpdate(
      id,
      { question, answer },
      { new: true }
    );
    if (!updatedFAQ) {
      return res.status(404).json({ success: false, message: "FAQ not found" });
    }
    return res.json({ success: true, faq: updatedFAQ });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ success: false, message: "Internal Server Error" });
  }
};

exports.deleteFAQ = async (req, res) => {
  try {
    const { id } = req.params;
    if (!id) {
      return res
        .status(400)
        .json({ success: false, message: "ID is required" });
    }
    const deletedFAQ = await FAQ.findByIdAndDelete(id);
    if (!deletedFAQ) {
      return res.status(404).json({ success: false, message: "FAQ not found" });
    }
    return res.json({ success: true, message: "FAQ deleted successfully" });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ success: false, message: "Internal Server Error" });
  }
};
