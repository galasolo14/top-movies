const axios = require('axios');
const { json } = require('express');
const NodeCache = require( "node-cache" );
const myCache = new NodeCache({ stdTTL: 300});

// const oldKey = '78e9821b'
const KEY = '461ae2b4'

const topMovies = ['tt3704428', 'tt0120591', 'tt13320622', 'tt3554046', 'tt0120338', 'tt0133093', 'tt0110357', 'tt7286456', 'tt0119217', 'tt8579674']

const fetchMovies = async () => {
    try {
        
        if(myCache.has("movies")){
            return myCache.get("movies") 
        }else{
            const moviesPromise = [];
            const allMovies = [];
            for(let i=0; i<topMovies.length; i++){
                const moviePromise = axios.get(`https://www.omdbapi.com/?&apikey=${KEY}&type=movie&i=${topMovies[i]}`);
                moviesPromise.push(moviePromise)       
            }
            await Promise.all(moviesPromise).then((results)=> {
                results.forEach(result => { 
                    allMovies.push(result.data) 
                })
                myCache.set("movies", allMovies);   
            }).catch((err)=> { throw new Error(err);});
            return allMovies
        }   
    } catch (err) {
        throw new Error(err);
    }  
}

const fetchNames = async (value) => {
    try {
        let result = {};
        SEARCH_NAME = `https://www.omdbapi.com/?&apikey=${KEY}&type=movie&s=${value}`
        const response = await axios.get(SEARCH_NAME);
        const {Search, Error} = response.data
        if(!response.data.Search){
            if(Error ===  'Too many results.'){
                result.status = 3
                result.message = Error 
            }
            if(Error ===  'Movie not found!'){
                result.status = 4
                result.message = Error
            }
            return result
        }
        result.status = null
        result.message = null
        result.data = response.data.Search
        return result
    } catch (err) {
        throw new Error(err);
    }  
}

const fetchMovieId = async (id) => {
    try {
        let result = {};
        MOVIE_URL = `https://www.omdbapi.com/?&apikey=${KEY}&i=${id}`
        const movieDetails = await axios.get(MOVIE_URL);
        const {Poster, Rated, Plot, Title, Response, Error} = movieDetails.data;
        if(Rated === 'N/A' && Poster === 'N/A' && Plot === 'N/A'){
            result.status = 1
            result.message = `Details are not avaliable for "${Title}" - Please select a different movie`
            result.data = null 
            return result
        }
        if(Response === 'False'){
            result.status = 2
            result.message = Error
            result.data = null 
            return result
        }
        result.status = null
        result.message = null
        result.data = movieDetails.data
        return result
    } catch (err) {
        throw new Error(err);
    }  
}

module.exports = { fetchMovies, fetchNames, fetchMovieId }