# Storytime
A web app where you can create an infinitely branching story tree.  

Once you have submited a sentence, you may click on that sentence to continue that branch of the story and write up to 4 new sentences.

There are no limits to the depth of the stories.

You can go back to the start of the story at any time, to read through existing storylines or create new ones.

# Install

Required modules:  
-mongodb  
-nodejs  
-npm  

Please make sure you have recent versions of the above installed.

To run the application, make sure "wherever/you/want" exists and run:  
$mongod --dbpath "wherever/you/want"

Run from the storytime directory:  
$npm install  

Once finished run:  
$npm start

Then open   
http://localhost:4564/story-time  
or the shortcut Make_a_story

Write some stories!


# Extras

The app currently resets the database on startup. To remove this functionality delete line 13 in app.js

Things to add:  
Readout of the current story.  
Branching tree of written sentences.  
Manual database reset.
Edit Sentences.
Make it pretty
Multi user support?  
use sessions not mongo?
