const PrivacyPolicy = require("../models/PrivacyPolicy");

exports.createPrivacyPolicy = async (req, res) => {
  try {
    const { title, content } = req.body;
    if (!title || !content) {
      return res
        .status(400)
        .json({ success: false, message: "Title and content are required" });
    }
    const newPolicy = new PrivacyPolicy({ title, content });
    await newPolicy.save();
    return res.status(201).json({ success: true, policy: newPolicy });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ success: false, message: "Internal Server Error" });
  }
};

exports.getAllPrivacyPolicies = async (req, res) => {
  try {
    const policies = await PrivacyPolicy.find();
    return res.json(policies);
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ success: false, message: "Internal Server Error" });
  }
};

exports.getPrivacyPolicyById = async (req, res) => {
  try {
    const { id } = req.params;
    if (!id) {
      return res
        .status(400)
        .json({ success: false, message: "ID is required" });
    }
    const policy = await PrivacyPolicy.findById(id);
    if (!policy) {
      return res
        .status(404)
        .json({ success: false, message: "Privacy policy not found" });
    }
    return res.json(policy);
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ success: false, message: "Internal Server Error" });
  }
};

exports.updatePrivacyPolicy = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, content } = req.body;
    if (!id || !title || !content) {
      return res
        .status(400)
        .json({
          success: false,
          message: "ID, title, and content are required",
        });
    }
    const updatedPolicy = await PrivacyPolicy.findByIdAndUpdate(
      id,
      { title, content },
      { new: true }
    );
    if (!updatedPolicy) {
      return res
        .status(404)
        .json({ success: false, message: "Privacy policy not found" });
    }
    return res.json({ success: true, policy: updatedPolicy });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ success: false, message: "Internal Server Error" });
  }
};

exports.deletePrivacyPolicy = async (req, res) => {
  try {
    const { id } = req.params;
    if (!id) {
      return res
        .status(400)
        .json({ success: false, message: "ID is required" });
    }
    const deletedPolicy = await PrivacyPolicy.findByIdAndDelete(id);
    if (!deletedPolicy) {
      return res
        .status(404)
        .json({ success: false, message: "Privacy policy not found" });
    }
    return res.json({
      success: true,
      message: "Privacy policy deleted successfully",
    });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ success: false, message: "Internal Server Error" });
  }
};
