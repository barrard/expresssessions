var MongoClient = require('mongodb').MongoClient
var url = 'mongodb://localhost:27017/thesessions';
var myFunctions = require('./myfunctions.js')


function handleErrRes(err, r){
	if(err){
		console.log('error '+err)
	}else{
		console.log('no error, got result '+r)
	}
}

function insertIntoMongo(collection, data){
	data.serverTimeStamp = new Date()
	collection.insert(data, function(err, r){
		handleErrRes(err, r)
	})

}

module.exports = {
	writeToMongo:function(collection, data){
		  MongoClient.connect(url, function(err, db) {
		    if (!err){
		    		var col = db.collection(collection)
		    		if (Array.isArray(data)) {
		    			console.log('data is Array')
		    			myFunctions.loopDataArray(data)
		    			insertIntoMongo(col, data)

		    		}else if(typeof data === 'object'){
		    			console.log('data is an object')
		    			myFunctions.loopObj(data)
		    			insertIntoMongo(col, data)
		    		}
		  }else{
		    console.log('Sorry there was an error accessing the DB '+err)
		  }

		  console.log('you did it!!')
		})
	},
	readFromMongo:function(collection, callback){
		cursorArray=[]
		MongoClient.connect(url, function(err, db){
			if(!err){
				var myPostsCollection = db.collection(collection)
				myPostsCollection.find().toArray(function(err, item){
					if (err) {console.log('error reading form mongo '+myPostsCollection.s.name+": "+err)}
					else{
						for(var k in item){
				    	cursorArray.push(item[k])
						// console.log('This is the interation of k in items '+k+' : '+item[k])
						}
						callback(cursorArray)
					}
				})
			}
		})
	},


  sayHelloInEnglish: function() {
    console.log("HELLO");
  },
       
  sayHelloInSpanish: function() {
    console.log("Hola");
  }
};