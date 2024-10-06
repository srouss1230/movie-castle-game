

function submitGuess() {

    guess = $( "#guess_input" ).val();

    // post to the server with the inputted guess and then either win the game, move on to the next guess, or lose the game
    $.post('/guess', {guess:guess}, function(data) {
        $( "#guess" + guessNum ).html("<p> " + guess + " </p>");
        if(data.correct) {
            $( "#guess" + guessNum ).attr("style", "color: #20ff20"); // make the guess green
            winGame();
        } else {
            $( "#guess" + guessNum ).attr("style", "color: #ff1111"); // make the guess red
            if(guessNum < 6) {
                // move on to the next guess
                guessNum++;
                unhideGuess(guessNum);
                revealHint(guessNum);

            } else {
                loseGame();
            }
        }
    }, "json");
    $("#guess_input").val("");
}

// reveal the hint number num
function revealHint(num) {
    $( "#hint_content" + num ).attr("style", false);
}

// reveal guess number num
function unhideGuess(num) {
    $( "#guess" + num ).attr("hidden", false);
}

// do everything needed to win the game
function winGame() {

    for(let i = 2; i <= 6; i++) {
        revealHint(i);
    }
    updateStatsInLS();
    $( "#guess_input" ).attr("hidden", true);
    $( "#search_btn" ).attr("hidden", true);
    $( "#end_screen" ).attr("hidden", false);
    $( "#win_screen" ).attr("hidden", false);
    if(guessNum == 1) {
        $( "#win_screen" ).html("You won in " + guessNum + " try!");
    } else {
        $( "#win_screen" ).html("You won in " + guessNum + " tries!");
    }
    document.getElementById("sharable_result").innerHTML = ("I won CAST.LE in " + guessNum + " tries");
    $( "#movie_title" ).attr("hidden", false);

    updateStats(true);
}

// do everything needed when the game is lost
function loseGame() {

    $( "#guess_input" ).attr("hidden", true);
    $( "#search_btn" ).attr("hidden", true);
    $( "#end_screen" ).attr("hidden", false);
    $( "#loss_screen" ).attr("hidden", false);
    $( "#movie_title" ).attr("hidden", false);
    document.getElementById("sharable_result").innerHTML = "I did not win CAST.LE today :(";

    updateStats(false);
}

// updates the text in the timer div
function updateTimer() {

    now = new Date();
    hours = 23 - now.getHours();
    if(hours < 10) {
        hours = "0" + hours;
    }
    minutes = 59 - now.getMinutes();
    if(minutes < 10) {
        minutes = "0" + minutes;
    }
    seconds = 59 - now.getSeconds();
    if(seconds < 10) {
        seconds = "0" + seconds;
    }

    $( "#timer" ).html( hours + ":" + minutes + ":" + seconds );

}

function updateStatsInLS(){
    if(guessNum == 1)
    {
        incWinsIn1();
    }
    else if (guessNum==2)
    {
        incWinsIn2();
    }
    else if (guessNum==3)
    {
        incWinsIn3();
    }
    else if (guessNum==4)
    {
        incWinsIn4();
    }
    else if (guessNum==5)
    {
        incWinsIn5();
    }
    else if (guessNum==6)
    {
        incWinsIn6();
    }
    else
    {
        // alert("ERROR: No guessNum");
    }
}

function updateStats(gameWon) {

    // update the user stats if user is set
    if(loggedInUser != null) {
        $( "#stats" ).attr("hidden", false);

        // posts to the server with all necessary variables
        $.post('/updateStats', {username:loggedInUser, gameWon:gameWon, guessNum:guessNum}, function(data) {

            $( "#stats_header" ).html(loggedInUser + "\'s stats: ");
            winrate = parseInt((parseFloat(data.wins) / parseFloat(data.plays) * 100.0));
            $( "#stats_stats" ).html(data.wins + " wins in " + data.plays + " plays with a winrate of " + winrate + "%");

            $( "#winNum1" ).html(data.winsIn1);
            $( "#winNum2" ).html(data.winsIn2);
            $( "#winNum3" ).html(data.winsIn3);
            $( "#winNum4" ).html(data.winsIn4);
            $( "#winNum5" ).html(data.winsIn5);
            $( "#winNum6" ).html(data.winsIn6);
        }, "json");
    }

}

function showMovieDetails(){
    $( "#movieDetails" ).attr("hidden", false);
    $( "#openMovieDetails" ).attr("hidden", true);
}
function hideMovieDetails(){
    $( "#movieDetails" ).attr("hidden", true);
    $( "#openMovieDetails" ).attr("hidden", false);
}

function showTMDBDetails(){
    $( "#TMDBDetails" ).attr("hidden", false);
    $( "#openTMDBDetails" ).attr("hidden", true);
}

function hideTMDBDetails(){
    $( "#TMDBDetails" ).attr("hidden", true);
    $( "#openTMDBDetails" ).attr("hidden", false);
}
//penm,

