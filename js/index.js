
let mainBoard = document.querySelector('.main-board');
let playbox = document.querySelector('.play-box');
let winner = document.querySelector('.decision-text');
let decision = document.querySelector('.decision');
let restartbutton = document.querySelector('.restart-button');
let opponentselect = document.querySelector('#opponent-select');
let chooseX = document.querySelector('.choose-x');
let chooseO = document.querySelector('.choose-o');

const displayController = (()=>{

    const refresh = (arr)=>{
        // console.log(arr)
        arr.forEach((element,index) => {
            let box = gameBoard.mainBoard.querySelector(`#box-${index}`);
            box.innerHTML = "";
            box.append(document.createTextNode(element));

            
        });
    }
    return {refresh}
}

)();

const player = (name="player1",playingpiece)=>{
    const getName = ()=> name;
    const getPlayingPiece = ()=> playingpiece;

    return {getName,getPlayingPiece}
}

const gameBoard = (()=>{
    const  size = 3;
    let gameBoardArr = new Array(9);
    const mainBoard = document.querySelector('.main-board');
    let player1 ;
    // = player("player1","X");
    let player2 ;
    // = player("player2","O");
    let currentPlayer ;
    // = player1;
    let humanMark;
    let aiMark;

    function checkIfWinnerFound1(currBdSt, currMark) {
        if (
            (currBdSt[0] === currMark && currBdSt[1] === currMark && currBdSt[2] === currMark) ||
            (currBdSt[3] === currMark && currBdSt[4] === currMark && currBdSt[5] === currMark) ||
            (currBdSt[6] === currMark && currBdSt[7] === currMark && currBdSt[8] === currMark) ||
            (currBdSt[0] === currMark && currBdSt[3] === currMark && currBdSt[6] === currMark) ||
            (currBdSt[1] === currMark && currBdSt[4] === currMark && currBdSt[7] === currMark) ||
            (currBdSt[2] === currMark && currBdSt[5] === currMark && currBdSt[8] === currMark) ||
            (currBdSt[0] === currMark && currBdSt[4] === currMark && currBdSt[8] === currMark) ||
            (currBdSt[2] === currMark && currBdSt[4] === currMark && currBdSt[6] === currMark)
    ) {
            return true;
        } else {
            return false;
        }
    }

    const playAI = () =>{
        
        
     gameBoardArr[minimax(gameBoardArr,aiMark.getPlayingPiece()).playindex] = aiMark.getPlayingPiece();
     
     displayController.refresh(gameBoardArr);
     currentPlayer = humanMark;
     if(checkIfWinnerFound(getPreviousPlayerArray())){
        decision.style.display='flex';
        playbox.style.cssText= `filter: blur(3px);-webkit-filter: blur(3px);`
        winner.textContent = `${getPreviousPlayer().getPlayingPiece()}
        is the Winner`;
    }else if(gameBoardArr.filter((element)=>{

            return element;
     }).length ==  gameBoardArr.length){
         decision.style.display = 'flex';
        playbox.style.cssText= `filter: blur(3px);-webkit-filter: blur(3px);`
        winner.textContent = `Draw`;
    };
    //  console.log(gameBoard.getPreviousPlayerArray())
        
    }
    // Step 6 - Create the minimax algorithm:
    function minimax(currBdSt, currMark,depth=0) {
        // Step 8 - Store the indexes of all empty cells:
        const availCellsIndexes = getAllEmptyCellsIndexes(currBdSt);
        // console.log(availCellsIndexes)
        // Step 9 - Check if there is a terminal state:
        if (checkIfWinnerFound1(currBdSt,humanMark.getPlayingPiece())) {
            return {score: -1};
        } else if (checkIfWinnerFound1(currBdSt,aiMark.getPlayingPiece())) {
            return {score: 1};
        } else if (availCellsIndexes.length === 0) {
            return {score: 0};
        }
        
        // // // Step 10 - Create a place to record the outcome of each test drive:
        const allTestPlayInfos = [];
        
        // // // Step 10 - Create a for-loop statement that will loop through each of the empty cells:
        for (let i = 0; i < availCellsIndexes.length; i++) {
            // Step 11 - Create a place to store this test-play’s terminal score:
            const currentTestPlayInfo = {};
            
            // Step 11 - Save the index number of the cell this for-loop is currently processing:
            currentTestPlayInfo.index = currBdSt[availCellsIndexes[i]];
            currentTestPlayInfo.playindex = availCellsIndexes[i];
            
            // Step 11 - Place the current player’s mark on the cell for-loop is currently processing:
            currBdSt[availCellsIndexes[i]] = currMark;
            
            if (currMark === aiMark.getPlayingPiece()) {
                // Step 11 - Recursively run the minimax function for the new board:
                const result = minimax(currBdSt, humanMark.getPlayingPiece(),depth+1);
                
                // Step 12 - Save the result variable’s score into the currentTestPlayInfo object:
                currentTestPlayInfo.score = result.score;
            } else {
                // Step 11 - Recursively run the minimax function for the new board:
                const result = minimax(currBdSt, aiMark.getPlayingPiece(),depth+1);
                
                // Step 12 - Save the result variable’s score into the currentTestPlayInfo object:
                currentTestPlayInfo.score = result.score;
            }
            
            // Step 12 - Reset the current board back to the state it was before the current player made its move:
            currBdSt[availCellsIndexes[i]] = currentTestPlayInfo.index;
            // if(depth ==0) console.log(allTestPlayInfos)
            // Step 12 - Save the result of the current player’s test-play for future use:
            allTestPlayInfos.push(currentTestPlayInfo);
        }
        
        // // Step 15 - Create a store for the best test-play’s reference:
        let bestTestPlay = null;
        
        // // console.log(depth)
        // Step 16 - Get the reference to the current player’s best test-play:
        if (currMark === aiMark.getPlayingPiece()) {
            let bestScore = -Infinity;
            for (let i = 0; i < allTestPlayInfos.length; i++) {
                if (allTestPlayInfos[i].score > bestScore) {
                    bestScore = allTestPlayInfos[i].score;
                    // allTestPlayInfos[i].playindex = i;
                    bestTestPlay = i;
                }
            }
        } else {
            let bestScore = Infinity;
            for (let i = 0; i < allTestPlayInfos.length; i++) {
                if (allTestPlayInfos[i].score < bestScore) {
                    bestScore = allTestPlayInfos[i].score;
                    // allTestPlayInfos[i].playindex = i;
                    bestTestPlay = i;
                }
            }
        }

        // console.log(allTestPlayInfos)
        
        // // Step 17 - Get the object with the best test-play score for the current player:
        return allTestPlayInfos[bestTestPlay];
    } 
    const setAiMarker = (marker)=>{
        if(marker =='X'){
            humanMark =player("player1","X");
            aiMark =  player("player2","O");

            // player1 = player("player1","X");
            // player2 = player("player2","O");
            currentPlayer = humanMark;
        }else{
            humanMark = player("player1","O");
            aiMark = player("player2","X");

            // player1 = player("player1","O");
            // player2 = player("player2","X");
            currentPlayer = aiMark;
        }
        
        
    }
    
    const createGameBoard = ()=>{
       
        if(document.querySelector('#opponent-select').value == 'AI' && document.querySelector('.choice').innerHTML == 'X' ){
            humanMark =player("player1","X");
            aiMark =  player("player2","O");

            // console.log('here')

            // player1 = player("player1","X");
            // player2 = player("player2","O");
            currentPlayer = humanMark;
            gameBoardArr.fill('');
            // gameBoardArr=[0,1,2,3,4,5,6,7,8];
            // console.log(gameBoardArr)
        }else if(document.querySelector('#opponent-select').value == 'AI' && document.querySelector('.choice').innerHTML == 'O' ){
            humanMark = player("player1","O");
            aiMark = player("player2","X");

            // player1 = player("player1","O");
            // player2 = player("player2","X");
            currentPlayer = aiMark;
            gameBoardArr.fill('');
            // gameBoardArr=[0,1,2,3,4,5,6,7,8];
        }else{
            player1 = player("player1","X");
            player2 = player("player2","O");
            currentPlayer = player1;
            gameBoardArr.fill('');
        }
        
        
        // AiMarker;
        mainBoard.innerHTML = "";
        for(let i = 0 ; i< size; i++){
            for(let j = 0; j<size; j++){
                let box = document.createElement('div');
                box.className = 'boxes';
                box.classList.toggle(`row-${i}`);
                box.setAttribute('id',`box-${i*size+j}`)
                
                //gameBoardArr[i*size+j]= ((i*size+j)%2==1)? 'X':'O'
    
                mainBoard.appendChild(box);
            }
            
        }
        // return gameBoardArr;
        displayController.refresh(gameBoardArr)
    }
    const getPreviousPlayer = ()=>{
        if(currentPlayer.getPlayingPiece() == player1.getPlayingPiece()){
           return player2;
        }else {
            return  player1;
        }
    }
    const getcurrentPlayer = ()=>{
        
           return currentPlayer;
        
    }
    const getPlayedArray = (arr,playerarg) =>{
        let array1=[];
            for(i=0; i<arr.length;i++){
                if(arr[i] == playerarg.getPlayingPiece())
                array1.push(i)
            }
            
            return array1;
    }
    const getPreviousPlayerArray = ()=>{
        
        if(player1){
            if(currentPlayer.getPlayingPiece() == player1.getPlayingPiece()){
                // console.log('player2')
                let array1=[];
                for(i=0; i<gameBoardArr.length;i++){
                    if(gameBoardArr[i] == player2.getPlayingPiece())
                    array1.push(i)
                }
                
                return array1;
            }else {
                // console.log('player1')
                let array=[];
                for(i=0; i<gameBoardArr.length;i++){
                    if(gameBoardArr[i] == player1.getPlayingPiece())
                    array.push(i)
                }
                
                return array;
            }
        }else{
            if(currentPlayer.getPlayingPiece() == aimark.getPlayingPiece()){
                // console.log('player2')
                let array1=[];
                for(i=0; i<gameBoardArr.length;i++){
                    if(gameBoardArr[i] == humanMark.getPlayingPiece())
                    array1.push(i)
                }
                
                return array1;
            }else {
                // console.log('player1')
                let array=[];
                for(i=0; i<gameBoardArr.length;i++){
                    if(gameBoardArr[i] == aiMark.getPlayingPiece())
                    array.push(i)
                }
                
                return array;
            }
        }

        
    }
    const getPlayerArray = (player)=>{
        let array1=[];
        
        for(i=0; i<gameBoardArr.length;i++){
            if(gameBoardArr[i] == player.getPlayingPiece())
             array1.push(i)
        }
            
        
            
            return array1;
    }
    const checkHorizontal = (array)=>{
        let check ;
        
        
        let arr1= [[0,1,2],[3,4,5],[6,7,8]];
        
        for (a of arr1){
            // console.log(a);
            check = 0;
            for(i=0;i<array.length;i++){
                if(a.includes(array[i])){
                    check++;
                    // console.log(check);
                }
                
                if(check ==3) break;
            }
            // console.log(check)
            if(check ==3) break;
        }

        
        if(check ==3){
            return true;
        } else return false ;
        


    }

    const checkVertical = (array)=>{
        let check ;
        
        
        let arr1= [[0,3,6],[1,4,7],[2,5,8]];
        
        for (a of arr1){
            // console.log(a);
            check = 0;
            for(i=0;i<array.length;i++){
                if(a.includes(array[i])){
                    check++;
                    // console.log(check);
                }
                
                if(check ==3) break;
            }
            // console.log(check)
            if(check ==3) break;
        }

        
        if(check ==3){
            return true;
        } else return false ;
        


    }
    const checkDiagonal = (array)=>{
        let check ;
        
        
        let arr1= [[0,4,8],[2,4,6]];
        
        for (a of arr1){
            // console.log(a);
            check = 0;
            for(i=0;i<array.length;i++){
                if(a.includes(array[i])){
                    check++;
                    // console.log(check);
                }
                
                if(check ==3) break;
            }
            // console.log(check)
            if(check ==3) break;
        }

        
        if(check ==3){
            return true;
        } else return false ;
        


    }
    function getAllEmptyCellsIndexes(currBdSt) {
        // console.log(currBdSt)
        let arr=[];
        for(let i=0;i<currBdSt.length;i++){
            if(!(currBdSt[i] =="O"|| currBdSt[i] =="X")){
                // console.log(currBdSt[i] =="O"|| currBdSt[i] =="X")
                arr.push(i);
            }
        }
        return arr;
    }
    
    // Step 5 - Create a winner determiner function:
    const  checkIfWinnerFound = (array)=> {
        if (checkHorizontal(getPreviousPlayerArray())||checkVertical(getPreviousPlayerArray())||checkDiagonal(getPreviousPlayerArray())
    ) {
            return true;
        } else {
            return false;
        }
    }
    
   
   
    
    const play = (index)=>{
        if(player1){
            if(gameBoardArr[index]!=='O'||gameBoardArr[index]!=='X'){
                gameBoardArr[index] = currentPlayer.getPlayingPiece();
                
                if(currentPlayer.getPlayingPiece() == player1.getPlayingPiece()){
                    currentPlayer = player2;
                }else {
                    currentPlayer = player1;
                }
                // console.log([1,2,3]==[1,2,3]);
                // console.log(gameBoardArr.filter((element)=>{
                //     return element;
                // }).length);;
            }
        }else{
            if(gameBoardArr[index]!=='O'||gameBoardArr[index]!=='X'){
                gameBoardArr[index] = currentPlayer.getPlayingPiece();
                
                if(currentPlayer.getPlayingPiece() == humanMark.getPlayingPiece()){
                    currentPlayer = aiMark;
                }else {
                    currentPlayer = humanMark;
                }
                // console.log([1,2,3]==[1,2,3]);
                // console.log(gameBoardArr.filter((element)=>{
                //     return element;
                // }).length);;
            }
        }
        
    }
    
    

    return {mainBoard,play,playAI,getcurrentPlayer,gameBoardArr,setAiMarker,getPreviousPlayer,checkIfWinnerFound,getPreviousPlayerArray, createGameBoard}
})();

