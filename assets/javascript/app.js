$(function () {
    // PsudoCode
    // First Create HTML
    // Check to see how many connections are on page
    // Create players object
    // Allow player one to log in, and create player one object (name, losses, wins) display what player they are
    // Allow player two to log in, and create player two object (name, losses, wins) display what player they are
    // Turn indicator object is created, shows who's turn it is

    // Player one selects options, get stored in player one object under choice
    // player two selects options, get sorted in player two object under choice

    // logic selects winner, counts wins/losses in plyer objects, shows outcome in middle window


    // player can add message in chat, it will display in message board
    // if player leaves game message board will show disconnect message

    // Create a variable to reference the database
    //------------

    var db = firebase.database();
    var connections = db.ref("/connections");
    var connected = db.ref(".info/connected");
    var chats = db.ref("chat");

    //------------
    var con, name;
    var playerOne = null;
    var playerTwo = null;
    var playerOneObj = {
        "name": " ",
        "number": 0,
        "losses": 0,
        "wins": 0,
        "ties": 0,
        "turn": " ",
        "choice": "x",
    }
    var playerTwoObj = {
        "name": " ",
        "number": 0,
        "losses": 0,
        "wins": 0,
        "ties": 0,
        "turn": " ",
        "choice": "x",
    }
    //------------
    var choice;
    var choiceText;
    var move1;
    var move2;
    var move1Text;
    var move2Text;
    var playerOneName;
    var playerTwoName;
    var playerOneWins = 0;
    var playerOneLosses = 0;
    var ties = 0;
    var imageNum1;
    var imageNum2;
    //------------
    var showImage;
    var count = -1;

    //------------------------------------------------
    $('#playerAlert').hide()
    $('#playerCount').hide();
    $('#playerTurn').hide();
    $("#options1").hide();
    //------------------------------------------------
    //Check to see how many connections are on page
    //------------------------------------------------
    // When the client's connection state changes...
    connected.on("value", function (snapshot) {
        // If they are connected..
        if (snapshot.val()) {
            // Add user to the connections list.
            var con = connections.push(true);
            // Remove user from the connection list when they disconnect.
            con.onDisconnect().remove();
        }
    });
    // When first loaded or when the connections list changes...
    connections.once("value", function (snapshot) {
        // console.log(Object.keys(snapshot.val()));
        // console.log(Object.keys(snapshot.val()).indexOf('1'));
        // console.log(Object.keys(snapshot.val()).indexOf('2'));
        // console.log(playerOneObj.number);
        // console.log(playerTwoObj.number);
        // Check to see how many connections there are and assign player numbers
        if (Object.keys(snapshot.val()).indexOf('1') === -1) {
            playerOneObj.number = 1;
            playerTwoObj.number = 2;
        } else if (Object.keys(snapshot.val()).indexOf('2') === -1) {
            playerOneObj.number = '2';
            playerTwoObj.number = '1';
        }
        // console.log(playerOneObj);
        // console.log(playerTwoObj);
        // console.log(playerOneObj.number);
        // console.log(playerTwoObj.number);
        if (playerOneObj.number !== '0') {
            con = connections.child(playerOneObj.number);
            con.set(playerOneObj);
            con.onDisconnect().remove();
            // console.log(con);
        }
        else {
            $('#playerNameForm').hide()
            $('#playerAlert').show()
        }
        // console.log(Object.keys(snapshot.val()));
        // console.log(snapshot.val());

        // console.log(Object.keys(snapshot.val()).indexOf('1'));
        // console.log(Object.keys(snapshot.val()).indexOf('2'));

        // Display the viewer count in the html.
        // The number of online users is the number of children in the connections list.
    });
    //------------------------------------------------

    connections.on("value", function (snapshot) {
        // When player 1 is connected
        if (con) {
            playerOne = snapshot.val()[playerOneObj.number];
            playerTwo = snapshot.val()[playerTwoObj.number];
            if (snapshot.val()[playerOneObj.number].turn === "Done" && snapshot.val()[playerTwoObj.number].turn === "Done") {
                console.log("Are you crazy");
                playerOne = snapshot.val()[playerOneObj.number];
                playerTwo = snapshot.val()[playerTwoObj.number];
                playerOneName = playerOne.name;
                playerTwoName = playerTwo.name;
                move1 = playerOne.choice;
                move2 = playerTwo.choice;
                move1Text = playerOne.choiceText;
                move2Text = playerTwo.choiceText;
                DOMFunctions.showMove2();
                DOMFunctions.showPlayerTwoInfo();
                gameLogic();
                con.update({
                    wins: playerOneWins,
                    losses: playerOneLosses,
                    ties: ties,
                    turn: "Ready"
                })
                DOMFunctions.scoreBoard1();
                setTimeout(DOMFunctions.nextGame, 5000);
            }

        }
    });

    chats.remove();

    chats.on("child_added", function (childsnapshot) {
        if (childsnapshot.val()) {
            DOMFunctions.showChats(childsnapshot);
        }
    });

    //------------------------------------------------

    //------------------------------------------------
    // DOM Section
    //------------------------------------------------
    var DOMFunctions = {
        //---------------------
        joinGame: function () {
            $('#playerNameForm').hide();
            $('#playerCount').show();
            $('#playerWelcome').text("Welcome " + name);
            $('#playerOneName').text(name);
        },
        //---------------------
        showPlayerTwoInfo: function () {
            $('#playerTwoName').text(playerTwo.name);
        },
        //---------------------
        showMove1: function () {
            // console.log(move1);

            switch (choice) {
                case "r":
                    imageNum1 = 0;
                    break;
                case "p":
                    imageNum1 = 1;
                    break;
                case "s":
                    imageNum1 = 2;
                    break;
                case "l":
                    imageNum1 = 3;
                    break;
                case "v":
                    imageNum1 = 4;
                    break;
                case "p":
                    imageNum1 = 5;
            }
            // console.log(imageNum1);

            $("#playerOneChoice").text(choiceText);
            $("#options1").hide();
            $("#choice1Img").html('<img  src="' + images.image[imageNum1] + '" alt = "' + images.alt[imageNum1] + '" class="rpslsp" id="' + images.Id[imageNum1] + '">');
            DOMFunctions.scoreBoard1();
        },
        //---------------------
        showMove2: function () {
            switch (move2) {
                case "r":
                    imageNum2 = 0;
                    break;
                case "p":
                    imageNum2 = 1;
                    break;
                case "s":
                    imageNum2 = 2;
                    break;
                case "l":
                    imageNum2 = 3;
                    break;
                case "v":
                    imageNum2 = 4;
                    break;
                case "p":
                    imageNum2 = 5;
            }
            $("#playerTwoChoice").text(move2Text);
            $(".startImg").hide();
            $("#rpsImage").hide();
            $("#choice2Img").html('<img  src="' + images.image[imageNum2] + '" alt = "' + images.alt[imageNum2] + '" class="rpslsp" id="' + images.Id[imageNum2] + '">');
        },
        //---------------------
        scoreBoard1: function () {
            $(".playerOneStats").text("Wins:  " + playerOneWins + " Losses:  " + playerOneLosses + " Ties:  " + ties);
        },
        //---------------------
        rotateImages: function () {
            $("#rpsImage").html('<img  src="' + images.image[count] + '" alt = "' + images.alt[count] + '" class="rpslsp" id="' + images.Id[count] + '">');
        },
        nextImage: function () {
            setTimeout(DOMFunctions.rotateImages, 500);
            // console.log(count);
            if (count === images.image.length - 1) {
                count = -1;
            }
            count++;
        },
        //---------------------
        nextGame: function () {
            console.log("hello");
            $("#playerOneChoice").empty();
            $("#playerTwoChoice").empty();
            $("#choice1Img").empty();
            $("#choice2Img").empty();
            $("#options1").show();
            $("#rpsImage").show();
            move1 = null;
            move2 = null;
            DOMFunctions.scoreBoard1();
        },
        //---------------------
        showChats: function (snap) {
            var chatMessage = snap.val();

            var chatDiv = $('<div class="chatMessage">');
            chatDiv.html(
                '<span class="sender">' + chatMessage.sender +
                '</span>: ' + chatMessage.message);
            $("#messageBox").prepend(chatDiv)
        }
        //---------------------

    }
    //------------------------------------------------

    //------------------------------------------------
    var images = {
        image: [
            "./assets/images/rock.jpg",
            "./assets/images/paper.jpg",
            "./assets/images/scissors.jpg",
            "./assets/images/lizard.jpg",
            "./assets/images/spock.jpg"],
        alt: [
            "rock",
            "paper",
            "scissors",
            "lizard",
            "spock"],
        Id: [
            "rock",
            "paper",
            "scissors",
            "lizard",
            "spock"]
    }
    //------------------------------------------------
    // Game logic to determine winner of each round
    function gameLogic() {
        // ********* Rock
        if ((move1 === "r") && (move2 == "s")) {
            $("#messageOutcome").text(playerOneName + " selects  [" + move1Text + "]  " + playerTwoName + " selects  [" + move2Text + "]                 " + playerOneName + " Wins ...  Rock crushes Scissors");
            playerOneWins++;
        }
        else if ((move1 === "r") && (move2 == "l")) {
            $("#messageOutcome").text(playerOneName + " selects  [" + move1Text + "]  " + playerTwoName + " selects  [" + move2Text + "]                 " + playerOneName + " Wins ...  Rock crushes Lizard")
            playerOneWins++;
        }
        // ********* Papper
        else if ((move1 === "p") && (move2 == "r")) {
            $("#messageOutcome").text(playerOneName + " selects  [" + move1Text + "]  " + playerTwoName + " selects  [" + move2Text + "]                 " + playerOneName + " Wins  ...  Paper covers Rock");
            playerOneWins++;
        }
        else if ((move1 === "p") && (move2 == "v")) {
            $("#messageOutcome").text(playerOneName + " selects  [" + move1Text + "]  " + playerTwoName + " selects  [" + move2Text + "]                 " + playerOneName + " Wins  ...  Paper disproves Spock")
            playerOneWins++;
        }
        // ********* Scissors
        else if ((move1 === "s") && (move2 == "p")) {
            $("#messageOutcome").text(playerOneName + " selects  [" + move1Text + "]  " + playerTwoName + " selects  [" + move2Text + "]                  " + playerOneName + " Wins  ...  Scissors cuts Paper")
            playerOneWins++;
        }
        else if ((move1 === "s") && (move2 == "l")) {
            $("#messageOutcome").text(playerOneName + " selects  [" + move1Text + "]  " + playerTwoName + " selects  [" + move2Text + "]                  " + playerOneName + " Wins ...  Scissors decapitates Lizard");
            playerOneWins++;
        }
        // ********* Lizard         
        else if ((move1 === "l") && (move2 == "v")) {
            $("#messageOutcome").text(playerOneName + " selects  [" + move1Text + "]  " + playerTwoName + " selects  [" + move2Text + "]                  " + playerOneName + " Wins  ...  Lizard poisons Spock");
            playerOneWins++;
        }
        else if ((move1 === "l") && (move2 == "p")) {
            $("#messageOutcome").text(playerOneName + " selects  [" + move1Text + "]  " + playerTwoName + " selects  [" + move2Text + "]                  " + playerOneName + " Wins  ...  Lizard eats paper");
            playerOneWins++;
        }
        // ********* Spock
        else if ((move1 === "v") && (move2 == "s")) {
            $("#messageOutcome").text(playerOneName + " selects  [" + move1Text + "]  " + playerTwoName + " selects  [" + move2Text + "]                  " + playerOneName + " Wins  ...  Spock smashes Scissors");

            playerOneWins++;
        }
        else if ((move1 === "v") && (move2 == "r")) {
            $("#messageOutcome").text(playerOneName + " selects  [" + move1Text + "]  " + playerTwoName + " selects  [" + move2Text + "]                  " + playerOneName + " Wins  ...  Spock vaporizes Rock");

            playerOneWins++;
        }
        // *****************
        // *****************
        // *****************
        // *****************
        // ********* Rock
        else if ((move2 === "r") && (move1 == "s")) {
            $("#messageOutcome").text(playerOneName + " selects  [" + move1Text + "]  " + playerTwoName + " selects  [" + move2Text + "]                  " + playerTwoName + " Wins  ...  Rock crushes Scissors");

            playerOneLosses++;
        }
        else if ((move2 === "r") && (move1 == "l")) {
            $("#messageOutcome").text(playerOneName + " selects  [" + move1Text + "]  " + playerTwoName + " selects  [" + move2Text + "]                  " + playerTwoName + " Wins ...  Rock crushes Lizard");

            playerOneLosses++;
        }
        // ********* Paper

        else if ((move2 === "p") && (move1 == "r")) {
            $("#messageOutcome").text(playerOneName + " selects  [" + move1Text + "]  " + playerTwoName + " selects  [" + move2Text + "]                  " + playerTwoName + " Wins  ...  Paper covers Rock");

            playerOneLosses++;
        }
        else if ((move2 === "p") && (move1 == "v")) {
            $("#messageOutcome").text(playerOneName + " selects  [" + move1Text + "]  " + playerTwoName + " selects  [" + move2Text + "]                  " + playerTwoName + " Wins  ...  Paper disproves Spock");

            playerOneLosses++;
        }
        // ********* Scissors
        else if ((move2 === "s") && (move1 == "p")) {
            $("#messageOutcome").text(playerOneName + " selects  [" + move1Text + "]  " + playerTwoName + " selects  [" + move2Text + "]                  " + playerTwoName + " Wins  ...  Scissors cuts Paper");

            playerOneLosses++;
        }
        else if ((move2 === "s") && (move1 == "l")) {
            $("#messageOutcome").text(playerOneName + " selects  [" + move1Text + "]  " + playerTwoName + " selects  [" + move2Text + "]                  " + playerTwoName + " Wins ...  Scissors decapitates Lizard");

        }
        // ********* Lizard

        else if ((move2 === "l") && (move1 == "v")) {
            $("#messageOutcome").text(playerOneName + " selects  [" + move1Text + "]  " + playerTwoName + " selects  [" + move2Text + "]                 " + playerTwoName + " Wins  ...  Lizard poisons Spock");

            playerOneLosses++;
        }
        else if ((move2 === "l") && (move1 == "p")) {
            $("#messageOutcome").text(playerOneName + " selects  [" + move1Text + "]  " + playerTwoName + " selects  [" + move2Text + "]                  " + playerTwoName + " Wins  ...  Lizard eats paper");

            playerOneLosses++;
        }
        // ********* Spock
        else if ((move2 === "v") && (move1 == "s")) {
            $("#messageOutcome").text("" + playerTwoName + " Wins  ...  Spock smashes Scissors");

            playerOneLosses++;
        }
        else if ((move2 === "v") && (move1 == "r")) {
            $("#messageOutcome").text(playerOneName + " selects  [" + move1Text + "]  " + playerTwoName + " selects  [" + move2Text + "]                  " + playerTwoName + " Wins  ...  Spock vaporizes Rock");

            playerOneLosses++;
        }
        // ***************** TIE
        else if (move1 === move2) {
            $("#messageOutcome").text(playerOneName + " selects  [" + move1Text + "]  " + playerTwoName + " selects  [" + move2Text + "]                  Its a Tie!");

            ties++;
        }
    }
    //------------------------------------------------
    // // Name capture Button Click Player One
    $("#addName").on("click", function () {
        // Don't refresh the page!
        event.preventDefault();
        name = $("#nameInput").val().trim();
        playerOneObj.name = name;
        if (playerOneObj.name.length > 0) {
            con.update({
                name: playerOneObj.name
            });
            // DOM
        }
        DOMFunctions.joinGame();
    });
    //------------------------------------------------\
    //------------------------------------------------

    $("#addName").on("click", function (e) {
        e.preventDefault()
        showImage = setInterval(DOMFunctions.nextImage, 1000);
        $(".startImg").hide();
        $("#options1").show();
        $('#playerTurn').show();
    });


    $(".choice").on("click", function () {
        choice = $(this).attr("value");
        choiceText = $(this).text();
        DOMFunctions.showMove1();
        con.update({
            choice: choice,
            choiceText: choiceText,
            turn: "Done"
        });
    });

    $("#sendButton").on("click", function () {
        // Don't refresh the page!
        event.preventDefault();
        var message = $("#messageInput");
        var chatObj = {
            message: message.val(),
            timestamp: firebase.database.ServerValue.TIMESTAMP,
            sender: playerOne.name,
        };
        chats.push(chatObj);
        message.val(" ");
    })


});