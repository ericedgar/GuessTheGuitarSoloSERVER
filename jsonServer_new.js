var http = require('http');
var url = require('url');

http.createServer(function (request, response) {
 var jsonObject;
 var jsonPCallbackFunctionName;
 var jsonPReturnString;
 var url;
 var isInitial;
 
 url = request.url;
 console.log("url: " + url);
 isInitial = isInitialDataServiceCall(url);
 console.log("isInitial: " + isInitial); 
 response.writeHead(200, {'Content-Type': 'text/javascript'});
 
 jsonPReturnString = "hello";
 response.write(jsonPReturnString);
 response.end();
 
 
// switch (true){
//   case isInitialDataServiceCall(url):
//     jsonObject = getInitialJson();
//     break;
//   
//   default:
// }
//
// jsonPReturnString = "";
// if (jsonObject){
//  jsonPCallbackFunctionName = getJsonPCallbackFunctionName(url);
//  console.log("jsonPCallbackFunctionName: " + jsonPCallbackFunctionName);
//	jsonPReturnString = getJsonPReturnString(jsonPCallbackFunctionName, jsonObject);
//  console.log("jsonPReturnString: " + jsonPReturnString);
// }
 
//  response.writeHead(200, {'Content-Type': 'text/javascript'});
//  response.write(jsonPReturnString);
//  response.end();
  
 }).listen(9001);

 function isInitialDataServiceCall(url){
   var pathName;
   var isInitial;
   
   isInitial = false;
   pathName = getPathNameFromUrl(url);
   console.log("pathName: " + pathName);
   if(pathName === "/initialData"){
     isInitial = true;
   }
   
   return isInitial;
 }

 function getInitialJson(){
   var initialJson;
   
	 initialJson = {
	   "soloToGuess": "solos/RKJF.mp3",
	   "songs": [{"name":"Master Of puppets", "id": 6001}, {"name":"For Whom the Bell Tolls", "id": 6002}],
	   "artists": 
     [
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
   
   return initialJson;
 }

 function getPathNameFromUrl(url){
   var pathName;
   pathName = url.parse(url).pathname;
   return pathName;
 }

 function getJsonPReturnString(jsonPCallbackFunctionName, jsonObject){
   var jsonPReturnString;
   var jsonString;
   
   jsonString = JSON.stringify(jsonObject);
	 jsonPReturnString = jsonPCallbackFunctionName.concat("(", jsonString, ");");
    
   return jsonPReturnString;
 }

 function getJsonPCallbackFunctionName(url){
   var jsonPCallbackFunctionName;
   var queryData;
   
   jsonPCallbackFunctionName = "";
	 queryData = url.parse(url, true).query;
	 if (queryData.jsoncallback){
	   jsonPCallbackFunctionName = queryData.jsoncallback;
	 }
   
   return jsonPCallbackFunctionName;
 }

 console.log('9001 Server started');