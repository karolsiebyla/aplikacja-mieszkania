const jsonServer = require("json-server")
const multer  = require('multer')
const server = jsonServer.create()
const router = jsonServer.router('db.json')
const middlewares = jsonServer.defaults()

server.use(middlewares)

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'public/images')
    },
    filename: function (req, file, cb) {
        let date = new Date()
        let imageFileName = date.getTime() + "_" + file.originalname
        req.body.imageFileName = imageFileName
        cb(null, imageFileName)
    }
})

let nextId = 1;

const bodyParser = multer({ storage: storage }).any()

server.use(bodyParser)
server.post("/offers", (req, res, next) => {
    let date = new Date()
        req.body.createdAt = date.toISOString()

    if (req.body.price) {
        req.body.price = Number(req.body.price)
    }

    let hasErrors = false
    let errors = {}

    if (req.body.location.length < 2) {
        hasErrors = true
        errors.location = "nazwa miasta/miejscowości powinna być dłużasza niż 2 znaki"
    }
    if (req.body.price.length <= 0) {
        hasErrors = true
        errors.location = "Cena nie może być ujemna lub zerowa"
    }
    if (req.body.city.length <= 0) {
        hasErrors = true
        errors.city = "liczba ludnosci nie może być ujemna lub zerowa"
    }
    if (req.body.standard.length <= 0) {
        hasErrors = true
        errors.standard = "standard nie może być ujemny lub zerowy"
    }
    if (req.body.year.length <= 1900) {
        hasErrors = true
        errors.featuresFlat.year = "rok nie może być mniejszy niż 1900"
    }

    if (hasErrors) {
        res.status(400).jsonp(errors)
        return
    }

    next()
})

server.use(router)
server.listen(4000, () => {
    console.log('JSON Server is running')
})