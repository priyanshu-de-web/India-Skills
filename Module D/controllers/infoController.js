const InfoItem = require("../model/InfoItem");

const getInfoItems = async (req, res) => {
  try {
    const { category } = req.query;
    let query = {};
    if (category) {
      query.category = category;
    }
    const items = await InfoItem.find(query).sort({ id: 1 });

    res.json({
      success: true,
      data: items,
    });
  } catch (error) {
    console.log("Get Info Items Error: ", error.message);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

module.exports = { getInfoItems };