gameBoard.createGameBoard();
displayController.refresh(gameBoard.gameBoardArr);


chooseX.addEventListener('click',event=>{
    chooseX.classList.add('choice');
    chooseO.classList.remove('choice');
    gameBoard.createGameBoard();
    gameBoard.setAiMarker('X');
})
chooseO.addEventListener('click',event=>{
    chooseO.classList.add('choice');
    chooseX.classList.remove('choice');
    gameBoard.createGameBoard();
    gameBoard.setAiMarker('O');
    gameBoard.playAI()
   
})

opponentselect.addEventListener('change',(event)=>{
    if(opponentselect.value =='Vs'){
        gameBoard.createGameBoard();
        chooseO.style.display='none';
        chooseX.style.display= 'none';
    }else if(opponentselect.value=='AI'){
        gameBoard.createGameBoard();
        chooseO.style.display='block';
        chooseX.style.display='block';
    }
// console.log(opponentselect.value);
})

restartbutton.addEventListener('click',(event)=>{
    gameBoard.createGameBoard();
})

decision.addEventListener('click',(event)=>{
    decision.style.display = 'none';
    playbox.style.filter = 'none';
    gameBoard.createGameBoard()
})
mainBoard.addEventListener('click',(event)=>{

        if(!opponentselect.value == ''){
            if(Array.from(event.target.classList).includes('boxes')){
                gameBoard.play(event.target.getAttribute('id').split("-")[1]);
                // console.log(gameBoard.getPreviousPlayerArray())
                // console.log(gameBoard.gameBoardArr
            //         .filter((element)=>{
                    
            //         return element;
            //  }).length
            )
                if(gameBoard.checkIfWinnerFound(gameBoard.getPreviousPlayerArray())){
                    decision.style.display='flex';
                    playbox.style.cssText= `filter: blur(3px);-webkit-filter: blur(3px);`
                    winner.textContent = `${gameBoard.getPreviousPlayer().getPlayingPiece()}
                    is the Winner`;
                }else if(gameBoard.gameBoardArr.filter((element)=>{
                    
                        return element;
                 }).length == gameBoard.gameBoardArr.length){
                     decision.style.display = 'flex';
                    playbox.style.cssText= `filter: blur(3px);-webkit-filter: blur(3px);`
                    winner.textContent = `Draw`;
                };
                displayController.refresh(gameBoard.gameBoardArr);
                // console.log(event.target.getAttribute('id').split("-")[1]);
            }
        }

        if(opponentselect.value=='AI'){
            gameBoard.playAI()
        }
        
    
    
    // console.log(Array.from(event.target.classList));
})
