# Storytime
A web app where you can create a multi path story.  
From each sentence you can create 4 other possible sentences.  
Click on any sentence to use that as the next one, then create up to 4 more!  
You can go back to the start of the story at any time, to read through existing sentences or create new ones.

# Install

Required modules:  
-mongo  
-node  
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

The app currently resets the database on startup. To remove this functionality delete line 16 & 17 in app.js

Things to add:  
Readout of the current story.  
Branching tree of written sentences.  
Manual database reset.  
Multi user support?  
