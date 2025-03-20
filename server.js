process.loadEnvFile()

const express = require("express");
const logger = require("morgan");
const cors = require("cors");
const mongoose = require("mongoose");
const Artist = require("./models/Artist.model");
const Song = require("./models/Song.model");

mongoose.connect(process.env.MONGODB_URI)
.then(()=>{
  console.log("Conectados a la DB")
})
.catch((error)=>{
  console.log(error)
});

const app = express();

/*COMPROBAR WEEK 7 DAY 4 PARA FUNCIONALIDAD EXTRA DE POPULATE*/
// all middlewares & configurations here
app.use(logger("dev"));
app.use(express.static("public"));

// to allow CORS access from anywhere
app.use(cors({
  origin: process.env.ORIGIN
}));

// below two configurations will help express routes at correctly receiving data. 
app.use(express.json()); // recognize an incoming Request Object as a JSON Object
app.use(express.urlencoded({ extended: false })); // recognize an incoming Request Object as a string or array

// all routes here...
app.get("/api", (req, res, next) => {
  res.status(200).json({ message: "all good here!" })
})

//ruta de pruebas para aprender body, params y query

app.get("/api/test/:movieId", (req, res) => {

  //como el servidor puede acceder a ese valor dinamico?
  console.log(req.params)

  //como el servidor puede acceder a valores dinaicos de query?
  console.log(req.query)

  //como el servidor puede acceder a la data del body?
  console.log(req.body)
  res.sendStatus(200)
})

//Hacemos rutas de CRUD para artistas

app.post("/artist",(req,res)=>{
  
  //como el postman deberia pasar la data del nuevo artista = en el body

  //como el server accede a la data del nuevo artista
  console.log(req.body)

  //como el server accede a la data del artista a crear
  Artist.create({
    name: req.body.name,
    awardsWon: req.body.awardsWon,
    isTouring:req.body.isTouring,
    genre: req.body.genre
  })
  .then(()=>{
    res.sendStatus(201)
  })
  .catch((error)=>{
    console.log(error)
  })
})

app.get("/api/artist",(req,res)=>{
  Artist.find(req.query)
  .sort({name:1})
  .then((response)=>{
    res.status(200).json(response);
  })
  .catch((error)=>{
    console.log(error)
  })
})

/*app.get("/artist/search",(req,res)=>{

  console.log(req.query)

  Artist.find(req.query) //coge el query dinamico del cliente y lo usa para filtrar la db
  .select({name:1, awardsWon:1, _id:0}) //dame solo las dos pripiedades indicadas
  .sort({name:1}) //ordenar alfabeticamente por nombre
  .then((response)=>{
    res.json(response);
  })
  .catch((error)=>{
    console.log(error)
  })
})*/

//(SALTADA)Ruta de buscar detalles de artista TAREA

//Ruta de borrar artista
app.delete("/api/artist/:artistId",(req,res)=>{

  console.log(req.query)

  Artist.findByIdAndDelete(req.params.artistId) //coge el parametro dinamico del cliente y lo usa para filtrar la db
  .then(()=>{
    res.status(202).json("documento borrado");
  })
  .catch((error)=>{
    console.log(error)
  })
})

//Ruta de editar artista
app.put("/api/artist/:artistId", async (req,res)=>{

  try{
    const response = await Artist.findByIdAndUpdate(req.params.artistId, 
      {
      name: req.body.name,
      awardsWon: req.body.awardsWon,
      isTouring:req.body.isTouring,
      genre: req.body.genre
    },/*{new: "true"}*/)
    //Por alguna razon, mongo nos devuelve el documento antes de las actualizaciones.
    //TAREA: buscar como hacer para que mongo nos devuelva el documento despues de la actualizacion
    //SOLUCION: Agregamos al metodo findByIdAndUpdate {new: "true"}

    res.sendStatus(202) // el cliente quiere el documento modificado

  }catch(error){
    console.log(error)
  }
})

//PATCH: week 7 day 3, ver grabacion

//RUTAS DE CANCIONES

//Ruta de crear canciones
app.post("/api/song", async (req, res)=>{
  try{
    await Song.create({
      title:req.body.title,
      releaseDate:req.body.releaseDate,
      artist:req.body.artist
    })

    res.sendStatus(201)
  }catch(error){
    console.log(error);
  }
})
//Ruta de ver canciones
app.get("/api/song", async (req, res, next)=>{
  try{

    //const response = await Song.find().populate("artist", "name")
    const response = await Song.find().populate({
      path:"artist",
      select:{name: 1, isTouring: 1}
    //....podemos aplicar otras propiedades como sort, limit skip (si la propiedad fuese un array de ids)
    })
    res.status(200).json(response)
  
  }catch(error){
    next(error) //nos envia al gestor de errores 500
  }
})

//GESTOR DE ERRORES

//errores de 404
app.use((req,res)=>{
res.status(404).json({errorMessage: "No existe la ruta indicada"})
})

//errores de 500
app.use((error, req, res, next)=>{
  //si esta funcion recibe 4 parametros entonces es el gestor de errores 500
  console.log(error)
  res.status(500).json({errorMessage: "error de servidor"})
})

// server listen & PORT
const PORT = process.env.PORT || 5005

app.listen(PORT, () => {
  console.log(`Server listening on http://localhost:${PORT}`);
});
