
import express from 'express'
import { readFile } from 'fs/promises';
const app = express()
app.use(express.urlencoded())


app.get('/movies',async(req,res)=>{
    if(!req.query.genre && !req.query.year){
        res.send(JSON.stringify({ message: "Both 'genre' and 'year' parameters are required", data: [] }))
        return
    }
    
    const genre = req.query.genre
    const year = req.query.year.split(',').map(Number);
    let arr =[]

    try {
        const data = await readFile('./movies.json', 'utf-8');
        const movies = JSON.parse(data);
        arr = movies.filter((movie)=>{
            return  movie.genre.toLowerCase() === genre.toLowerCase() && year.includes(movie.year)
        })
        
    } catch (err) {
        res.send(err);
    }
    
    res.send(arr)
})


app.listen(3000,()=>{
    console.log("server started.........");
    
})