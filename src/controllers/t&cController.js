const TermsAndConditions = require("../models/T&C");

exports.createTermsAndConditions = async (req, res) => {
  try {
    const { content } = req.body;
    if (!content) {
      return res
        .status(400)
        .json({ success: false, message: "Content is required" });
    }
    const newTermsAndConditions = new TermsAndConditions({ content });
    await newTermsAndConditions.save();
    return res
      .status(201)
      .json({ success: true, termsAndConditions: newTermsAndConditions });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ success: false, message: "Internal Server Error" });
  }
};

exports.getTermsAndConditions = async (req, res) => {
  try {
    const termsAndConditions = await TermsAndConditions.findOne().sort({
      createdAt: -1,
    });
    if (!termsAndConditions) {
      return res
        .status(404)
        .json({ success: false, message: "Terms and conditions not found" });
    }
    return res.json(termsAndConditions);
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ success: false, message: "Internal Server Error" });
  }
};

exports.updateTermsAndConditions = async (req, res) => {
  try {
    const { content } = req.body;
    if (!content) {
      return res
        .status(400)
        .json({ success: false, message: "Content is required" });
    }
    const updatedTermsAndConditions = await TermsAndConditions.findOneAndUpdate(
      {},
      { content },
      { new: true }
    );
    if (!updatedTermsAndConditions) {
      return res
        .status(404)
        .json({ success: false, message: "Terms and conditions not found" });
    }
    return res.json({
      success: true,
      termsAndConditions: updatedTermsAndConditions,
    });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ success: false, message: "Internal Server Error" });
  }
};
