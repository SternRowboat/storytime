var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');
module.exports = router;

pageId=1

/* render page with current pageId */
router.get('/story-time', function(req, res) {
	var db = req.db;
	var collection = db.get('pages');
	collection.findOne({ _id: 1 },{},function(e,docs){
		if (docs != null) {
			collection.findOne({ _id: pageId },{},function(e,docs){
				res.render('story-time', {
					"hithere" : docs
				});
					
			});
		}
		else {
			
		}
			
	});
});

// go back to page 1 //
router.post('/page1', function(req, res) {
	pageId=1
	res.redirect("story-time")
});

//*************NEEDS FINISHING FOR ALL SENTENCES******************//
/* Create new story page*/
router.post('/makeStory', function(req, res) {
	var db = req.db;
	var collection = db.get('pages');
	collection.count({}, {},function(e,pageTotal){ 
		newPageId = pageTotal + 1;
		var slField = req.body.s1ms !=null ? 's1l' : req.body.s2ms !=null ? 's2l' : req.body.s3ms !=null ? 's3l' : req.body.s4ms !=null ? 's4l' : 'something went wrong with has story sentence field selector';
		var sField = req.body.s1ms !=null ? 's1' : req.body.s2ms !=null ? 's2' : req.body.s3ms !=null ? 's3' : req.body.s4ms !=null ? 's4' : 'something went wrong with has story sentence field selector';
		console.log(slField)
		console.log(sField)
		collection.update({"_id": pageId }, {$set: {[slField] : newPageId}});
		collection.findOne({"_id": pageId }, {[sField] :1},function(e,midDoc){
			var middle = midDoc.s1 !=null ? midDoc.s1 : midDoc.s2 !=null ? midDoc.s2 : midDoc.s3 !=null ? midDoc.s3 : midDoc.s4 !=null ? midDoc.s4 : 'couldnt find the middle sentence'
			console.log("middle of", newPageId, "is", middle)
			collection.insert({"_id": newPageId, "middle": middle});
			pageId = newPageId;
			res.redirect("story-time");
		});
		
		
	});

});

/* Go to existing storypage */
router.post('/hasStory', function(req, res) {
	var db = req.db;
	var collection = db.get('pages');
	var slField = req.body.s1hs !=null ? 's1l' : req.body.s2hs !=null ? 's2l' : req.body.s3hs !=null ? 's3l' : req.body.s4hs !=null ? 's4l' : 'something went wrong with has story sentence field selector';
	console.log(slField)
	collection.findOne({"_id": pageId }, {[slField] :1},function(e,page){
		console.log(page) 
		pageId = page.s1l !=null ? page.s1l : page.s2l !=null ? page.s2l : page.s3l !=null ? page.s3l : page.s4l !=null ? page.s4l : 'no link found?'
		res.redirect("story-time");
	});
	
});

router.post('/saveSentence', function(req, res) {
	var db = req.db;
	var collection = db.get('pages');
	// find which sentence is being submitted
	var sVal = req.body.s1 !=null ? req.body.s1 : req.body.s2 !=null ? req.body.s2 : req.body.s3 !=null ? req.body.s3 : req.body.s4 !=null ? req.body.s4 : 'something went wrong with sentence value selector';
	var sField = req.body.s1 !=null ? 's1' : req.body.s2 !=null ? 's2' : req.body.s3 !=null ? 's3' : req.body.s4 !=null ? 's4' : 'something went wrong with sentence field selector';
	// if Field not empty update
	if (sVal != null && sVal !="" )
			collection.update({"_id": pageId }, {$set: {[sField] : sVal}
		}, 
		function (err, doc) {
		if (err) {
			// If it failed, return error
			res.send("There was a problem adding the information to the database.");
		}
		else {
			// And forward to success page
			res.redirect("story-time");
		}
	});
   	else {
		res.redirect("story-time")
	}   
});
