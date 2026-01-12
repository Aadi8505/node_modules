// periodic logger
import fs from "fs/promises"
setInterval(async () => {
  let current = new Date();
  let date = current.toLocaleDateString('en-CA');
  let time = current.toLocaleTimeString('en-GB', { hour12: false });
  await fs.appendFile('./activity.log', date + " " + time + "\n");
}, 10000)

// copy a file
import fs from "fs";
import fsp from "fs/promises";
(async () => {
  try {
    if (!fs.existsSync('./backups')) {
      await fsp.mkdir('./backups');
    }
    await fsp.copyFile('./report.pdf', './backups/aftercopy.pdf');
    console.log("File copied successfully.");
  } catch (err) {
    console.log(err);
  }
})();
// list all file in a directory
import fs from "fs/promises"
import path from "path"
let files = await fs.readdir('./documents');
console.log("File Names:");
for (let i = 0; i < files.length; i++) {
  if (path.extname(files[i]) != "")
    console.log(path.basename(files[i]) + ",");
}

// backup system
import fs from "fs/promises"
import path from "path";
const source = './mynotes';
const destination = './backupNotes';
try {
  await fs.mkdir(destination, { recursive: true });
  let files = await fs.readdir(source);
  for (let i = 0; i < files.length; i++) {
    if (path.extname(files[i]) === '.txt') {
      await fs.copyFile(
        path.join(source, files[i]),
        path.join(destination, files[i])
      );
    }
  }
  console.log("Backup completed");
} catch (err) {
  console.log(err);
}

// basic http server
import http from "http"
const server = http.createServer((req,res)=>{
    if(req.url == '/'){
        res.end("Welcome to My First Node.js Server");
    }
})
server.listen(3000,()=>{
    console.log("server started....")
})

// route handling http
import http from "http"
const server = http.createServer((req,res)=>{
    if(req.url == '/'){
        res.write("Home Page")
        res.end();
    }
    else if(req.url == '/about'){
        res.write("About Us Page")
        res.end();
    }
    else{
        res.end('404-Page Not Found')
    }
})
server.listen(3000,()=>{
    console.log("server started....")
})

// json response in http
import http from "http"
const server = http.createServer((req, res) => {
  let userdata = {
    name: "John Doe",
    age: 30,
    profession: "Developer"
  }
  if (req.url == "/api/user") {
    res.writeHead(200, { "Content-Type": "application/json" });
    res.end(JSON.stringify(userdata));
  }
  else {
    res.end("404 - Page Not Found");
  }
})
server.listen(3000, () => {
  console.log("server started....")
})
