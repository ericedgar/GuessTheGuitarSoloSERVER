var http = require('http');
var url = require('url');
var logger = require('nodejslogger');
var azure = require('azure-storage');

var allArtistsArray;
var allSongsArray;
var answerKeyArray;
var sessionData;
var level1AnswerKeyArray;
var level2AnswerKeyArray;
var level3AnswerKeyArray;
var AZURE_STORAGE_CONNECTION_STRING = "DefaultEndpointsProtocol=https;AccountName=guitarsolo;AccountKey=4K62kI2vjVVJxkX4XjeruSyO0Byp4z+9XOB+pc7beGc0nHpW7M1/7h2WbtyO1raDFjhT0VPAQPKDRn2aKcZpgg==;EndpointSuffix=core.windows.net";

sessionData = {};

//http://audio.online-convert.com/convert-to-ogg

allArtistsArray = [
      {"name": "Metallica", "id": 5001},
      {"name": "Redd Kross", "id": 5002},
      {"name": "REO Speedwagon", "id": 5003},
      {"name": "Motley Crue", "id": 5004},
      {"name": "Quiet Riot", "id": 5005},
      {"name": "Santana", "id": 5006},
      {"name": "Slayer", "id": 5007},
      {"name": "Dio", "id": 5008},
      {"name": "Three Doors Down", "id": 5009},
      {"name": "Smashing Pumpkins", "id": 5010},
      {"name": "Warrant", "id": 5011},
      {"name": "Dokken", "id": 5012},
      {"name": "Rainbow", "id": 5013},
      {"name": "Tesla", "id": 5014},
      {"name": "The Donnas", "id": 5015},
      {"name": "The Outfield", "id": 5016},
      {"name": "Jane's Addiction", "id": 5017},
      {"name": "Paramore", "id": 5018},
      {"name": "Judas Priest", "id": 5019},
      {"name": "Cold", "id": 5020},
      {"name": "The All American Rejects", "id": 5021},
      {"name": "Kiss", "id": 5022},
      {"name": "Weezer", "id": 5023},
      {"name": "Nirvana", "id": 5024},
      {"name": "Faith No More", "id": 5025},
      {"name": "Social Distortion", "id": 5026},
      {"name": "Default", "id": 5027},
      {"name": "Elvis Presley", "id": 5028},
      {"name": "Buddy Holly", "id": 5029},
      {"name": "Pat Benatar", "id": 5030},
      {"name": "Fleetwood Mac", "id": 5031},
      {"name": "Iron Maiden", "id": 5032},
      {"name": "Suede", "id": 5033},
      {"name": "Green Day", "id": 5034},
      {"name": "Grand Funk Railroad", "id": 5035},
      {"name": "Vinnie Vincent Invasion", "id": 5036},
      {"name": "Motorhead", "id": 5037},
      {"name": "Twisted Sister", "id": 5038},
      {"name": "Mark Chestnutt", "id": 5039},
      {"name": "Kix", "id": 5040},
      {"name": "Lynyrd Skynyrd", "id": 5041},
      {"name": "Pink Floyd", "id": 5042},
      {"name": "The Cult", "id": 5043},
      {"name": "Ozzy Osbourne", "id": 5044},
      {"name": "Chuck Berry", "id": 5045},
      {"name": "Rush", "id": 5046},
      {"name": "Jimi Hendrix", "id": 5047},
      {"name": "Van Halen", "id": 5048}
     ];
  allArtistsArray.sort(function(a, b) {
    if (a.name < b.name) {
      return -1;
    }
    return 1;
    });

    // <input type="checkbox" id="rock" value="1" checked /><label for="rock">Rock</label>
    // <input type="checkbox" id="metal" value="2" checked /><label for="metal">Metal</label>
    // <input type="checkbox" id="classic" value="3" checked /><label for="classic">Classic</label>
    // <input type="checkbox" id="country" value="4" checked /><label for="country">Country</label>

