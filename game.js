var animate = window.requestAnimationFrame || window.webkitRequestAnimationFrame ||         window.mozRequestAnimationFrame || function(callback) { window.setTimeout(callback,     1000/60) };
var canvas = document.createElement('canvas');
var width = 900;
var height = 600;
canvas.width = width;
canvas.height = height;
var context = canvas.getContext('2d');

var virtWidth = 1809;
var virtHeight = 1188;
var virtX = 3;
var virtY = 0;
var mouseX = 0;
var mouseY = 0;
var bgW = 210
var bgH = (virtHeight/virtWidth)*210
var listVar = true
var clickA = false
var canMove = false
var canClick = false
var clickAItem
var clickAX = 0
var goCorner = false
var cngX = -1
var cngY = -1
var corner = true
var helpVal = 0
var list = []
var listNum = 6
var level = 0
var loading = false
var loadNum = 0
var talking = true
var randLoadNum = true

//dialougie variables
var textArray = []
var textSpriteArray = []
//textSpriteArray will make them chase their faces and stuff to make it funny and whatever
var currentText = textArray[1]
var textSprite = new Image()
var textL = 0
textSprite.src = "./img/Sprites/manS.png"
var advDial = false
var advLevel = false

var found = new Audio("./img/sfx/found.mp3")
var talk = new Audio("./img/sfx/tap2.mp3")
talk.play()

context.font = "25px Comic Sans MS"

var testImg = new Image()
testImg.src = "./img/Sprites/kitchen.png"

var selection = new Image()
selection.src = "./img/Sprites/selection.png"

var listImg = new Image()
listImg.src = "./img/Sprites/list.png"

var talkImg = new Image()
talkImg.src = "./img/Items/talkingThing.png"

var barrel = new Image()
barrel.src = "./img/Items/barrel.png"
var bell = new Image()
bell.src = "./img/Items/bell.png"
var bio = new Image()
bio.src = "./img/Items/bioH.png"
var knob = new Image()
knob.src = "./img/Items/dKnob.png"
var dice = new Image()
dice.src = "./img/Items/fDice.png"
var fishRod = new Image()
fishRod.src = "./img/Items/fishRod.png"
var kFlag = new Image()
kFlag.src = "./img/Items/kFlag.png"
var lighter = new Image()
lighter.src = "./img/Items/lighter.png"
var match = new Image()
match.src = "./img/Items/match.png"
var peaceSign = new Image()
peaceSign.src = "./img/Items/peaceSign.png"
var sinkD = new Image()
sinkD.src = "./img/Items/SinkD.png"
var tbear = new Image()
tbear.src = "./img/Items/tbear.png"
var ship = new Image()
ship.src = "./img/Items/ship.png"
var rat = new Image()
rat.src = "./img/Items/rat.png"
var marat = new Image()
marat.src = "./img/Items/marat.png"
var watch = new Image()
watch.src = "./img/Items/watch.png"

//var  = new Image()

var itemsAvailable = []
var audioList = []

var title = new Image()
title.src = "./img/Items/titleScreen.png"

var end = new Image()
end.src = "./img/Items/end.png"

itemsAvailable.push(new item(lighter, 0, 696, "Lighter", 168, 72))
itemsAvailable.push(new item(dice, 312, 597, "Fuzzy Dice", 126, 135))
itemsAvailable.push(new item(sinkD, 612, 738, "Dog", 81, 72))
itemsAvailable.push(new item(barrel, 903, 750, "Barrel", 90, 189))
itemsAvailable.push(new item(kFlag, 822, 943, "Flag", 501, 245))
itemsAvailable.push(new item(tbear, 1083, 243, "Bear", 81, 87))
itemsAvailable.push(new item(fishRod, 186, 141, "Fishing Rod", 786, 51))
itemsAvailable.push(new item(bio, 639, 1038, "Biohazard", 87, 90))
itemsAvailable.push(new item(peaceSign, 1395, 489, "Peace Sign", 93, 96))
itemsAvailable.push(new item(knob, 471, 645, "Doorknob", 36, 30))
itemsAvailable.push(new item(match, 1269, 372, "Match", 147, 96))
itemsAvailable.push(new item(bell, 414, 267, "Bell", 189, 246))
itemsAvailable.push(new item(ship, 634, 204, "Ship", 144, 114))
itemsAvailable.push(new item(rat, 1506, 223, "Rat", 141, 150))
itemsAvailable.push(new item(marat, 741, 529, "Painting", 117, 152))
itemsAvailable.push(new item(watch, 59, 162, "Watch", 54, 219))

