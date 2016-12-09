function putPostsInplace(arrayObj){
	for(var x = 0;x<arrayObj.length;x++){
		var title = arrayObj[x].myPostTitle;
		var post = arrayObj[x].myPost;
		var time = arrayObj[x].timeStamp;
		$('#postTitles').append('<ul><li><p onclick="showPostBody()" class="postTitleList">'+title+'</p></li><li class="small">'+time+'</li></ul>')
	}

}
function showPostBody(e){
	console.log(e.target)
}

$.ajax({
	type:'GET',
	url:'/findPostsFromDB',
	success:function(data){
		console.log('success')
		console.log(data.length)
		putPostsInplace(data)

	},
	error:function(err){
		console.log('error '+err)
	}
})



$('#submitMyPost').on('click', function(){
	var myPost = $('#myPost').val()
	var myPostTitle = $('#myPostTitle').val()
	if(myPost.length ==0 || myPostTitle.length ==0){
		$('#submitPostFeedback').html('<p id="error">Post and Title required</p>')

		return
	}
	$.ajax({url:'/adminPost',
			type:"POST",
			data:{
				'myPost':myPost,
				'myPostTitle':myPostTitle,
				'timeStamp': new Date()
				}, 
			success: function(data){
				console.log(data)
				$('#myPost').val('');
				$('#myPostTitle').val('');
				$('#submitPostFeedback').html('<p id="success">Successfully submited</p>')
				},
			error: function(err){
				console.log('Error!! '+JSON.stringify(err))
				$('#submitPostFeedback').html('<p id="error">AJAX Error</p>')

				}
	})
})