allSongsArray = [
      {"name":"Master Of Puppets", "id": 6001, "artistId": 5001, "level": 1, "genre": 2},
      {"name":"Jimmy's Fantasy", "id": 6002, "artistId": 5002, "level": 3, "genre": 1},
      {"name":"Follow My Heart", "id": 6003, "artistId": 5003, "level": 2, "genre": 3}, 
      {"name":"Out Of Season", "id": 6004, "artistId": 5003, "level": 2, "genre": 3}, 
      {"name":"Looks That Kill", "id": 6005, "artistId": 5004, "level": 1, "genre": 2},
      {"name":"Metal Health", "id": 6006, "artistId": 5005, "level": 2, "genre": 2},
      {"name":"Let's Get Crazy", "id": 6007, "artistId": 5005, "level": 3, "genre": 2},
      {"name":"Open Invitation", "id": 6008, "artistId": 5006, "level": 1, "genre": 3},
      {"name":"Die By The Sword", "id": 6009, "artistId": 5007, "level": 2, "genre": 2},
      {"name":"Shout At The Devil", "id": 6010, "artistId": 5004, "level": 1, "genre": 2},
      {"name":"Rainbow In The Dark", "id": 6011, "artistId": 5008, "level": 1, "genre": 2},
      {"name":"Kryptonite", "id": 6012, "artistId": 5009, "level": 1, "genre": 1},
      {"name":"I Am One", "id": 6013, "artistId": 5010, "level": 2, "genre": 1},
      {"name":"Cherry Pie", "id": 6014, "artistId": 5011, "level": 1, "genre": 2},
      {"name":"Down Boys", "id": 6015, "artistId": 5011, "level": 1, "genre": 2},
      {"name":"Breaking The Chains", "id": 6016, "artistId": 5012, "level": 2, "genre": 1},
      {"name":"Since You've Been Gone", "id": 6017, "artistId": 5013, "level": 1, "genre": 3},
      {"name":"Modern Day Cowboy", "id": 6018, "artistId": 5014, "level": 1, "genre": 1},
      {"name":"Take It Off", "id": 6019, "artistId": 5015, "level": 2, "genre": 1},
      {"name":"Say It Isn't So", "id": 6020, "artistId": 5016, "level": 1, "genre": 1},
      {"name":"Your Love", "id": 6021, "artistId": 5016, "level": 1, "genre": 1},
      {"name":"Ain't No Right", "id": 6022, "artistId": 5017, "level": 2, "genre": 1},
      {"name":"Misery Business", "id": 6023, "artistId": 5018, "level": 2, "genre": 1},
      {"name":"The Ripper", "id": 6024, "artistId": 5019, "level": 1, "genre": 2},
      {"name":"Remedy", "id": 6025, "artistId": 5020, "level": 2, "genre": 1},
      {"name":"Swing, Swing", "id": 6026, "artistId": 5021, "level": 1, "genre": 1},
      {"name":"Nothin' To Lose", "id": 6027, "artistId": 5022, "level": 2, "genre": 3},
      {"name":"Crab", "id": 6028, "artistId": 5023, "level": 3, "genre": 1},
      {"name":"Heart Shaped Box", "id": 6029, "artistId": 5024, "level": 1, "genre": 1},
      {"name":"Surprise You're Dead", "id": 6030, "artistId": 5025, "level": 3, "genre": 1},
      {"name":"Bad Luck", "id": 6031, "artistId": 5026, "level": 2, "genre": 1},
      {"name":"It Only Hurts", "id": 6032, "artistId": 5027, "level": 2, "genre": 1},
      {"name":"Jailhouse Rock", "id": 6033, "artistId": 5028, "level": 1, "genre": 4},
      {"name":"Ain't Nothin' But A Hound Dog", "id": 6034, "artistId": 5028, "level": 1, "genre": 4},
      {"name":"Peggy Sue", "id": 6035, "artistId": 5029, "level": 1, "genre": 4},
      {"name":"Heartbreaker", "id": 6036, "artistId": 5030, "level": 1, "genre": 3},
      {"name":"Second Hand News", "id": 6037, "artistId": 5031, "level": 2, "genre": 3},
      {"name":"Powerslave", "id": 6038, "artistId": 5032, "level": 2, "genre": 2},
      {"name":"Big Cheese", "id": 6039, "artistId": 5024, "level": 3, "genre": 1},
      {"name":"Moving", "id": 6040, "artistId": 5033, "level": 3, "genre": 1},
      {"name":"Motorbreath", "id": 6041, "artistId": 5001, "level": 2, "genre": 2},
      {"name":"American Idiot", "id": 6042, "artistId": 5034, "level": 1, "genre": 1}, 
      {"name":"We're An American Band", "id": 6043, "artistId": 5035, "level": 1, "genre": 3},
      {"name":"Boyz are Gonna Rock", "id": 6044, "artistId": 5036, "level": 2, "genre": 2},
      {"name":"Ace Of Spades", "id": 6045, "artistId": 5037, "level": 1, "genre": 1},
      {"name":"Were Not Gonna Take It", "id": 6046, "artistId": 5038, "level": 1, "genre": 2},
      {"name":"Breed", "id": 6047, "artistId": 5024, "level": 2, "genre": 1},
      {"name":"Siva", "id": 6048, "artistId": 5010, "level": 2, "genre": 1},
      {"name":"Sure Is Monday", "id": 6049, "artistId": 5039, "level": 3, "genre": 5},
      {"name":"Cold Blood", "id": 6050, "artistId": 5040, "level": 2, "genre": 1},
      {"name":"Free Bird", "id": 6051, "artistId": 5041, "level": 1, "genre": 3},
      {"name":"Comfortably Numb", "id": 6052, "artistId": 5042, "level": 1, "genre": 3},
      {"name":"Wild Flower", "id": 6053, "artistId": 5043, "level": 1, "genre": 1},
      {"name":"Lil Devil", "id": 6054, "artistId": 5043, "level": 2, "genre": 1},
      {"name":"Crazy Train", "id": 6055, "artistId": 5044, "level": 1, "genre": 3},
      {"name":"Enter Sandman", "id": 6056, "artistId": 5001, "level": 1, "genre": 2},
      {"name":"Johnny B Goode", "id": 6057, "artistId": 5045, "level": 1, "genre": 4},
      {"name":"Freewill", "id": 6058, "artistId": 5046, "level": 1, "genre": 3},
      {"name":"Purple Haze", "id": 6059, "artistId": 5047, "level": 1, "genre": 3},
      {"name":"Running With The Devil", "id": 6060, "artistId": 5048, "level": 1, "genre": 3},
      {"name":"You Really Got Me", "id": 6061, "artistId": 5048, "level": 1, "genre": 3}
     ];