window.onload = function() {
    document.body.appendChild(canvas);
    animate(step);
}

var step = function() {
    update();
    if ( level == 0 ) {
        renderTitle()
    }
    else if ( level == 3 ) {
        renderEnd()
    }
    else {
        render();
    }
    animate(step);
//    console.log(level)
}

var keysDown = {};

window.addEventListener('mousemove', function (e) {
    mouseX = e.x;
    mouseY = e.y;
});

window.addEventListener('click', function (e) {
    if (level == 0) {
        if ( (mouseX >= 328 && mouseX <=587) && (mouseY >=348 && mouseY <=434) ) {
            level = 1
        }
    }
    else {
        checkIfClicked(mouseX, mouseY)
    }
});

window.addEventListener("keydown", function(event) {
  keysDown[event.keyCode] = true;
});

window.addEventListener("keyup", function(event) {
  delete keysDown[event.keyCode];
});


var update = function() {
    for ( var key in keysDown ) {
        if ( (key == 40 || key == 83) && ( virtY < virtHeight-height-3 ) && canMove ) {
            virtY += 3
        }
        if ( (key == 38 || key == 87) && ( virtY > 3 ) && canMove ) {
            virtY -= 3
        }
        if ( (key == 39 || key == 68) && ( virtX < virtWidth-width-3 ) && canMove ) { //right
            virtX += 3
        }
        if ( (key == 37 || key == 65) && ( virtX > 3 ) && canMove ) { //left
            virtX -= 3
        }
        if ( key == 81 ) {
            listVar = true
        }
        if ( key == 69 ) {
            listVar = false
        }
        if ( key == 76 ) {
            //: )//
//            loading = true
        }
        if ( key == 32 && advDial ) {
            advanceDialogue()
        }
    }
}

var render = function() {
    context.fillStyle = "#000000";
    context.fillRect(0,0,900,600);
    context.drawImage(testImg, virtX, virtY, width, height, 0, 0, width, height)
    renderItems()
    if ( clickA == true ) {
        clickAnim()
    }
    renderThingyBelow()
    context.drawImage(selection,(850-bgW)+((bgW)*(virtX/virtWidth)), (550-bgH)+((bgH)*(virtY/virtHeight)), (bgW/(virtWidth/900)), (bgH/(virtHeight/600)))
    if ( list.length > 0 && clickAnim ) {
        renderList()    
    }
    if ( talking ) {
        context.drawImage(talkImg, 60, 410, 780, 180)
        context.drawImage(textSprite, 84, 434, 129, 129)
        dialogue(currentText)
    }
    if ( loading ) {
        context.fillStyle = "#000000"
        context.fillRect(0,0,900,600)
        context.fillStyle = "#f8eef6"
        context.fillText("Loading... :)", 400, 320, 400)    
        context.fillStyle = "#000000"

        loadNum++
        if ( loadNum > 300 ) {
            loading = false
            loadNum = 0
        }
    }
    playAudio(audioList)
    update()
}

var renderTitle = function() {
    context.fillText("Loading... :)", 400, 320)    
    context.drawImage(title, 0, 0, 900, 600)
}

function item(image, x, y, name, w, h) {
    this.image = image
    this.x = x
    this.y = y
    this.name = name
    this.w = w
    this.h = h
}

var getList = function() {
    while ( list.length < 6 ) {
        var rand = Math.floor(Math.random()*(itemsAvailable.length))
        if ( !list.includes(itemsAvailable[rand]) ) {
            list.push(itemsAvailable[rand])
        }
        rand = Math.floor(Math.random()*(itemsAvailable.length))
    }
}
getList()
var renderItems = function() {
    for ( var i = 0; i < itemsAvailable.length; i++ ) {
        var temp = itemsAvailable[i]
        context.drawImage(temp.image, temp.x-virtX, temp.y-virtY, temp.w, temp.h)
    }
}