function getWinsIn1(){
    try
    {
        let test = window.localStorage.getItem('winsIn1StorageStat');
    }
    catch(err)
    {
        // alert("wins in 1 was null. Initializing to one.");
        let name = "winsIn1StorageStat";
        let val = 1;
        window.localStorage.setItem(name, val);
    }
    let winsIn1 = window.localStorage.getItem('winsIn1StorageStat');
    return winsIn1;

}
function incWinsIn1(){
    let winsIn1 = getWinsIn1();
    if (winsIn1 != null)
    // alert("old val: " + winsIn1);
    window.localStorage.setItem("winsIn1StorageStat",++winsIn1);
    // alert("new val: " + winsIn1);  
}

function getWinsIn2(){
    try
    {
        let test = window.localStorage.getItem('winsIn2StorageStat');
    }
    catch(err)
    {
        // alert("wins in 2 was null. Initializing to one.");
        let name = "winsIn2StorageStat";
        let val = 1;
        window.localStorage.setItem(name, val);
    }
    let winsIn2 = window.localStorage.getItem('winsIn2StorageStat');
    return winsIn2;

}
function incWinsIn2(){
    let winsIn2 = getWinsIn2();
    if (winsIn2 != null)
    // alert("old val: " + winsIn2);
    window.localStorage.setItem("winsIn1StorageStat",++winsIn2);
    // alert("new val: " + winsIn2);  
}

function getWinsIn3(){
    try
    {
        let test = window.localStorage.getItem('winsIn3StorageStat');
    }
    catch(err)
    {
        // alert("wins in 3 was null. Initializing to one.");
        let name = "winsIn3StorageStat";
        let val = 1;
        window.localStorage.setItem(name, val);
    }
    let winsIn3 = window.localStorage.getItem('winsIn3StorageStat');
    return winsIn3;

}
function incWinsIn3(){
    let winsIn3 = getWinsIn3();
    if (winsIn3 != null)
    // alert("old val: " + winsIn3);
    window.localStorage.setItem("winsIn3StorageStat",++winsIn3);
    // alert("new val: " + winsIn3);  
}
function getWinsIn4(){
    try
    {
        let test = window.localStorage.getItem('winsIn4StorageStat');
    }
    catch(err)
    {
        // alert("wins in 4 was null. Initializing to one.");
        let name = "winsIn4StorageStat";
        let val = 1;
        window.localStorage.setItem(name, val);
    }
    let winsIn4 = window.localStorage.getItem('winsIn4StorageStat');
    return winsIn4;

}
function incWinsIn4(){
    let winsIn4 = getWinsIn4();
    if (winsIn4 != null)
    // alert("old val: " + winsIn4);
    window.localStorage.setItem("winsIn4StorageStat",++winsIn4);
    // alert("new val: " + winsIn4);  
}
function getWinsIn5(){
    try
    {
        let test = window.localStorage.getItem('winsIn5StorageStat');
    }
    catch(err)
    {
        // alert("wins in 5 was null. Initializing to one.");
        let name = "winsIn5StorageStat";
        let val = 1;
        window.localStorage.setItem(name, val);
    }
    let winsIn5 = window.localStorage.getItem('winsIn5StorageStat');
    return winsIn5;

}
function incWinsIn5(){
    let winsIn5 = getWinsIn5();
    if (winsIn5 != null)
    // alert("old val: " + winsIn5);
    window.localStorage.setItem("winsIn5StorageStat",++winsIn5);
    // alert("new val: " + winsIn5);  
}
function getWinsIn6(){
    try
    {
        let test = window.localStorage.getItem('winsIn6StorageStat');
    }
    catch(err)
    {
        // alert("wins in 6 was null. Initializing to one.");
        let name = "winsIn6StorageStat";
        let val = 1;
        window.localStorage.setItem(name, val);
    }
    let winsIn6 = window.localStorage.getItem('winsIn6StorageStat');
    return winsIn6;

}
function incWinsIn6(){
    let winsIn6 = getWinsIn6();
    if (winsIn6 != null)
    // alert("old val: " + winsIn6);
    window.localStorage.setItem("winsIn1StorageStat",++winsIn6);
    // alert("new val: " + winsIn6);  
}
alertWinsIn1= function()
{
    alert("wins in 1: " + getWinsIn1());
}
alertWinsIn2 = function()
{
    alert("wins in 2: " + getWinsIn2());
}
alertWinsIn3 = function()
{
    alert("wins in 3: " + getWinsIn3());
}
alertWinsIn4 = function()
{
    alert("wins in 4: " + getWinsIn4());
}
alertWinsIn5 = function()
{
    alert("wins in 5: " + getWinsIn5());
}
alertWinsIn6 = function()
{
    alert("wins in 6: " + getWinsIn6());
}


// NEW STUFF FOR TESTING