answerKeyArray = [
       {"soloToGuessId": 16400, "artistId": 5003, "songId": 6003}, //reo fmh
       {"soloToGuessId": 16401, "artistId": 5001, "songId": 6001}, //met mast
       {"soloToGuessId": 16402, "artistId": 5002, "songId": 6002}, //rk jimmy
       {"soloToGuessId": 16403, "artistId": 5003, "songId": 6004}, //reo out of s
       {"soloToGuessId": 16404, "artistId": 5004, "songId": 6005},  //motley looks  
       {"soloToGuessId": 16405, "artistId": 5005, "songId": 6006},  //quiet riot MH
       {"soloToGuessId": 16406, "artistId": 5005, "songId": 6007},  //quiet riot Lets get crazy
       {"soloToGuessId": 16407, "artistId": 5006, "songId": 6008},  //santana OI
       {"soloToGuessId": 16408, "artistId": 5007, "songId": 6009},  //slayer dbs
       {"soloToGuessId": 16409, "artistId": 5004, "songId": 6010},  //motley SAD
       {"soloToGuessId": 16410, "artistId": 5008, "songId": 6011},  //dio rainbow
       {"soloToGuessId": 16411, "artistId": 5009, "songId": 6012},   //3 drs down kryp
       {"soloToGuessId": 16412, "artistId": 5010, "songId": 6013},   //Smash i am 1
       {"soloToGuessId": 16413, "artistId": 5011, "songId": 6014},   //warrant cherry
       {"soloToGuessId": 16414, "artistId": 5011, "songId": 6015},   //warrant down
       {"soloToGuessId": 16415, "artistId": 5012, "songId": 6016},   //dokken break
       {"soloToGuessId": 16416, "artistId": 5013, "songId": 6017},   //rainbow since
       {"soloToGuessId": 16417, "artistId": 5014, "songId": 6018},   //tesla cowboy
       {"soloToGuessId": 16418, "artistId": 5015, "songId": 6019},    //donnas take it off
       {"soloToGuessId": 16419, "artistId": 5016, "songId": 6020},    //outfield say it isnt so
       {"soloToGuessId": 16420, "artistId": 5016, "songId": 6021},    //outfield your love
       {"soloToGuessId": 16421, "artistId": 5017, "songId": 6022},    //Janes aint no right
       {"soloToGuessId": 16422, "artistId": 5018, "songId": 6023},    //Paramore Misery
       {"soloToGuessId": 16423, "artistId": 5019, "songId": 6024},    //Judas ripper
       {"soloToGuessId": 16424, "artistId": 5020, "songId": 6025},  //Cold Remedy
       {"soloToGuessId": 16425, "artistId": 5021, "songId": 6026},  //All Amer swing
       {"soloToGuessId": 16426, "artistId": 5022, "songId": 6027},   //Kiss Nothin to lose
       {"soloToGuessId": 16427, "artistId": 5023, "songId": 6028},  //Weezer Crab
       {"soloToGuessId": 16428, "artistId": 5024, "songId": 6029},   //Nirvana heart
       {"soloToGuessId": 16429, "artistId": 5025, "songId": 6030},  //Faith surprise
       {"soloToGuessId": 16430, "artistId": 5026, "songId": 6031},  //Social bad
       {"soloToGuessId": 16431, "artistId": 5027, "songId": 6032},  //Default it only hurts
       {"soloToGuessId": 16432, "artistId": 5028, "songId": 6033},  //Elvis jail
       {"soloToGuessId": 16433, "artistId": 5028, "songId": 6034},  //Elvis hound
       {"soloToGuessId": 16434, "artistId": 5029, "songId": 6035},  //Buddy Peggy
       {"soloToGuessId": 16435, "artistId": 5030, "songId": 6036},   //Pat Benatar - Heartbreaker
       {"soloToGuessId": 16436, "artistId": 5031, "songId": 6037},  //Fleetwood Mac - Second Hand News
       {"soloToGuessId": 16437, "artistId": 5032, "songId": 6038},   //Iron Maiden - Powerslave
       {"soloToGuessId": 16438, "artistId": 5024, "songId": 6039},   //Nirvana - Big Cheese
       {"soloToGuessId": 16439, "artistId": 5033, "songId": 6040},    //Suede - Moving
       {"soloToGuessId": 16440, "artistId": 5001, "songId": 6041},   //Metallica - Motorbreath
       {"soloToGuessId": 16441, "artistId": 5034, "songId": 6042}, //Green Day American Idiot 
       {"soloToGuessId": 16442, "artistId": 5035, "songId": 6043}, //Grand Funk Railroad We're An American Band
       {"soloToGuessId": 16443, "artistId": 5036, "songId": 6044}, //Vinnie Boyz are Gonna Rock
       {"soloToGuessId": 16444, "artistId": 5037, "songId": 6045}, //Motorhead Ace Of Spades
       {"soloToGuessId": 16445, "artistId": 5038, "songId": 6046}, //Twisted Sister Were Not Gonna Take It
       {"soloToGuessId": 16446, "artistId": 5024, "songId": 6047}, //Nirvana Breed
       {"soloToGuessId": 16447, "artistId": 5010, "songId": 6048}, //Smashing Pumpkins Siva
       {"soloToGuessId": 16448, "artistId": 5039, "songId": 6049},  //Mark Chestnutt Sure Is Monday
       {"soloToGuessId": 16449, "artistId": 5040, "songId": 6050},
       {"soloToGuessId": 16450, "artistId": 5041, "songId": 6051},  //Lynyrd Skynyrd Free Bird
       {"soloToGuessId": 16451, "artistId": 5042, "songId": 6052},  //Pink Floyd Comfortably Numb
       {"soloToGuessId": 16452, "artistId": 5043, "songId": 6053},  //The Cult Wild Flower
       {"soloToGuessId": 16453, "artistId": 5043, "songId": 6054},  //The Cult Lil Devil
       {"soloToGuessId": 16454, "artistId": 5044, "songId": 6055},  //Ozzy Crazy Train
       {"soloToGuessId": 16455, "artistId": 5001, "songId": 6056},   //Metallica Enter Sandman
       {"soloToGuessId": 16456, "artistId": 5045, "songId": 6057},   //Chuck Berry Johnny B Goode
       {"soloToGuessId": 16457, "artistId": 5046, "songId": 6058},   //Rush Freewill
       {"soloToGuessId": 16458, "artistId": 5047, "songId": 6059},   //Jimi Hendrix Purple Haze
       {"soloToGuessId": 16459, "artistId": 5048, "songId": 6060},   //Van Halen Running with the devil
       {"soloToGuessId": 16460, "artistId": 5048, "songId": 6061}   //Van Halen You Really Got me
     ];