var renderThingyBelow = function() {
    context.drawImage(testImg,850-bgW,550-bgH,bgW,bgH)
    for ( var i = 0; i < itemsAvailable.length; i++ ) {
        var temp = itemsAvailable[i]
        context.drawImage(temp.image,(850-bgW)+(bgW*(temp.x/virtWidth)), (550-bgH)+(bgH*(temp.y/virtHeight)), temp.w*(bgW/virtWidth), temp.h*(bgH/virtHeight))
    }
}

var checkIfClicked = function(mX, mY) {
    if ( mX <= 900 && mY <= 600) {
        if ( canClick == true ) {
           for ( var i = 0; i < itemsAvailable.length; i++ ) {
            var temp = itemsAvailable[i]
                if ( mX-8 > temp.x-virtX && mX-8 < (temp.x+temp.w-virtX) ) {
                    if ( mY-8 > temp.y-virtY && mY-8 < (temp.y+temp.h-virtY) ) {
                        if ( list.includes(temp) ) {
                            clickAItem = temp
                            clickAnim()
                            canClick = false
                            itemsAvailable.splice(itemsAvailable.indexOf(temp), 1)
                            list.splice(list.indexOf(temp),1)
                            audioList.push(new Audio("./img/sfx/found.mp3"))
                        }
                    }
                }
            } 
        }
    }
}

var renderList = function() {
    if ( listVar ) {
        context.drawImage(listImg, 0,0,200,300)
        for ( var i = 0; i < list.length; i++ ) {
            context.fillStyle = "#000000"
            context.fillText(list[i].name, 25, 20+40*(i+1))

        }
    }
}

var clickAnim = function() {
    canMove = false
    clickA = true
    if ( goCorner == false ) {
        var val = Math.sin(clickAX)*.4
        context.drawImage(clickAItem.image, (clickAItem.x-(((val*clickAItem.w)/2)))-virtX, (clickAItem.y-((val*clickAItem.h)/2))-virtY, clickAItem.w+(val*clickAItem.w), clickAItem.h+(val*clickAItem.h))
        if ( clickAX <= (2*Math.PI) ) {
            clickAX = clickAX + (Math.PI/45)
        }
        else {
            goCorner = true
        }
    }
    else {
        if ( helpVal < 70 ) {
            if ( corner ) {
                cngY = (600-(clickAItem.y+(clickAItem.h/2)-virtY))/70
                cngX = (clickAItem.x+(clickAItem.w/2)-virtX)/70
                corner = false
            }
            clickAItem.x = clickAItem.x - cngX
            clickAItem.y = clickAItem.y + cngY
            context.drawImage(clickAItem.image, clickAItem.x-virtX-(helpVal*.02*(cngX*50)), clickAItem.y-virtY+(helpVal*.02*(cngY*70)), (clickAItem.w)*(1-(helpVal*.02)), (clickAItem.h)*(1-(helpVal*.02)))
            helpVal++
        }
        else {
            canMove = true
            clickA = false
            clickAX = 0
            canClick = true
            goCorner = false
            if ( list.length < 1 && level == 1 ) {
                advLevel = true
                setDialogue(["Mr. House Owner", "I really appreciate you cleaning part of my house for me, thank you kind person.", "Since you are considered my property I have the   legal authorization to sell you off to another    property owner, so from now on you will be workingfor my dear friend Mr. Poopoo at his crime place.", "Take care!"], ["./img/Sprites/man.png", "./img/Sprites/man.png", "./img/Sprites/man.png"], "./img/Sprites/man.png")
            }
            if ( list.length < 1 && level == 2 ) {
                advLevel = true
                setDialogue(["Mr. Poopoo", "I see you've taken a liking to my pets.", "Pretty little creatures... aren't they?", "I have big muscles", "Anyways kid, I'm gonna have to let you off.", "Nothing personal, just business."], ["./img/Sprites/chocMan.png", "./img/Sprites/chocMan.png", "./img/Sprites/chocMan.png", "./img/Sprites/chocMan.png", "./img/Sprites/chocMan.png"], "./img/Sprites/chocMan.png")
            }
            corner = true
            cngY = -1
            cngX = -1
            helpVal = 0
        }
    }
}

