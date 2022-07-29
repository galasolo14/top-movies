
const validMovieId = (req, res, next) => {
    let error = "Movie ID is not valid"
    if(req.params.id.length < 7){
        return res.status(400).send(error)
    }else{
        let tt = req.params.id.slice(0,2)
        let number = Number(req.params.id.slice(2))
        if(tt === 'tt' && number !== 'NaN'){
            return next();
        }
        return res.status(400).send(error)
    }
}

module.exports = {validMovieId};