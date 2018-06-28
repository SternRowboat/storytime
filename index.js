var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');
var app = express();
module.exports = router;

pageId=1;

/* render page with current pageId */
router.get('/story-time', function(req, res) {
		var now = new Date();
console.log("\n" + now + "\n  Currently on page: " + pageId)
	req.collection.findOne({"_id": pageId },{},function(e,docs){
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
	var now = new Date();
	console.log(now + "\n  Returned to page 1.")
	pageId=1;
	res.redirect("story-time");
});


/* Create new page then go there*/
router.post('/makePage', function(req, res) {
	var now = new Date();
	console.log("\n" + now)
	req.collection.count({}, {},function(e,pageTotal){ 
		if (e){
			res.send("Couldn't count number of pages");
		}
		else {
			newPageId = pageTotal + 1;
			var nextPageLink = Object.keys(req.body);
			req.collection.update({"_id": pageId }, {$set: {[nextPageLink] : newPageId}});
			var sentencePosition = ("" + nextPageLink).slice(0,-4);

			console.log("  Clicked on " + sentencePosition + " sentence on page " + pageId + " which links to the current page: " + newPageId);

			req.collection.findOne({"_id": pageId }, {[sentencePosition] :1}, function(e,midDoc){
				if (e){
				res.send("ERROR: Couldn't find the " + sentencePosition + " for pageid " + pageId);
				}
				else {
					var middle = Object.values(midDoc);
					console.log("  Middle of page ", newPageId, "is", middle[1]);
					req.collection.insert({"_id": newPageId, "middle": middle[1]});
					pageId = newPageId;
					res.redirect("story-time");
				}
			});
		}
	});
});


/* Go to existing storypage */
router.post('/hasPage', function(req, res) {
	var now = new Date();
	console.log("\n" + now)
	// find which sentence is clicked
	var nextPageLink = req.body.topHasPage != null ? 'topLink' : req.body.leftHasPage != null ? 'leftLink' : req.body.rightHasPage != null ? 'rightLink' : req.body.botHasPage != null ? 'botLink' : 'Something went wrong with hasPage nextPageLink.\n';
	console.log("  Clicked on " + nextPageLink);

	//return link for sentence,
	req.collection.findOne({"_id": pageId }, {[nextPageLink] :1}, function(e,page){
		if (e){
			res.send("Couldn't count number of pages");
		}
		else {
			pageId = page.topLink != null ? page.topLink : page.leftLink != null ? page.leftLink : page.rightLink != null ? page.rightLink : page.botLink != null ? page.botLink : 'no link found?';
			res.redirect("story-time");
		}
	});
});

//create new sentence
router.post('/saveSentence', function(req, res) {
	var now = new Date();
	console.log("\n" + now)
	// find which sentence is being submitted
	var sentenceText = Object.values(req.body);
	var sentencePosition = Object.keys(req.body);
	console.log("  Created Sentence on page " + pageId + "\n   At position: " + sentencePosition + "\n   Saying: " + sentenceText);
	// if Field not empty update
	if (sentenceText != null && sentenceText != "" ){
		req.collection.update({"_id": pageId }, {$set: {[sentencePosition] : sentenceText}});
		res.redirect("story-time");
		
	}
   	else {
		res.send('Please do not enter a blank sentence');
	}
});