var dialogue = function(text) {
    if ( textL > 0 ) {
        audioList.push(new Audio("./img/sfx/tap2.mp3"))
        context.fillStyle = "#000000"
        if ( text.length-textL > 150 ) {
            context.fillText(text.substring(0,50),230,460,20*50)
            context.fillText(text.substring(50,100), 230, 490, 20*50)
            context.fillText(text.substring(100,150), 230, 520, 20*50)
            context.fillText(text.substring(150,text.length-textL), 230, 550, 20*(text.length-textL))
            context.fillText(textArray[0], 230, 570, 20*(textArray[0]).length)

        }
        else if ( text.length-textL > 100 ) {
            context.fillText(text.substring(0,50),230,460,20*50)
            context.fillText(text.substring(50,100), 230, 490, 20*50)
            context.fillText(text.substring(100,text.length-textL), 230, 520, 20*(text.length-textL))
            context.fillText(textArray[0], 230, 570, 20*(textArray[0]).length)

        }
        else if ( text.length-textL > 50 ) {
            context.fillText(text.substring(0,50),230,460,20*50)
            context.fillText(text.substring(50,text.length-textL), 230, 490, 20*(text.length-textL))
            context.fillText(textArray[0], 230, 570, 20*(textArray[0]).length)

        }
        else {
            context.fillText(text.substring(0,text.length-textL), 230, 460, 20*(text.length-textL))
            context.fillText(textArray[0], 230, 570, 20*(textArray[0]).length)
        }
        textL -=1
    }
    else {
        if ( text.length-textL > 150 ) {
            context.fillText(text.substring(0,50),230,460,20*50)
            context.fillText(text.substring(50,100), 230, 490, 20*50)
            context.fillText(text.substring(100,150), 230, 520, 20*50)
            context.fillText(text.substring(150,text.length-textL), 230, 550, 20*(text.length-textL))
            context.fillText(textArray[0], 230, 570, 20*(textArray[0]).length)

            advDial = true
        }
        else if ( text.length-textL > 100 ) {
            context.fillText(text.substring(0,50),230,460,20*50)
            context.fillText(text.substring(50,100), 230, 490, 20*50)
            context.fillText(text.substring(100,text.length-textL), 230, 520, 20*(text.length-textL))
            context.fillText(textArray[0], 230, 570, 20*(textArray[0]).length)
            advDial = true
        }
        else if ( text.length-textL > 50 ) {
            context.fillText(text.substring(0,50),230,460,20*50)
            context.fillText(text.substring(50,text.length-textL), 230, 490, 20*(text.length-textL))
            context.fillText(textArray[0], 230, 570, 20*(textArray[0]).length)
            advDial = true
        }
        else {
            context.fillText(text, 230, 460, 20*(text.length-textL))
            context.fillText(textArray[0], 230, 570, 20*(textArray[0]).length)
            advDial = true
        }
        context.fillText("'Space'", 725, 570, 140)
    }
}

