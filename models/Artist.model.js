const mongoose = require("mongoose");

//esquema

const artistSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true
    },
    awardsWon: {
        type: Number,
        min: 0,
        default: 0
    },
    isTouring: Boolean,
    genre: {
        type:[String],
        enum:["rock", "alternative", "punk", "salsa", "techno"]
    }
})

//modelo: HERRAMIENTA QUE NOS PERMITE IR A LA COLECCION ESPECIFICA PARA HACER BUSQUEDAS O MODIFICACIONES

const Artist = mongoose.model("Artist", artistSchema);
// Argumento 1: Nombre interno con el que se conode el modelo, SIEMPRE SINGULAR e IMGLES
// Argumernto 2: el esquema

module.exports = Artist;