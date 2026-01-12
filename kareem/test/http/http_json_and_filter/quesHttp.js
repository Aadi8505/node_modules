// Create an HTTP server using Node.js (without Express) that:
// 1.	Reads data from movies.json.
// 2.	Accepts two query parameters:
// o	genre → Movie genre to filter by (case-insensitive match).
// o	year → One or more years separated by commas. A movie should match if its release year is any of the given years.
// 3.	Returns a JSON array of movies that satisfy both conditions.
// Example Request:
// http://localhost:3000/movies?genre=Action&year=2020,2022
// Expected Behavior:
// •	The genre filter should be case-insensitive (e.g., Action, action, or ACTION should be treated the same).
// •	The year filter should match any year given in the comma-separated list.
// •	If either query parameter is missing, return an empty array with a message stating that both are required.
// Example Response (for above request):
[
    {
        "title": "Fast Chase",
        "genre": "Action",
        "year": 2020,
        "rating": 7.5
    },
    {
        "title": "Mission Reloaded",
        "genre": "Action",
        "year": 2022,
        "rating": 8.1
    }
]

// Demo movies.json

const http = require('http')
const url = require('url')
const fs = require('fs')

const server = http.createServer((req, res) => {
    const path = url.parse(req.url, true)
    if (path.pathname == '/movies' && req.method == 'GET') {

        if (!path.query.genre || !path.query.year) {
            res.end(JSON.stringify({ message: "Both 'genre' and 'year' parameters are required", data: [] }));
            return;
        }

        fs.readFile('./movies.json', 'utf-8', (err, data) => {
            const movies = JSON.parse(data);
            const years = path.query.year.split(',').map(Number);
            const genre = path.query.genre.toLowerCase();

            const filtered = movies.filter(movie =>
                movie.genre.toLowerCase() === genre.toLowerCase() && years.includes(movie.year)
            );
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify(filtered));
        });

    } else {
        res.end(JSON.stringify({ message: "Not Found", data: [] }))
    }


})

server.listen(3000, () => {
    console.log("server started...........http://localhost:3000/movies?genre=Action&year=2020,2022");

})