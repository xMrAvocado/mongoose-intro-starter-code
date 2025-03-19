process.loadEnvFile()

const express = require("express");
const logger = require("morgan");
const cors = require("cors");
const mongoose = require("mongoose");
const Artist = require("./models/Artist.model");

mongoose.connect("mongodb://localhost:27017/artists-db")
.then(()=>{
  console.log("Conectados a la DB")
})
.catch((error)=>{
  console.log(error)
});

const app = express();


// all middlewares & configurations here
app.use(logger("dev"));
app.use(express.static("public"));

// to allow CORS access from anywhere
app.use(cors({
  origin: '*'
}));

// below two configurations will help express routes at correctly receiving data. 
app.use(express.json()); // recognize an incoming Request Object as a JSON Object
app.use(express.urlencoded({ extended: false })); // recognize an incoming Request Object as a string or array

// all routes here...
app.get("/", (req, res, next) => {
  res.json({ message: "all good here!" })
})

//ruta de pruebas para aprender body, params y query

app.get("/test/:movieId", (req, res) => {

  //como el servidor puede acceder a ese valor dinamico?
  console.log(req.params)

  //como el servidor puede acceder a valores dinaicos de query?
  console.log(req.query)

  //como el servidor puede acceder a la data del body?
  console.log(req.body)
  res.json("todo bien")
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
    res.json("POST artistas bien")
  })
  .catch((error)=>{
    console.log(error)
  })
})

app.get("/artist",(req,res)=>{
  Artist.find()
  .select({name:1, _id:0})
  .sort({name:1})
  .then((response)=>{
    res.json(response);
  })
  .catch((error)=>{
    console.log(error)
  })
})

app.get("/artist/search",(req,res)=>{

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
})

//(SALTADA)Ruta de buscar detalles de artista TAREA

//Ruta de borrar artista
app.delete("/artist/:artistId",(req,res)=>{

  console.log(req.query)

  Artist.findByIdAndDelete(req.params.artistId) //coge el parametro dinamico del cliente y lo usa para filtrar la db
  .then(()=>{
    res.json("documento borrado");
  })
  .catch((error)=>{
    console.log(error)
  })
})

//Ruta de editar artista
app.put("/artist/:artistId", async (req,res)=>{

  try{
    const response = await Artist.findByIdAndUpdate(req.params.artistId, 
      {
      name: req.body.name,
      awardsWon: req.body.awardsWon,
      isTouring:req.body.isTouring,
      genre: req.body.genre
    })
    //Por alguna razon, mongo nos devuelve el documento antes de las actualizaciones.
    //TAREA: buscar como hacer para que mongo nos devuelva el documento despues de la actualizacion

    res.json(response) // el cliente quiere el documento modificado

  }catch(error){
    console.log(error)
  }
})

//PATCH: week 7 day 3, ver grabacion

// server listen & PORT
const PORT = process.env.PORT || 5005

app.listen(PORT, () => {
  console.log(`Server listening on http://localhost:${PORT}`);
});
