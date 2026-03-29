const Album = require("../model/Album");

const createAlbum = async (req, res) => {
  try {
    const { title, artist, release_year, genre, description } = req.body;

    //validation
    if (!title || !artist || !release_year || !genre) {
      return res.status(400).json({
        success: false,
        message: "Validation failed",
      });
    }

    //create album
    const album = await Album.create({
      title,
      artist,
      release_year,
      genre,
      description,
      publisher: req.user._id, // from middleware
    });

    res.status(201).json({
      success: true,
      data: album,
    });
  } catch (error) {
    console.log("Create Album Error: ", error.message);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

const getAllAlbums = async (req, res) => {
  try {
    let { limit = 10, cursor, year } = req.query;

    limit = parseInt(limit);
    if (limit > 100) {
      return res.status(400).json({
        success: false,
        message: "Limit cannot exceed 100",
      });
    }

    let query = { is_deleted: false };

    //year filter
    if (year) {
      if (year.includes("-")) {
        const [start, end] = year.split("-").map(Number);
        query.release_year = { $gte: start, $lte: end };
      } else {
        query.release_year = Number(year);
      }
    }

    //cursor logic
    if (cursor) {
      const decoded = JSON.parse(
        Buffer.from(cursor, "base64").toString("utf-8"),
      );

      query._id = { $gt: decoded.id };
    }

    const albums = await Album.find(query)
      .sort({ _id: 1 })
      .limit(limit)
      .populate("publisher", "id username email");

    //next cursor
    let next_cursor = null;

    if (albums.length === limit) {
      const lastAlbum = albums[albums.length - 1];

      const cursorObj = { id: lastAlbum._id };
      next_cursor = Buffer.from(JSON.stringify(cursorObj)).toString("base64");
    }

    res.json({
      success: true,
      data: albums,
      meta: {
        next_cursor,
      },
    });
  } catch (error) {
    console.log("Get Albums Error: ", error.message);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

const getAlbumDetails = async (req, res) => {
  try {
    const { id } = req.params;

    const album = await Album.findById(id);

    if (!album || album.is_deleted) {
      return res.status(404).json({
        success: false,
        message: "Album not found",
      });
    }

    // Populate publisher details
    await album.populate("publisher", "username email");

    res.json({
      success: true,
      data: album,
    });
  } catch (error) {
    console.log("Get Album Details Error: ", error.message);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

module.exports = { createAlbum, getAllAlbums, getAlbumDetails };
