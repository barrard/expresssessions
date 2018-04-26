module.exports = {

	verifyUserLogedIn:function(req, res){
		console.log('userSession.loggedIn')
		console.log(req.session.loggedIn)
		if(!req.session.loggedIn) {
		res.redirect('/')
		}else{
			return true
		}
	},
	verifyObjNotEmpty:function(obj){
		for(k in obj){
			if(k.length === 0 || obj[k]===0) return false
		}
	},
	loopObj:function(obj){
		var key,value;
		  console.log('got an object here '+obj)
		  for (k in obj){
		    if(typeof obj[k]==="object"){

		      module.exports.loopObj(obj[k])
		    }else if(k === 'key'){
		    	console.log(k+' : '+obj[k])
		    }else if (k==='value'){
		    	console.log(k+" : "+obj[k])
		    }else if(k.length == 0 || obj[k]==0){
		    	console.log('WE GOT AN EMPTY OBJECT!!!!!!!')
		    	return false
		    }else{
		    	console.log("Key: "+k+" and Value = "+obj[k])
		    }
		  
		}
	},
	loopDataArray:function(dataArray){
		console.log('array length '+dataArray.length)
		for(var x = 0;x<dataArray.length;x++){
			module.exports.loopObj(dataArray[x])

			}
		},
	userLogout:function(req, res){
		console.log('/getlogut============================================================')
		console.log("My userSession userName "+userSession.username)
		delete userSession.username 
		console.log("My userSession userName "+userSession.username)
		req.session.loggedIn = false
		delete req.session.userName
		userSession.loggedIn = false

		console.log(req.session)

		req.session.destroy(function(err){
			if(err){
				console.log('err: '+err)
			}else{
				console.log('Session Destroyed!')
			}
		})
		res.redirect('/')
	}
	


}