
function speak(str) {

    var msg = new SpeechSynthesisUtterance(str);

    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(msg);
}


function GameCntl($scope, $timeout) {
    $scope.right_indicator = false;
    $scope.wrong_indicator = false;
    $scope.number_right = 0;
    $scope.timeout = 0;

    $scope.mode = "+";
    $scope.max_x = 10;
    $scope.max_y = 10;

    $scope.setmode = function(m) {
        $scope.mode = m;
        $scope.next();
    }

    $scope.next = function() {
        $scope.timeout = 0;

        switch($scope.mode) {
            case "-":
                var x = Math.floor(Math.random() * $scope.max_x);
                var y = Math.floor(Math.random() * x);
                $scope.equation = x + " - " + y;
                $scope.equation_spoken = x + " minus " + y;
                $scope.answer = x - y;
                break;

            case "+":
            default:
                var x = Math.floor(Math.random() * $scope.max_x);
                var y = Math.floor(Math.random() * $scope.max_y);
                $scope.equation = x + " + " + y;
                $scope.equation_spoken = x + " plus " + y;
                $scope.answer = x + y;
                break;
        }

        $scope.resetclue();
    };

    $scope.resetclue = function() {
        $scope.timeout = 0;
        $scope.right_indicator = false;
        $scope.wrong_indicator = false;

        $scope.clue = "";
        for(i = 0; i < String($scope.answer).length; i++) {
            $scope.clue += "_";
        }

        speak($scope.equation_spoken);
    };

    $scope.keyup = function(e) {
        // If they already got it right, ignore input
        if($scope.right_indicator) {
            return;
        }

        c = String.fromCharCode(e.keyCode);

        // Ignore key presses outside of 0-9
        if(c < '0' || c > '9') {
            return;
        }

        // Replace the first _ in the clue with the key press
        $scope.clue = $scope.clue.replace("_", c);

        if($scope.clue == $scope.answer) {
            $scope.correct();
        } else if ($scope.clue.indexOf("_") == -1) {
            $scope.incorrect();
        } else {
            $timeout($scope.incorrect, 4000);
        }
    };

    $scope.correct = function() {

        $scope.number_right += 1;

        $scope.right_indicator = true;
        $scope.wrong_indicator = false;

        if($scope.timeout != 0) {
            $timeout.cancel($scope.timeout);
        }
        $scope.timeout = $timeout($scope.next, 2000);

        $('#jpId').jPlayer("play");
    };

    $scope.incorrect = function() {
        $scope.right_indicator = false;
        $scope.wrong_indicator = true;

        if($scope.timeout != 0) {
            $timeout.cancel($scope.timeout);
        }
        $scope.timeout = $timeout($scope.resetclue, 2000);

        speak("try again");
    };

    $scope.next();
}
