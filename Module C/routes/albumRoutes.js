const express = require("express");
const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware");
const {
  createAlbum,
  getAllAlbums,
  getAlbumDetails,
} = require("../controllers/albumController");

const {
  addSongToAlbum,
  getSongsInAlbum,
  getAllSongs,
} = require("../controllers/songController");
const { getAlbumCover } = require("../controllers/songController");
const { updateSong } = require("../controllers/songController");
const { deleteSong } = require("../controllers/songController");
const { updateSongOrder } = require("../controllers/songController");
const { getSongDetails } = require("../controllers/songController");

const { getStatistics } = require("../controllers/statsController");

router.post("/albums", authMiddleware, createAlbum);
router.get("/albums", getAllAlbums);
router.get("/albums/:id", getAlbumDetails);
router.post("/albums/:id/songs", authMiddleware, addSongToAlbum);
router.get("/albums/:id/songs", getSongsInAlbum);
router.get("/albums/:id/cover", getAlbumCover);
router.put("/albums/:album_id/songs/order", authMiddleware, updateSongOrder);
router.put("/albums/:album_id/songs/:id", authMiddleware, updateSong);
router.delete("/albums/:album_id/songs/:id", authMiddleware, deleteSong);
router.get("/albums/:album_id/songs/:id", getSongDetails);
router.get("/songs", getAllSongs);

router.get("/statistics", getStatistics);

module.exports = router;