http.createServer(function (request, response) {
 var jsonObject;
 var jsonPCallbackFunctionName;
 var jsonPReturnString;
 var requestUrl;
 var pathName;
 var isInitial;
 var isGetSongs;
 var isGuess;
 var blobSvc;
 
 //logger.init({"file":"output-file.txt", "mode":"DIE"});

 var highScoreObject;
 var highScoreArray;
 var highScoreJSON;

 highScoreObject = {
  "rank": 1, 
  "name": "EME", 
  "score": 145,
  "difficulty": 2
};

highScoreArray = [];
highScoreArray.push(highScoreObject);
highScoreJSON = JSON.stringify(highScoreArray);

console.log('highScoreJSON:' + highScoreJSON);

try {
  var containerName = "highscore";
  var blobName = "scores";
  //blobSvc = azure.createBlobService(AZURE_STORAGE_CONNECTION_STRING);

  //console.log('create blobSvc:' + blobSvc);

  // blobSvc.createBlockBlobFromText(containerName, blobName, highScoreJSON, function errorBlob(error, result, response) {
  //   var err;
  //   err = error;

  //   console.log('createBlockBlobFromText error :' + err.message);

  // });


  // blobSvc.listBlobsSegmented('mycontainer', null, function(error, result, response){
  //   if(!error){
  //       // result.entries contains the entries
  //       // If not all blobs were returned, result.continuationToken has the continuation token.
  //   }
  // });

  // blobSvc.getBlobToText(
  //   containerName,
  //   blobName,
  //   function(err, blobContent, blob) {
  //       if (err) {
  //           console.error("Couldn't download blob %s", blobName);
  //           console.error(err);
  //       } else {
  //           console.log("Sucessfully downloaded blob %s", blobName);
  //           console.log(blobContent);
  //       }
  //   });

} catch(err) {
  console.log('create blobSvc error :' + err.message);
}
 
 initializeAnswerKeyArrays();
 requestUrl = request.url;
 pathName = getPathNameFromUrl(requestUrl);
 isInitial = isInitialDataServiceCall(pathName);
 isGetSongs = isGetSongsByArtistServiceCall(pathName);
 isGuess = isGuessSongServiceCall(pathName);
 
 switch (true){
   case isInitial === true:
     jsonObject = getInitialJson(requestUrl);
     break;
   case isGetSongs === true:
     //console.log('getSongsByArtist');
     jsonObject = getSongsByArtistJson(requestUrl);
     break;
   case isGuess === true:
     jsonObject = getGuessSongJson(requestUrl);
     break;
   default:
 }

//console.log('isInitial:' + String(isInitial));
//console.log('isGetSongs:' + String(isGetSongs));
//console.log('isGuess:' + String(isGuess));

 jsonPReturnString = "";
 if (jsonObject){
  jsonPCallbackFunctionName = getJsonPCallbackFunctionName(requestUrl);
  jsonPReturnString = getJsonPReturnString(jsonPCallbackFunctionName, jsonObject);
 }
 
  response.writeHead(200, {'Content-Type': 'text/javascript'});
  response.write(jsonPReturnString);
  response.end();
  
 }).listen(9001);

 function initializeAnswerKeyArrays(){
    if (isArray(level1AnswerKeyArray)){
    }else{
      level1AnswerKeyArray = [];
      initializeAnswerKeyArray(level1AnswerKeyArray, 1);
      logger.debug('level1AnswerKeyArray length:' + String(level1AnswerKeyArray.length));
    }
    
    if (isArray(level2AnswerKeyArray)){
    }else{
      level2AnswerKeyArray = [];
      initializeAnswerKeyArray(level2AnswerKeyArray, 2);
      logger.debug('level2AnswerKeyArray length:' + String(level2AnswerKeyArray.length));
    }
    
    if (isArray(level3AnswerKeyArray)){
    }else{
      level3AnswerKeyArray = [];
      initializeAnswerKeyArray(level3AnswerKeyArray, 3);
      logger.debug('level3AnswerKeyArray length:' + String(level3AnswerKeyArray.length));
    }
 }

 function initializeAnswerKeyArray(arrayToInitialize, level){
   var index;
   var songObject;
   var answerObject;
   var artistId;
   var songId;
   var levelAnswerObject;
             
   for(index in allSongsArray) {
     songObject = allSongsArray[index];
     if (songObject.level === level) {
       artistId = songObject.artistId;
       songId = songObject.id; 
       // logger.debug('artistId: ' + artistId);
       // logger.debug('songId: ' + songId);
       answerObject = getAnswerObjectFromArtistAndSong(artistId, songId);
       if (answerObject){
         levelAnswerObject = {
           "soloToGuessId": answerObject.soloToGuessId, 
           "artistId": artistId, 
           "songId": songId,
           "name": songObject.name,
           "level": songObject.level 
         };
         
         if (level === 1){
           console.log('soloToGuessId:' + String(levelAnswerObject.soloToGuessId));
           console.log('artistId:' + String(levelAnswerObject.artistId));
           console.log('songId:' + String(levelAnswerObject.songId));
           console.log('name:' + String(levelAnswerObject.name));
           console.log('level:' + String(levelAnswerObject.level));
           console.log('-------------------------');
         }
         
         arrayToInitialize.push(levelAnswerObject);         
       }
     }
   }
 }

 function isInitialDataServiceCall(pathName){
   var isInitial;
   
   isInitial = false;
   if(pathName === "/initialData"){
     isInitial = true;
   }
   
   return isInitial;
 }