// Code to change which image you see
changeToImage1 = function(){

    // Hide the other images and show the chosen one
    $( "#image1" ).attr("hidden", false);
    $( "#image2" ).attr("hidden", true);
    $( "#image3" ).attr("hidden", true);
    $( "#image4" ).attr("hidden", true);
    $( "#image5" ).attr("hidden", true);
    $( "#image6" ).attr("hidden", true);

    // Hide the other image names and show the chosen one
    $("#image1Name").attr("hidden", false);
    $("#image2Name").attr("hidden", true);
    $("#image3Name").attr("hidden", true);
    $("#image4Name").attr("hidden", true);
    $("#image5Name").attr("hidden", true);
    $("#image6Name").attr("hidden", true);
}
changeToImage2 = function(){

    // Hide the other images and show the chosen one
    $( "#image1" ).attr("hidden", true);
    $( "#image2" ).attr("hidden", false);
    $( "#image3" ).attr("hidden", true);
    $( "#image4" ).attr("hidden", true);
    $( "#image5" ).attr("hidden", true);
    $( "#image6" ).attr("hidden", true);

    // Hide the other image names and show the chosen one
    $("#image1Name").attr("hidden", true);
    $("#image2Name").attr("hidden", false);
    $("#image3Name").attr("hidden", true);
    $("#image4Name").attr("hidden", true);
    $("#image5Name").attr("hidden", true);
    $("#image6Name").attr("hidden", true);

}
changeToImage3 = function(){

    // Hide the other images and show the chosen one
    $( "#image1" ).attr("hidden", true);
    $( "#image2" ).attr("hidden", true);
    $( "#image3" ).attr("hidden", false);
    $( "#image4" ).attr("hidden", true);
    $( "#image5" ).attr("hidden", true);
    $( "#image6" ).attr("hidden", true);

    // Hide the other image names and show the chosen one
    $("#image1Name").attr("hidden", true);
    $("#image2Name").attr("hidden", true);
    $("#image3Name").attr("hidden", false);
    $("#image4Name").attr("hidden", true);
    $("#image5Name").attr("hidden", true);
    $("#image6Name").attr("hidden", true);
}
changeToImage4 = function(){

    // Hide the other images and show the chosen one
    $( "#image1" ).attr("hidden", true);
    $( "#image2" ).attr("hidden", true);
    $( "#image3" ).attr("hidden", true);
    $( "#image4" ).attr("hidden", false);
    $( "#image5" ).attr("hidden", true);
    $( "#image6" ).attr("hidden", true);

    // Hide the other image names and show the chosen one
    $("#image1Name").attr("hidden", true);
    $("#image2Name").attr("hidden", true);
    $("#image3Name").attr("hidden", true);
    $("#image4Name").attr("hidden", false);
    $("#image5Name").attr("hidden", true);
    $("#image6Name").attr("hidden", true);
}
changeToImage5 = function(){

    // Hide the other images and show the chosen one
    $( "#image1" ).attr("hidden", true);
    $( "#image2" ).attr("hidden", true);
    $( "#image3" ).attr("hidden", true);
    $( "#image4" ).attr("hidden", true);
    $( "#image5" ).attr("hidden", false);
    $( "#image6" ).attr("hidden", true);

    // Hide the other image names and show the chosen one
    $("#image1Name").attr("hidden", true);
    $("#image2Name").attr("hidden", true);
    $("#image3Name").attr("hidden", true);
    $("#image4Name").attr("hidden", true);
    $("#image5Name").attr("hidden", false);
    $("#image6Name").attr("hidden", true);

}
changeToImage6 = function(){

    // Hide the other images and show the chosen one
    $( "#image1" ).attr("hidden", true);
    $( "#image2" ).attr("hidden", true);
    $( "#image3" ).attr("hidden", true);
    $( "#image4" ).attr("hidden", true);
    $( "#image5" ).attr("hidden", true);
    $( "#image6" ).attr("hidden", false);

    // Hide the other image names and show the chosen one
    $("#image1Name").attr("hidden", true);
    $("#image2Name").attr("hidden", true);
    $("#image3Name").attr("hidden", true);
    $("#image4Name").attr("hidden", true);
    $("#image5Name").attr("hidden", true);
    $("#image6Name").attr("hidden", false);
}

function guessActor() {

    guess = $( "#guess_input" ).val();

    // post to the server with the inputted guess and then either win the game, move on to the next guess, or lose the game
    $.post('/guess', {guess:guess}, function(data) {
        $( "#guess_" + guessNum ).html("<p> " + guess + " </p>");
        if(data.correct) {
            $( "#guess_" + guessNum ).attr("style", "color: #20ff20"); // make the guess green
            winGame();
        } else {
            $( "#guess_" + guessNum ).attr("style", "color: #ff1111"); // make the guess red
            if(guessNum < 6) {
                // move on to the next guess
                guessNum++;
                unhideGuess(guessNum);
                revealHint(guessNum);

            } else {
                loseGame();
            }
        }
    }, "json");
    $("#guess_input").val("");
}

function unhideGuess(num) {
    $( "#guess_" + num ).attr("hidden", false);
}

function revealHint(num) {
    $( "#changeImgBtn" + num ).attr("hidden", false);
    $("#changeIdgBtn" + num).trigger("click");
}