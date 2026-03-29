const Region = require("../model/Region");
const Attraction = require("../model/Attraction");

const getRegionsWithAttractions = async (req, res) => {
  try {
    const regions = await Region.find().sort({ id: 1 });

    const regionsWithAttractions = await Promise.all(
      regions.map(async (region) => {
        const attractions = await Attraction.find({ region_id: region._id });
        return {
          _id: region._id,
          id: region.id,
          key: region.key,
          name: region.name,
          color: region.color,
          summary: region.summary,
          attractions,
        };
      })
    );

    res.json({
      success: true,
      data: regionsWithAttractions,
    });
  } catch (error) {
    console.log("Get Regions Error: ", error.message);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

module.exports = { getRegionsWithAttractions };
