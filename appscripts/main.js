require(
   // Use this library to "fix" some annoying things about Raphel paper and graphical elements:
    //     a) paper.put(relement) - to put an Element created by paper back on a paper after it has been removed
    //     b) call element.addEventListener(...) instead of element.node.addEventListner(...)
    ["../jslibs/raphael.lonce"],  // include a custom-built library

    function () {

        console.log("Yo, I am alive!");

        var centerDiv = document.getElementById("centerDiv");
        var audio = document.getElementById("audio");
        var sidePanel = document.getElementById("side");

        var paper = new Raphael(centerDiv);

        var pWidth = paper.width-20;
        var pHeight = paper.height-20;
        console.log("pWidth is " + pWidth + ", and pHeight is " + pHeight);
        //---------------------------------------------------------------------

        //fill bg
        var bgRect = paper.rect(0,0,pWidth, pHeight);
        bgRect.attr({"fill": "black", "opacity":0});

        //-----------------------------------------------------------

        var soundFX = new Audio("resources/windchime.wav");


        //Instructions:
        alert("Welcome to my Interactive Animation. \nClick on any of the nodes to watch what happens!");


        //variables
        var array = [100];
        var i = 0;  //index of nodes
        var j = 0; //counter for checking for overlap
        var nodeNum = 0;    //number of nodes

        //randomise function should be outside of the while loop, don't have to create it again and again
        var randInt = function(max){
            return Math.floor(max*Math.random());
        };

        var tempX = randInt(pWidth/2);
        var tempY = randInt(pHeight/2);

        //distance function that takes 4 variables (x1,y1,x2,y2) & returns dist b/w two points (x1,y1), (x2,y2)
        var distance = function(x1,y1,x2,y2){
            var a = x1 - x2;
            var b = y1 - y2;
            var c = Math.sqrt( a*a + b*b );
            return c;
        };      

        i=0;
        //while the index is <30, create a new disk OBJECT each time, set position properties and xyrate
        while(i<100){


            //console.log("Before check, Coordinates of dot "+i+" are "+tempX+", "+tempY);
            j=0; //reset the counter
            while (j<i){
               // console.log("Distance is "+distance(tempX, tempY,array[j].xpos,array[j].ypos));
                //check whether the distance between the (tempX, tempY) and any of the previous nodes in the array overlap
                if (distance(tempX, tempY,array[j].xpos,array[j].ypos)<40){
                    tempX = randInt(pWidth); //randomise again
                    tempY = randInt(pHeight);
                    j=0;    //if there is overlap, randomise again, reset j and check whether there is overlap again, from beginning
                } //end if distance...
                else {      //if no overlap,
                    j++; //move on to the next node created, to check
                } //end else
            }; //end while j<i

            // assign6:4 A disk for us to play with
            console.log("TempX is "+tempX+", TempY is "+tempY);
            var node = paper.circle(tempX, tempY, 20);
            node.attr({"fill":"gray"});
            node.xpos = tempX;
            node.ypos = tempY;

            console.log("i is "+i);
            console.log("Coordinates of dot "+i+" are "+node.xpos+", "+node.ypos);
            array[i]=node;

            /*
                if (distance(node[i].xpos,node[i].ypos,node[i+1].xpos,node[i+1].ypos)<25){
                    node.attr({"cx": pWidth/2*Math.random(), "cy": pHeight/2*Math.random()});
                };  */

            i++;
        };   //end of while


        //create a transparent Raphael rectangle on top of everything to catch mouse activity
        var topRect = paper.rect(0,0,pWidth, pHeight);
        topRect.attr({"fill": "white", "opacity": 0});


        var dist; //distance between mouse click and node in array
        var maxDist = distance(0,0,pWidth,pHeight);

        //animate function
        function animate2(n) {
            n.animate({fill : 'gray'/*, opacity: 1*/}, 500, stop());
            console.log("Animate2");
        }
        function animate1(n,m) {
            setTimeout(function(){
            n.animate({fill : 'aqua'/*, opacity: 100/d*/}, 500, stop());
            setTimeout(function(){animate2(n)},m);    //delay before turning white
            },m)    //delay the lighting up depending on the distance from the mouse click
        }
        

        //state variable (3 properties) keep track of mouse pos & pushed/not
        var mouseState = {"pushed" : "no"};
        //event listeners to transparent rect
        topRect.addEventListener("click",function(ev){
            mouseState = {"pushed" : "yes",
                          "x" : ev.offsetX,
                          "y" : ev.offsetY};
            console.log("Mouse is pushed!");
            console.log("Mouse coordinates are "+ mouseState.x +","+mouseState.y);



            i=0;
            while (i<100) {
                if (mouseState.pushed === "yes") {
                    dist = distance(array[i].xpos,array[i].ypos,mouseState.x,mouseState.y);
                    console.log("Timer is "+ Math.floor(5000*(dist/maxDist)));

                    animate1(array[i],Math.floor(4000*(dist/maxDist))); //fraction of the longest distance possible b/w two nodes. 
                                                                        //Time needs to be an integer
                    soundFX.play();


                    sidePanel.style.backgroundImage = "url('resources/instapost.png')";

                }; //end if mouseState.pushed
                i++;
            }//end while i<50


        });//end topRect eventlistener                                   


});