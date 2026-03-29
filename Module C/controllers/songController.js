const Song = require("../model/Song");
const Album = require("../model/Album");
const mongoose = require("mongoose");

const addSongToAlbum = async (req, res) => {
  try {
    const { id: albumId } = req.params;
    const { title, duration_seconds, order, label, lyrics, is_cover } =
      req.body;

    //check album
    const album = await Album.findById(albumId);
    if (!album || album.is_deleted) {
      return res.status(404).json({
        success: false,
        message: "Album not found",
      });
    }

    //get next order
    const lastSong = await Song.find({ album_id: albumId })
      .sort({ order: -1 })
      .limit(1);

    const nextOrder = lastSong.length > 0 ? lastSong[0].order + 1 : 1;

    //check cover list

    if (is_cover) {
      const coverCount = await Song.countDocuments({
        album_id: albumId,
        is_cover: true,
        is_deleted: false,
      });
      if (coverCount >= 3) {
        return res.status(400).json({
          success: false,
          message: "Cannot add more than 3 cover songs to an album",
        });
      }
    }

    //convert labels

    const labelsArray = label ? label.split(",") : [];

    const song = await Song.create({
      album_id: albumId,
      title,
      duration_seconds,
      label: labelsArray,
      lyrics,
      is_cover,
      order: nextOrder,
    });

    res.status(201).json({
      success: true,
      data: song,
    });
  } catch (error) {
    console.log("Add Song Error: ", error.message);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

const getSongsInAlbum = async (req, res) => {
  try {
    const { id: albumId } = req.params;

    const songs = await Song.find({
      album_id: albumId,
      is_deleted: false,
    }).sort({ order: 1 });

    res.json({
      success: true,
      data: songs,
    });
  } catch (error) {
    console.log("Get Songs in Album Error: ", error.message);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

const getAlbumCover = async (req, res) => {
  try {
    const { id: albumId } = req.params;

    //get songs marked as cover
    const coverSongs = await Song.find({
      album_id: albumId,
      is_cover: true,
      is_deleted: false,
    }).sort({ order: 1 });

    //rule : max 3 covers
    if (coverSongs.length > 3) {
      return res.status(400).json({
        success: false,
        message: "More than 3 cover songs not allowed",
      });
    }

    //extract cover images
    const covers = coverSongs.map((song) => ({
      song_id: song._id,
      cover_image: song.cover_image,
    }));

    res.json({
      success: true,
      data: covers,
    });
  } catch (error) {
    console.log("Get Album Cover Error: ", error.message);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

const updateSong = async (req, res) => {
  try {
    const { album_id, id: songId } = req.params;
    const { title, duration_seconds, label, lyrics, is_cover } = req.body;

    const song = await Song.findById(songId);

    if (!song || song.is_deleted) {
      return res.status(404).json({
        success: false,
        message: "Song not found",
      });
    }

    //cover validation

    if (is_cover === true && song.is_cover === false) {
      const coverCount = await Song.countDocuments({
        album_id,
        is_cover: true,
        is_deleted: false,
      });
      if (coverCount >= 3) {
        return res.status(400).json({
          success: false,
          message: "Cannot have more than 3 cover songs in an album",
        });
      }
    }

    //update fields
    if (title) song.title = title;
    if (duration_seconds) song.duration_seconds = duration_seconds;
    if (label) song.label = label.split(",");
    if (lyrics) song.lyrics = lyrics;
    if (typeof is_cover === "boolean") song.is_cover = is_cover;

    await song.save();

    res.json({
      success: true,
      data: song,
    });
  } catch (error) {
    console.log("Update Song Error: ", error.message);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

const deleteSong = async (req, res) => {
  try {
    const { id: songId } = req.params;

    const song = await Song.findById(songId);

    if (!song || song.is_deleted) {
      return res.status(404).json({
        success: false,
        message: "Song not found",
      });
    }
    song.is_deleted = true;
    await song.save();

    res.json({
      success: true,
      message: "Song deleted successfully",
    });
  } catch (error) {
    console.log("Delete Song Error: ", error.message);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

const updateSongOrder = async (req, res) => {
  try {
    const { album_id } = req.params;
    const songOrder = req.body.song_order || req.body.song_ids;

    if (!Array.isArray(songOrder)) {
      return res.status(400).json({
        success: false,
        message: "song_order (or song_ids) must be an array of song IDs",
      });
    }

    //validate ObjectIds
    const invalidIds = songOrder.filter(
      (id) => !mongoose.Types.ObjectId.isValid(id),
    );
    if (invalidIds.length > 0) {
      return res.status(400).json({
        success: false,
        message: `Invalid song ID(s): ${invalidIds.join(", ")}`,
      });
    }

    //check all songs belong to this album
    const songs = await Song.find({
      _id: { $in: songOrder },
      album_id,
      is_deleted: false,
    });

    if (songs.length !== songOrder.length) {
      return res.status(400).json({
        success: false,
        message: "All songs must belong to the specified album",
      });
    }

    //update order
    for (let i = 0; i < songOrder.length; i++) {
      await Song.findByIdAndUpdate(songOrder[i], { order: i + 1 });
    }

    res.json({
      success: true,
      message: "Song order updated successfully",
    });
  } catch (error) {
    console.log("Update Song Order Error: ", error.message);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

const getSongDetails = async (req, res) => {
  try {
    const { id } = req.params;
    const song = await Song.findById(id);

    if (!song || song.is_deleted) {
      return res.status(404).json({
        success: false,
        message: "Song not found",
      });
    }

    //increment view count
    song.view_count += 1;
    await song.save();

    res.json({
      success: true,
      data: song,
    });
  } catch (error) {
    console.log("Get Song Details Error: ", error.message);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

const getAllSongs = async (req, res) => {
  try {
    let { keyword, limit = 10, cursor } = req.query;

    limit = parseInt(limit);

    const query = { is_deleted: false };

    //keyword search
    if (keyword) {
      query.title = { $regex: keyword, $options: "i" };
    }

    //cursor pagination
    if (cursor) {
        const decoded = JSON.parse(Buffer.from(cursor, "base64").toString("utf-8"));

        query._id = { $gt: decoded.id };
      } 

      const songs = await Song.find(query)
        .sort({ _id: 1 })
        .limit(limit);

      //next cursor 
      let next_cursor = null;

      if (songs.length === limit) {
        const lastSong = songs[songs.length - 1];
        next_cursor = Buffer.from(JSON.stringify({ id: lastSong._id })).toString("base64");
      }

      res.json({
        success: true,
        data: songs,
        meta: {
          next_cursor,
        },
      });
  } catch (error) {
    console.log("Get All Songs Error: ", error.message);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};




module.exports = {
  addSongToAlbum,
  getSongsInAlbum,
  getAlbumCover,
  updateSong,
  deleteSong,
  updateSongOrder,
  getSongDetails,
  getAllSongs,
};
