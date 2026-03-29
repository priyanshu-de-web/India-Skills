const Song = require("../model/Song");

const getStatistics = async (req, res) => {
  try {
    const metrics = req.query.metrics || req.query.metric || "songs";

    if (metrics === "songs") {
      const songs = await Song.find({ is_deleted: false }).sort({
        view_count: -1,
      });

      return res.status(200).json({
        success: true,
        data: songs,
      });
    }

    if (metrics === "album" || metrics === "albums") {
      const result = await Song.aggregate([
        { $match: { is_deleted: false } },
        { $group: { _id: "$album_id", total_views: { $sum: "$view_count" } } },
        { $sort: { total_views: -1 } },
      ]);

      return res.status(200).json({
        success: true,
        data: result,
      });
    }

    if(metrics === "label" || metrics === "labels"){
        const result = await Song.aggregate([
            { $match: { is_deleted: false } },
            { $unwind: "$label" },
            { $group: { _id: "$label", total_views: { $sum: "$view_count" } } },
            { $sort: { total_views: -1 } },
            { $project:{ label: "$_id", total_views: 1, songs :{ slice : ["$songs",10]}} }
            ]);

        return res.status(200).json({
            success: true,
            data: result,
          });
    }
    


    res.status(400).json({
      success: false,
      message: "Invalid metrics",
    });
  } catch (error) {
    console.log("Get Statistics Error: ", error.message);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

module.exports = {
  getStatistics,
};
