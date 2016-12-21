var gameBoard = [
    [0, 0, 0, 0, 0, 0, 0], 
    [0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0]
];
var turn = 0;

function sleep (time) {
  return new Promise((resolve) => setTimeout(resolve, time));
}

function coordinatesToPos(y, x) {
    return "" + x + "" + y;
}

function updateBoard() {
    for (var i = 0; i < 6; i++) {
        for (var x = 0; x < 7; x++) {
            if (gameBoard[i][x] == 1) {
                var pos = coordinatesToPos(i, x);
                $("#" + pos).html("&#x25C9;");
                $("#" + pos).css("color", "#3498DB");
            } else if (gameBoard[i][x] == 2) {
                var pos = coordinatesToPos(i, x);
                $("#" + pos).html("&#x25C9;");
                $("#" + pos).css("color", "#E74C3C");
            }
        }
    }
}

function dropPiece(x, piece) {
    if (gameBoard[0][x] != 0) {
        return false;
    }
    
    for (var i = 0; i < 5; i++) {
        if (gameBoard[i + 1][x] != 0) {
            gameBoard[i][x] = piece;
            updateBoard();
            return true;
        }
    }
    gameBoard[5][x] = piece;
    updateBoard();
    
    return true;
}

function checkWin() {
    var winner = 0;
    
    // Check left to right win
    for (var y = 0; y < 6; y++) {
        for (var x = 0; x < 4; x++) {
            var piece = gameBoard[y][x];
            if (piece != 0) {
                if (gameBoard[y][x + 1] == piece && gameBoard[y][x + 2] == piece && gameBoard[y][x + 3] == piece) {
                    winner = piece;
                }
            }
        }
    }
    
    // Check top to bottom win
    if (winner == 0) {
        for (var y = 0; y < 3; y++) {
            for (var x = 0; x < 7; x++) {
                var piece = gameBoard[y][x];
                if (piece != 0) {
                    if (gameBoard[y + 1][x] == piece && gameBoard[y + 2][x] == piece && gameBoard[y + 3][x] == piece) {
                        winner = piece;
                    }
                }
            }
        }
    }
    
    // Check top left to bottom right win
    if (winner == 0) {
        for (var y = 0; y < 3; y++) {
            for (var x = 0; x < 4; x++) {
                var piece = gameBoard[y][x];
                if (piece != 0) {
                    if (gameBoard[y + 1][x + 1] == piece && gameBoard[y + 2][x + 2] == piece && gameBoard[y + 3][x + 3] == piece) {
                        winner = piece;
                    }
                }
            }
        }
    }
    
    // Check bottom left to top right win
    if (winner == 0) {
        for (var y = 0; y < 3; y++) {
            for (var x = 3; x < 7; x++) {
                var piece = gameBoard[y][x];
                if (piece != 0) {
                    if (gameBoard[y + 1][x - 1] == piece && gameBoard[y + 2][x - 2] == piece && gameBoard[y + 3][x - 3] == piece) {
                        winner = piece;
                    }
                }
            }
        }
    }
    
    if (winner != 0) {        
        $("#pageWrapper").css("pointer-events", "none");
        $(".piece").css("background-color", (winner == 2) ? "#F5B7B1" : "#AED6F1");
        
        sleep(500).then(() => {
            $("#winner").html((winner == 2 ? "Red, " : "Blue, ") + "you win!");
            primeWinner();
        });
    }
    
    if (checkFullBoard()) {
        $("#pageWrapper").css("pointer-events", "none");
    
        sleep(500).then(() => {
            $("#winner").html("Board full!");
            primeWinner();
        });
    }
}

function resetGame() {
    gameBoard = [
        [0, 0, 0, 0, 0, 0, 0], 
        [0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0]
    ];
    
    $("#pageWrapper").css("pointer-events", "auto");
    $(".piece").css("background-color", "white");
    
    $("#displayWinner").fadeOut();
    $("#pageWrapper").css({
        "filter" : "",
        "transition" : ".3s" 
    });
    turn = 0;
    
    $(".piece").html("");
    $(".piece").removeAttr("color");
    $(".piece").removeAttr("background-color");
}

function primeWinner() {
    $("#pageWrapper").css({
        "filter" : "blur(3px)",
        "transition" : ".3s" 
    });
    $("#displayWinner").fadeIn();
}

function checkFullBoard() {
    for (var y = 0; y < 6; y++) {
        for (var x = 0; x < 7; x++) {
            if (gameBoard[y][x] == 0) {
                return false;
            }
        }
    }
    
    return true;
}

function highlightRow(x, color) {
    for (var y = 0; y < 6; y++) {
        $("#" + x + "" + y).css("background-color", color);
    }
}

$(document).ready(function() {   
    $(document).on("contextmenu", function() {
        return false;
    });
    
    $("#displayWinner").hide();
    $(".holder").css("color", "#D5D8DC");
    
    $(".holder").hover(function() {
        $(this).html("&#x25C9;");
        
        if (turn == 0) {
            $(this).css("color", "#3498DB");
            highlightRow(parseInt($(this).attr('id')), "#D6EAF8");
        } else {
            $(this).css("color", "#E74C3C");
            highlightRow(parseInt($(this).attr('id')), "#FADBD8");
        }
    }, function() {
        $(this).html(parseInt($(this).attr("id")) + 1);
        $(this).css("color", "#D5D8DC");
        $(".piece").css("background-color", "white");
    });
    
    $(".holder").mousedown(function() {
        if (dropPiece(parseInt($(this).attr('id')), turn + 1)) {
            turn = 1 - turn;
        } else {
            // Row full, display message
        }
    });
    
    $(".holder").mouseup(function() {
        checkWin();
        
        $(this).mouseleave().mouseenter();
        
    });
});