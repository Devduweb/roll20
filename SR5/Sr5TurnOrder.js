/*
 * A tracker handler for SR5
 * Removes 10 from the initiative score from the tracker entries after their turn.
 * Removes them from the tracker once they have exhausted their action.
 * Initiative can be rerolled once the tracker is empty.
 */

var sr5TurnOrder = (function() {
    'use strict';
    
    var eventMode = false;
    
    var init = function() {
        if(!eventMode) {
            return;
        }
        
        on('change:campaign:turnorder', turn);
    }

    // Removes 10 from the score, if it's under 0, remove it from the tracker. 
    var turn = function(currentOrder, previousOrder) {
        var currentOrder = Campaign().get('turnorder');
        Campaign().set('turnorder', handleInitiative(currentOrder, previousOrder));
    }
    
    var handleInitiative = function(currentOrder, previousOrder) {

        // Parse the data
        if (typeof(currentOrder) === 'string') {
            currentOrder = JSON.parse(currentOrder);
        }
        
         if (typeof(previousOrder) === 'string') {
            previousOrder = JSON.parse(previousOrder);
        }

        var previousTurn = currentOrder[currentOrder.length - 1];
        var previousTurnTest = previousOrder[0];
        
        //log(previousTurn);
        //log(previousTurnTest);
        
        // Let's assume it's only a 
        if(previousTurn.id !== previousTurnTest.id || previousTurn.pr !== previousTurnTest.pr) {
            return;
        }

        // If by any chance it's empty, we have nothing to do. 
        // Avoid touching TrackerJacker too.
        if(currentOrder.length == 0 || previousTurn.pr <= -100) {
            return;
        }
        
        previousTurn.pr -= 10;

        // Removes the entry, add it back if it still have init left.
        currentOrder.pop();
        if(previousTurn.pr > 0) {
            currentOrder.push(previousTurn);
        }

        return currentOrder = JSON.stringify(currentOrder);
    }
    
    return {
        init: init,
        handleInitiative: handleInitiative
    };
}());

on('ready', function() {
    'use strict'; 
    sr5TurnOrder.init();
});
