// This is the Glitch Catcher, modified to word for the "Advanced" SR5 character sheet
on('chat:message', function (msg) {
    
    if((msg.type != 'general' && msg.type != 'whisper') || msg.rolltemplate != 'shadowrun') {
        return;
    }
    
    if(msg.content.indexOf('Initiative') >= 0) {
        return; //not a pooled roll, don't report glitches
    }
    
    var poolSize;
    var dice;
    for(var k in msg.inlinerolls) {
        if(msg.inlinerolls[k].results.resultType == 'success') {
            dice = msg.inlinerolls[k].results.rolls[0].results;
            poolSize = msg.inlinerolls[k].results.rolls[0].dice;
            break;
        }
    }
    
    //log("Dice:"+dice);
    //log("Pool Size"+poolSize);
    
    var oneCount = 0;
    var hitCount = 0;
    var i = 0;
    var r;
    var glitchTreshold = Math.floor(poolSize/2);
    
    for(i=0; i<dice.length; i++) {
        if(dice[i].v == 1) {
            oneCount++;
        }
        if(dice[i].v == 5 || dice[i].v == 6) {
            hitCount++;
        }
    }
    log(msg.who + " rolled " + oneCount +" out of " + poolSize);
    if(oneCount >= glitchTreshold && hitCount == 0) {
        log(msg.who + " critically glitched");
        sendChat("player|"+msg.playerid, "/direct <big><strong>CRIT GLITCH!</strong></big>");
    } else if(oneCount >= glitchTreshold){
        log(msg.who + " glitched");
        sendChat("player|"+msg.playerid, "/direct <big><strong>GLITCH!</strong></big>");
    }
    
});