var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');
module.exports = router;

pageId=1;


/* render page with current pageId */
router.get('/story-time', function(req, res) {
	var db = req.db;
	var collection = db.get('pages');

	collection.findOne({"_id": pageId },{},function(e,docs){
		if (e){
			res.send("Couldn't find page with that id");
		}
		else {
			res.render('story-time', {"thispage" : docs});	
		}
	});
});


// Go back to page 1 //
router.post('/page1', function(req, res) {
	pageId=1;
	res.redirect("story-time");
});


/* Create new page then go there*/
router.post('/makePage', function(req, res) {
	var db = req.db;
	var collection = db.get('pages');

	collection.count({}, {},function(e,pageTotal){ 
		if (e){
			res.send("Couldn't count number of pages");
		}
		else {
			newPageId = pageTotal + 1;
			var nextPageLink = req.body.topMakePage != null ? 'topLink' : req.body.leftMakePage != null ? 'leftLink' : req.body.rightMakePage != null ? 'rightLink' : req.body.botMakePage != null ? 'botLink' : 'something went wrong with has story sentence field selector';
			console.log(nextPageLink + "s to " + newPageId);
			collection.update({"_id": pageId }, {$set: {[nextPageLink] : newPageId}});
			
			var sentencePosition = req.body.topMakePage != null ? 'top' : req.body.leftMakePage != null ? 'left' : req.body.rightMakePage != null ? 'right' : req.body.botMakePage != null ? 'bot' : 'something went wrong with has story sentence field selector';
			collection.findOne({"_id": pageId }, {[sentencePosition] :1}, function(e,midDoc){
				if (e){
				res.send("ERROR: Couldn't find the " + sentencePosition + " for pageid " + pageId);
				}
				else {
					var middle = midDoc.top != null ? midDoc.top : midDoc.left != null ? midDoc.left : midDoc.right != null ? midDoc.right : midDoc.bot != null ? midDoc.bot : 'couldnt find the middle sentence';
					console.log("middle of page ", newPageId, "is", middle);
					collection.insert({"_id": newPageId, "middle": middle});
					pageId = newPageId;
					res.redirect("story-time");
				}
			});
		}
	});
});


/* Go to existing storypage */
router.post('/hasPage', function(req, res) {
	var db = req.db;
	var collection = db.get('pages');
	// find which sentence is clicked
	var nextPageLink = req.body.topHasPage != null ? 'topLink' : req.body.leftHasPage != null ? 'leftLink' : req.body.rightHasPage != null ? 'rightLink' : req.body.botHasPage != null ? 'botLink' : 'something went wrong with has story sentence field selector';
	console.log(nextPageLink);

	//return link for sentence,
	collection.findOne({"_id": pageId }, {[nextPageLink] :1}, function(e,page){
		if (e){
			res.send("Couldn't count number of pages");
		}
		else {
			console.log(page);
			pageId = page.topLink != null ? page.topLink : page.leftLink != null ? page.leftLink : page.rightLink != null ? page.rightLink : page.botLink != null ? page.botLink : 'no link found?';
			res.redirect("story-time");
		}
	});
});


router.post('/saveSentence', function(req, res) {
	var db = req.db;
	var collection = db.get('pages');
	// find which sentence is being submitted
	var sentenceText = req.body.top != null ? req.body.top : req.body.left != null ? req.body.left : req.body.right != null ? req.body.right : req.body.bot != null ? req.body.bot : 'something went wrong with sentence value selector';
	var sentencePosition = req.body.top != null ? 'top' : req.body.left != null ? 'left' : req.body.right != null ? 'right' : req.body.bot != null ? 'bot' : 'something went wrong with sentence field selector';
	console.log(sentencePosition + " sentence is " + sentenceText);
	// if Field not empty update
	if (sentenceText != null && sentenceText != "" ){
		collection.update({"_id": pageId }, {$set: {[sentencePosition] : sentenceText}});
		res.redirect("story-time");
	}
   	else {
		res.send('Please do not enter a blank sentence');
	}
});