function isGetSongsByArtistServiceCall(pathName){
  var isGetSongs;
  
  isGetSongs = false;
  if(pathName === "/getSongsByArtist"){
    isGetSongs = true;
    //console.log("");
  }
  
  return isGetSongs;
}

function isGuessSongServiceCall(pathName){
  var isGetSongs;
  
  isGetSongs = false;
  if(pathName === "/guessSong"){
    isGetSongs = true;
  }
  
  return isGetSongs;
}

 function getInitialJson(requestUrl){
   var initialJson;
   var allArtistsJsonObjectWithBlank;
   var allArtistsJsonObject;
   var soloToGuessId;
   var sessionId;
   var queryData;
   var previousSoloToGuessIds;
   var soloToGuessArtistAndSong;
   var level;
   
   queryData = url.parse(requestUrl, true).query;
   if (queryData.sessionId) {
     sessionId = queryData.sessionId;
     //console.log('sessionId:' + sessionId);
     if (sessionData){
       
     }else{
       sessionData = {};
       sessionData[sessionId] = [];
     }
 
     previousSoloToGuessIds = sessionData[sessionId];
     if (previousSoloToGuessIds){
       //console.log('01 previousSoloToGuessIds length:' + String(previousSoloToGuessIds.length));       
      //soloToGuessArtistAndSong = getArtistAndSongDescriptionBySoloToGuessId(soloToGuessId);
      //console.log('previousSoloToGuessArtistAndSong:' + soloToGuessArtistAndSong);

     } else {
       previousSoloToGuessIds = [];
       sessionData[sessionId] = previousSoloToGuessIds;
       //console.log('01 previousSoloToGuessIds length: undefined');
     }

   }
   
   var allArtistsAndAllSongsArray;
   allArtistsAndAllSongsArray = mergeAllArtistsAndAllSongs();

   allArtistsJsonObject = {
     "artists": allArtistsArray,
     "artistsAndSongs": allArtistsAndAllSongsArray
    };

   if (isNumber(queryData.level)) {
     level = Number(queryData.level);  
   } else {
     level = 1;
   }

   //console.log('level:' + String(level));

   soloToGuessId = getUnUsedSoloToGuessId(previousSoloToGuessIds, sessionId, level);
   
   //console.log('soloToGuessId: ' + soloToGuessId);
    
   allArtistsJsonObjectWithBlank = addBlank(allArtistsJsonObject, "artists");
   initialJson = allArtistsJsonObjectWithBlank;
   initialJson.soloToGuessId = soloToGuessId;
   initialJson.soloToGuessFile = "solos/" + String(soloToGuessId);
   
   //todo: remove after debugging
   soloToGuessArtistAndSong = getArtistAndSongDescriptionBySoloToGuessId(soloToGuessId);
   //console.log('soloToGuessArtistAndSong: ' + soloToGuessArtistAndSong);
   initialJson.soloToGuessArtistAndSong = soloToGuessArtistAndSong;
   
   //console.log('02 previousSoloToGuessIds length:' + String(previousSoloToGuessIds.length));
   
   return initialJson;
 }

 function getArtistAndSongDescriptionBySoloToGuessId(soloToGuessId){
  var answerObject;
   var songObject;
   var artistObject;
   var soloToGuessArtistAndSong;
   
   answerObject = getAnswerObjectFromSoloToGuessId(soloToGuessId);
   if (answerObject){
     artistObject = getArtistObjectByArtistId(answerObject.artistId);
     songObject = getSongObjectBySongId(answerObject.songId);
     soloToGuessArtistAndSong = getArtistAndSongDescription(answerObject.artistId, answerObject.songId);
   }
   
   return soloToGuessArtistAndSong;
 }

 function getArtistAndSongDescription(artistId, songId){
   var artistObject;
   var songObject;
   var soloToGuessArtistAndSong;

   artistObject = getArtistObjectByArtistId(artistId);
   songObject = getSongObjectBySongId(songId);
   soloToGuessArtistAndSong = artistObject.name + ' - ' + songObject.name;

   return soloToGuessArtistAndSong;
 }

 function getUnUsedSoloToGuessId(previousSoloToGuessIds, sessionId, level){
   var unUsedSoloToGuessId;
   var soloToGuessId;
   var hasBeenUsed;
   var previousSoloToGuessIdsLength;
   var answerKeyLength;
   var index;
   var previousSoloIndex;

   soloToGuessId = getRandomSoloToGuessId(level);
   //logger.debug('getRandomSoloToGuessId.soloToGuessId' + soloToGuessId);
   
   if (previousSoloToGuessIds){
     previousSoloToGuessIdsLength = previousSoloToGuessIds.length;
     answerKeyLength = getAnswerKeyLength(level);
     console.log('previousSoloToGuessIdsLength: ' + previousSoloToGuessIdsLength + ' - answerKeyLength: ' + answerKeyLength);
     if (previousSoloToGuessIdsLength >= answerKeyLength){
       //console.log('previousSoloToGuessIdsLength: ' + previousSoloToGuessIdsLength + ' - answerKeyLength: ' + answerKeyLength);
       unUsedSoloToGuessId = soloToGuessId;
       previousSoloToGuessIds = [];
       previousSoloToGuessIds.push(unUsedSoloToGuessId);
       sessionData[sessionId] = previousSoloToGuessIds;
       previousSoloToGuessIdsLength = previousSoloToGuessIds.length;
       console.log('previousSoloToGuessIdsLength: ' + previousSoloToGuessIdsLength + ' - answerKeyLength: ' + answerKeyLength);
     } else {
       for (index = 0; index < answerKeyLength; index++) {
         hasBeenUsed = hasSoloToGuessBeenUsed(previousSoloToGuessIds, soloToGuessId);
         console.log('hasBeenUsed: ' + hasBeenUsed + ' - soloToGuessId: ' + soloToGuessId);
         if (hasBeenUsed === true) {
           soloToGuessId = getRandomSoloToGuessId(level);
         } else {
           unUsedSoloToGuessId = soloToGuessId;
           previousSoloIndex = previousSoloToGuessIds.indexOf(unUsedSoloToGuessId);
           if (previousSoloIndex === -1) {
            previousSoloToGuessIds.push(unUsedSoloToGuessId);
           } else {
             console.log('already exists in previousSoloToGuessIds - unUsedSoloToGuessId: ' + unUsedSoloToGuessId + ' previousSoloIndex:' + previousSoloIndex + ' previousSoloToGuessIdsLength: ' + previousSoloToGuessIds.length);
           }
           
           break;
         }
       }
     }
     
   } else {
     unUsedSoloToGuessId = soloToGuessId;
   }
   
   if (unUsedSoloToGuessId){
   }else{
     unUsedSoloToGuessId = soloToGuessId;
   }
   return unUsedSoloToGuessId;
 }

 function getRandomSoloToGuessId(level){
   var randomSoloToGuessIndex;
   var soloToGuessId;
   var answerKeyByLevel;
         
   randomSoloToGuessIndex = getRandomNumber(level);
   //console.log('randomSoloToGuessIndex: ' + randomSoloToGuessIndex);
   answerKeyByLevel = getAnswerKeyArrayByLevel(level);
   //console.log('----answerKeyByLevel.length: ' + answerKeyByLevel.length);
   if (answerKeyByLevel){
     if (answerKeyByLevel[randomSoloToGuessIndex]){
       soloToGuessId = answerKeyByLevel[randomSoloToGuessIndex].soloToGuessId;  
     }
   }
   
   return soloToGuessId;
 }

 function getAnswerKeyLength(level){
   var length;
   var answerKeyByLevel;
   
   answerKeyByLevel = getAnswerKeyArrayByLevel(level);
   length = answerKeyByLevel.length;
   
   return length;
 }

 function hasSoloToGuessBeenUsed(previousSoloToGuessIds, soloToGuessId){
   var hasBeenUsed;
   var index;
   var soloId;

   //console.log('previousSoloToGuessIds: ' + previousSoloToGuessIds);
   //console.log('soloToGuessId: ' + soloToGuessId);

   hasBeenUsed = false;   
   if (previousSoloToGuessIds){
     for(index = 0; index <  previousSoloToGuessIds.length; index++) {
       soloId = previousSoloToGuessIds[index];
       if (soloId === soloToGuessId) {
         hasBeenUsed = true;
         break;
       }
     }     
   }
   
   return hasBeenUsed;
 }

 function getSongsByArtistJson(requestUrl){
   var queryData;
   var artistId;
   var songsJson;
   
   songsJson = {};
   queryData = url.parse(requestUrl, true).query;
   
   if (isNumber(queryData.artistId)) {
     artistId = Number(queryData.artistId);  
   }
    
   if (artistId) {
     
     songsJson = {
       "songs": []
     };
     
     songsJson.songs = getSongObjectArrayByArtistId(artistId);
   }
   
   if (songsJson.songs) {
     //console.log('songsJson.songs length: ' + songsJson.songs.length);
     songsJson = addBlank(songsJson, "songs");  
   }else{
     //console.log('songsJson.songs: ' + songsJson.songs);
   }
   
   return songsJson;
 }

 function getGuessSongJson(requestUrl){
   var queryData;
   var soloToGuessId;
   var artistId;
   var songId;
   var guessSongJson;
   var isCorrectReturnValue;
   var isCorrect;
   var isPartiallyCorrect;
   
   guessSongJson = {
     "result": 1
   };
   
   queryData = url.parse(requestUrl, true).query;
   if (isNumber(queryData.soloToGuessId)) {
     soloToGuessId = Number(queryData.soloToGuessId);  
   }
   
   if (isNumber(queryData.artistId)) {
     artistId = Number(queryData.artistId);     
   }
   
   if (isNumber(queryData.songId)) {
     songId = Number(queryData.songId);  
   }
   
   isCorrectReturnValue = isCorrectGuess(soloToGuessId, artistId, songId);
   isCorrect = isCorrectReturnValue.isCorrect;
   isPartiallyCorrect = isCorrectReturnValue.isPartiallyCorrect;
   if (isCorrect === true) {
     guessSongJson.result = 0; //success
   } else {
     if (isPartiallyCorrect === true) {
       guessSongJson.result = -1; //partial
     }
   }
   
  guessSongJson.artistId = artistId;
  guessSongJson.songId = songId;
  var artistAndSongDescription;
  artistAndSongDescription = getArtistAndSongDescription(artistId, songId);
  guessSongJson.artistAndSongDescription = artistAndSongDescription;

   return guessSongJson;
 }

 function getPathNameFromUrl(requestUrl){
   var pathName;
   pathName = url.parse(requestUrl).pathname;
   return pathName;
 }

 function getJsonPReturnString(jsonPCallbackFunctionName, jsonObject){
   var jsonPReturnString;
   var jsonString;
   
   jsonString = JSON.stringify(jsonObject);
	 jsonPReturnString = jsonPCallbackFunctionName.concat("(", jsonString, ");");
    
   return jsonPReturnString;
 }

 function getJsonPCallbackFunctionName(requestUrl){
   var jsonPCallbackFunctionName;
   var queryData;
   
   jsonPCallbackFunctionName = "";
	 queryData = url.parse(requestUrl, true).query;
	 if (queryData.jsoncallback){
	   jsonPCallbackFunctionName = queryData.jsoncallback;
	 }
   
   return jsonPCallbackFunctionName;
 }

 function addBlank(jsonObject, propertyName) {
   var blankJson;
  
   blankJson = {"name":"", "id": -1};
   if (propertyName === "songs") {
     blankJson.artistId = -1;
   }
   
   if (jsonObject[propertyName].length > 0) {
     if (jsonObject[propertyName][0].id === -1) {
       //blank already added
     } else {
       jsonObject[propertyName].splice(0, 0, blankJson);       
     }
   }

   return jsonObject;
 }
 
 function isCorrectGuess(soloToGuessId, artistId, songId) {
   var isCorrect;
   var isPartiallyCorrect;
   var answerObject;
   var returnValues;
   
   isCorrect = false;
   isPartiallyCorrect = false;
   answerObject = getAnswerObjectFromSoloToGuessId(soloToGuessId);
   if (answerObject) {
     
     if (artistId === answerObject.artistId) {
       isPartiallyCorrect = true;
       if (songId === answerObject.songId) {
         isCorrect = true;
       }       
     } else { 
       //it is a rare possibility to select the wrong artist, but the correct song
       if (songId === answerObject.songId) {
         isPartiallyCorrect = true;
       }
     }
   }
   
  //console.log('isCorrect: ' + String(isCorrect));
  //console.log('isPartiallyCorrect: ' + String(isPartiallyCorrect));
   returnValues = {
     isCorrect: isCorrect,
     isPartiallyCorrect: isPartiallyCorrect 
   };
   
   return returnValues;
 }
 
 function getAnswerObjectFromSoloToGuessId(soloToGuessId) {
   var index;
   var answerObject;
   var answerFound;
   
   logger.debug('soloToGuessId: ' + soloToGuessId);
   
   answerObject = null;
   answerFound = false;
   for(index = 0; index <  answerKeyArray.length; index++) {
     answerObject = answerKeyArray[index];
     if (soloToGuessId === answerObject.soloToGuessId) {
       answerFound = true;
       break;
     }
   }
   
   if (answerFound === true){
   }else{
     answerObject = null;
   }
   
   return answerObject;
 }
 
 function getAnswerObjectFromArtistAndSong(artistId, songId) {
   var index;
   var answerObject;
   var answerFound;
   
   answerObject = null;
   answerFound = false;
   for(index = 0; index <  answerKeyArray.length; index++) {
     answerObject = answerKeyArray[index];
     if (artistId === answerObject.artistId && songId === answerObject.songId) {
       answerFound = true;
       logger.debug('answerFound: ' + String(answerFound));
       break;
     }
   }
   
   if (answerFound === true){
   }else{
     answerObject = null;
   }   
   
   return answerObject;
 }
 
 function getSongObjectArrayByArtistId(artistId){
   var index;
   var songObject;
   var songObjectArray;
             
   songObjectArray = [];
   for(index in allSongsArray) {
     songObject = allSongsArray[index];
     if (songObject.artistId === artistId) {
       songObjectArray.push(songObject);
     }
   }
   
  songObjectArray.sort(function(a, b) {
    if (a.name < b.name) {
      return -1;
    }
    return 1;
    });
   
   return songObjectArray;
 }
     
 function getSongObjectBySongId(songId){
   var index;
   var songObject;
            
   songObject = null;
   for(index in allSongsArray) {
     songObject = allSongsArray[index];
     if (songObject.id === songId) {
       break;
     }
   }
   return songObject;
 }

 function mergeAllArtistsAndAllSongs() {
  var index;
  var songIndex;
  var artistObject;
  var artistId;
  var songObjectArray; 
  var songObject;
  var allArtistsAndAllSongObject;
  var allArtistsAndAllSongsArray;
  
  allArtistsAndAllSongsArray = [];
  for(index in allArtistsArray) {
    artistObject = allArtistsArray[index];
    //{"name": "Metallica", "id": 5001},
    artistId = artistObject.id;
    songObjectArray = getSongObjectArrayByArtistId(artistId);
    for(songIndex in songObjectArray) {
      songObject = songObjectArray[songIndex];
      //{"name":"Master Of Puppets", "id": 6001, "artistId": 5001, "level": 1}
      allArtistsAndAllSongObject = {
        "artistName": artistObject.name,
        "artistId": artistId,
        "songName": songObject.name,
        "songId": songObject.id,
        "level": songObject.level,
        "key": String(artistId) + "|" + songObject.id,
        "isChecked": false,
        "genre": songObject.genre,
        "imageUrl": "dist/images/" + String(artistId) + ".png"
      };

      allArtistsAndAllSongsArray.push(allArtistsAndAllSongObject);
    }
  }
  return allArtistsAndAllSongsArray;
 }

 function getArtistObjectByArtistId(artistId){
   var index;
   var artistObject;
             
   artistObject = null;
   for(index in allArtistsArray) {
     artistObject = allArtistsArray[index];
     if (artistObject.id === artistId) {
       break;
     }
   }
   return artistObject;
 }
 
 function isNumber (valueToCheck) {
   var isNbr;
   
   isNbr = false;
   if (valueToCheck === null || valueToCheck === undefined || valueToCheck === "" || valueToCheck === false) {
   } else {
     if (isNaN(valueToCheck - 0)) {
     } else {
       isNbr = true;
     }
   }
   
   return isNbr;
 }
 
 function getRandomNumber(level) {
   var randomNumber;
   var minNumber;
   var maxNumber;
   var answerKeyByLevel;
   
   minNumber = 0;
   answerKeyByLevel = getAnswerKeyArrayByLevel(level);
   if (answerKeyByLevel){
     maxNumber = answerKeyByLevel.length - 1;
     logger.debug('maxNumber:' + String(maxNumber));
     randomNumber = Math.floor(Math.random() * (maxNumber - minNumber + 1)) + minNumber;     
   }

   return randomNumber;
 }
 
 function getAnswerKeyArrayByLevel(level){
  var returnValue;
  
  logger.debug('level: ' + String(level));
  
  switch (level){
    case 1:
      returnValue = level1AnswerKeyArray;
      break;
    case 2:
      returnValue = level2AnswerKeyArray;
      break;
    case 3:
      returnValue = level3AnswerKeyArray;
      break;
    default:
  }
  return returnValue;
 }
 
 function isArray(object) {
   var returnValue;
    if (object instanceof Array) {
      returnValue = true;
    } else{
      returnValue = false;
    }
    
    return returnValue
 }
 
 console.log('9001 Server started');