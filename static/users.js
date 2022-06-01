

function logInUser() {

    username = $( "#username" ).val();
    password = $( "#password" ).val();

    // posts to the server, logs in the user, and then hides and unhides certain parts of the page
    $.post('/login', {username:username, password:password}, function(data) {
        if(data.loggedIn) {
            loggedInUser = username;
            console.log(loggedInUser);
            $( "#user_header" ).attr("hidden", true);
            $( "#log_out_btn" ).attr("hidden", false);
            $( "#try_again_text" ).attr("hidden", true);
        } else {
            
            $( "#try_again_text" ).attr("hidden", false);

        }
    }, "json");

}

// hides the instruction window
function hideInstructions() {
    $( "#instr" ).attr("hidden", true);
}

// used with the share button to copy a string to the clipboard
function shareResult(){
    //in order to copy to clipboard without using a secure https website (which our aws site is not),
    //we had to find a workaround. Our thinking was inspired by:
    //https://stackoverflow.com/questions/51805395/navigator-clipboard-is-undefined
    
    let temp = document.createElement("textarea");
    document.body.appendChild(temp);
    temp.value = document.getElementById("sharable_result").textContent + ". Play yourself at: http://ec2-54-173-71-44.compute-1.amazonaws.com:3456/";
    temp.select();
    document.execCommand("copy");
    document.body.removeChild(temp);
    document.getElementById("share_btn").innerHTML = "COPIED";

}

function registerUser() {

    username = $( "#new_username" ).val();
    password = $( "#new_password" ).val();

    // posts to the server, logs in the user, and then hides and unhides certain parts of the page
    $.post('/register', {username:username, password:password}, function(data) {
        if(data.registered) {
            loggedInUser = username;
            console.log(loggedInUser);
            $( "#user_header" ).attr("hidden", true);
            $( "#log_out_btn" ).attr("hidden", false);
            $( "#try_again_text" ).attr("hidden", true);
        } else {
            
            $( "#try_again_text" ).attr("hidden", false);

        }
    }, "json");

}

// logs out the user and adjusts the page
function logOut() {
    
    console.log(loggedInUser);
    loggedInUser = null;
    console.log(loggedInUser);
    $( "#user_header" ).attr("hidden", false);
    $( "#log_out_btn" ).attr("hidden", true);

}