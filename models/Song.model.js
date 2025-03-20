const {Schema, model} = require("mongoose")

const songSchema = new Schema({
    title:String,
    releaseDate: Date,
    artist: {
        type: Schema.Types.ObjectId,
        ref: "Artist"
    }
})

const Song = model("Song", songSchema)

module.exports = Song