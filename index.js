var requests = require('requests');
const http = require('http');
const fs = require('fs');

const homeFile =fs.readFileSync("index.html","utf-8");
const replaceVal = (tempVal,realVal)=>{
    let temperature = tempVal.replace("{%tempval%}",realVal.main.temp);
    temperature = temperature.replace("{%tempmin%}",realVal.main.temp_min);
    temperature = temperature.replace("{%tempmax%}",realVal.main.temp_max);
    temperature = temperature.replace("{%location%}",realVal.name);
    temperature = temperature.replace("{%country%}",realVal.sys.country);
    temperature = temperature.replace("{%tempstatus%}",realVal.weather[0].main);
    return temperature;
}
const server = http.createServer((req,res)=>{
    if(req.url =="/index"){
        requests('https://api.openweathermap.org/data/2.5/weather?q=Pune&appid=df2ab09d35467adee6d501d21c4a0702')
        .on('data', (chunk) => {
            const objdata = JSON.parse(chunk)
            const arrdata = [objdata]
        const realTime = arrdata.map((val)=>replaceVal(homeFile,val)).join("");
        res.write(realTime);
        // console.log(realTime);
        })
        .on('end', (err)=> {
          if (err) return console.log('connection closed due to errors', err);
        res.end();
        });
    }
});
server.listen(8000,"127.0.0.1");
