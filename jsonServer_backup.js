var http = require('http');
var url = require('url');

 http.createServer(function (request, response) {
     var jsonObject;
	 var jsonString;
	 var queryData;;

	 
     response.writeHead(200, {'Content-Type': 'text/javascript'});

     if( url.parse(request.url).pathname == '/data' ){
	 
	 queryData = url.parse(request.url, true).query;
	 if (queryData.jsoncallback){
	   console.log(queryData.jsoncallback);
	 }
	 
	 
	 jsonObject = {
	   "soloToGuess": "solos/RKJF.mp3",
	   "songs": [{"name":"Master Of puppets", "id": 6001}, {"name":"For Whom the Bell Tolls", "id": 6002}],
	   "artists": [
  {
    "name": "",
	"id": -1
  },
  {
    "name": "Metallica",
	"id": 5001
  },
  {
    "name": "Redd Kross",
	"id": 5002
  },
  {
    "name": "Judas Priest",
	"id": 5003
  },
  {
    "name": "Motley Crue",
	"id": 5004
  },
  {
    "name": "REO Speedwagon",
	"id": 5005
  },
  {
    "name": "Iron Maiden",
	"id": 5006
  }
]
	};
	 

	  jsonString = JSON.stringify(jsonObject);
	  jsonString = queryData.jsoncallback.concat("(", jsonString, ");");
	  console.log(jsonString);
	  response.write(jsonString);
     }
     else{
         response.write('Hello!');
     }

     response.end();
 }).listen(9001);



 console.log('9001 Server started');