var advanceDialogue = function() {
    if ( textArray.indexOf(currentText)+1 < textArray.length ) {
        currentText = textArray[textArray.indexOf(currentText)+1]
        textSprite.src = textSpriteArray[textArray.indexOf(currentText)-1]
        textL = currentText.length
        advDial = false
    }
    else {
        talking = false
        advDial = false
        canMove = true
        canClick = true
    }
    if ( advLevel && !talking && level == 1) {
        level = 2
            changeLevel(2376,1584,2,"./img/Sprites/court.png")
//            itemsAvailable.push()
//            setDialogue()
            var monkey = new Image()
            monkey.src = './img/Items/monkey.png'
            var sanddollar = new Image()
            sanddollar.src = './img/Items/sd.png'
            var shoe = new Image()
            shoe.src = './img/Items/shoe.png'
            var fish = new Image()
            fish.src = './img/Items/fish.png'
            var skiithings = new Image()
            skiithings.src = './img/Items/skii.png'
            var flowers = new Image()
            flowers.src = './img/Items/flowers.png'
            var cat = new Image()
            cat.src = './img/Items/cat.png'
            var austrianflag = new Image()
            austrianflag.src = './img/Items/austrianFlag.png'
            var snake = new Image()
            snake.src = './img/Items/snake.png'
            var ibex = new Image()
            ibex.src = './img/Items/ibex.png'
            var eagleonthing = new Image()
            eagleonthing.src = './img/Items/eagle.png'
            var bat = new Image()
            bat.src = './img/Items/bat.png'
            var lizard = new Image()
            lizard.src = './img/Items/lizard.png'
            var ibexmotif = new Image()
            ibexmotif.src = './img/Items/mofic.png'
            var painting = new Image()
            painting.src = './img/Items/ivan.png'
            var dinosaur = new Image()
            dinosaur.src = './img/Items/dinosaur.png'
            var opposum = new Image()
            opposum.src = './img/Items/opposum.png'
            var birdonthing = new Image()
            birdonthing.src = './img/Items/bird.png'
            var bunny = new Image()
            bunny.src = './img/Items/bunny.png'
            itemsAvailable.push(new item(monkey, 1067, 729, 'Monkey', 245, 156))
            itemsAvailable.push(new item(sanddollar, 1125, 525, 'Sand Dollar', 120, 120))
            itemsAvailable.push(new item(shoe, 0, 999, 'Shoe', 269, 110))
            itemsAvailable.push(new item(fish, 377, 992, 'Fish', 111, 96))
            itemsAvailable.push(new item(skiithings, 2259, 519, 'Skii', 56, 472))
            itemsAvailable.push(new item(flowers, 1318, 661, 'Flowers', 203, 230))
            itemsAvailable.push(new item(cat, 1162, 960, 'Chill Cat', 361, 180))
            itemsAvailable.push(new item(austrianflag, 1033, 1284, 'Flag', 354, 300))
            itemsAvailable.push(new item(snake, 2046, 1290, 'Snake', 316, 294))
            itemsAvailable.push(new item(ibex, 1605, 468, 'Ibex', 234, 415))
            itemsAvailable.push(new item(eagleonthing, 1378, 0, 'Eagle', 423, 407))
            itemsAvailable.push(new item(bat, 633, 182, 'Bat', 151, 321))
            itemsAvailable.push(new item(lizard, 181, 1281, 'Lizard', 300, 303))
            itemsAvailable.push(new item(ibexmotif, 855, 921, 'Vase', 123, 222))
            itemsAvailable.push(new item(painting, 323, 531, 'Painting', 205, 278))
            itemsAvailable.push(new item(dinosaur, 0, 560, 'Dinosaur', 269,413))
            itemsAvailable.push(new item(opposum, 1947, 891, 'Opposum', 245, 192))
            itemsAvailable.push(new item(birdonthing, 2024, 801, 'Bird', 118, 90))
            itemsAvailable.push(new item(bunny, 549, 719, 'Bunny', 105, 166))
            getList()
        advLevel = false
    }
    if ( advLevel && !talking && level == 2) {
        level = 3
    }
}

var setDialogue = function(txtArray, txtSpriteArray, txtSprite) {
    textArray = txtArray
    textSpriteArray = txtSpriteArray
    //textSpriteArray will make them chase their faces and stuff to make it funny and whatever
    currentText = textArray[1]
    textL = currentText.length
    textSprite = new Image()
    textSprite.src = txtSprite
    advDial = false
    talking = true
    canMove = false
    canClick = false
}

var changeLevel = function(vW2, vH2, newLevel, newImagePath ) {
    loading = true
    virtWidth = vW2;
    virtHeight = vH2;
    virtX = 3;
    virtY = 0;
    mouseX = 0;
    mouseY = 0;
    bgH = (vH2/vW2)*bgW
    listVar = true
    clickA = false
    canMove = true
    canClick = true
    clickAItem = null
    clickAX = 0
    goCorner = false
    cngX = -1
    cngY = -1
    corner = true
    helpVal = 0
    list = []
    listNum = 6
    level = newLevel
    itemsAvailable = []
    testImg.src = newImagePath;
}

var playAudio = function(thing) {
    for ( var x = 0; x < thing.length; x++ ) {
        thing[x].play()
    }
    audioList = []
}



setDialogue(["Mr. House Owner", "Hey, it is me. Your owner.", "I don't mean to come off as rude, but I MUST say  that I do in fact own you, and you work for me.", "Your task today is to find all of my missing      items... I am not too good with finding things yousee...", "Use the arrow keys to look around the room and    click on items on the list that you find.", "To toggle the list visibility press Q and E.", "That is all for now, now go do your bidding beforeI dispose of you!"], ["./img/Sprites/manS.png", "./img/Sprites/man.png", "./img/Sprites/man.png", "./img/Sprites/manS.png", "./img/Sprites/manS.png", "./img/Sprites/manS.png"], "./img/Sprites/manS.png")

var renderEnd = function() {
    context.drawImage(end, 0, 0, 900, 600)
}