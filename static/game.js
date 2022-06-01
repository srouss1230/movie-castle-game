

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