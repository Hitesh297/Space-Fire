$(document).ready(function () {
    console.log("ready!");
    //declare variables
    var leftKeyPressed = false;
    var rightKeyPressed = false;
    var score = 0;
    var level = 1;
    var enableKeyPress = true;

    $('#enemy-container').css("animation-play-state", "paused");
    $('#end').css({ 'display': 'flex' });

    var enemyfirecount = 0;
    //fire from enemy after intervals
    function enemyfire() {
        enemyfirecount++;
        var id = "enemy-fire-" + enemyfirecount;
        $('body').append('<div id=' + id + ' class="enemy-fire" ></div>');
        var x1 = $('#enemy-container').offset().left + 31;
        var y1 = $('#enemy-container').offset().top;
        $('#' + id).css({ 'top': y1 });
        $('#' + id).css({ 'left': x1 });
    };

    // clearInterval(enemyfire);

    //track key press events
    $(window).keydown(function (event) {
        if (enableKeyPress) {

            //enter key pressed
            //restart/start the game
            if (event.which == 13) {
                $('#enemy-container').css("animation-play-state", "running");
                $('#end').css({ 'display': 'none' });
                setInterval(enemyfire, 2025);
                score = 0;
                level = 1;
                $('#enemy-container').addClass('enemy-animation');
                $('.enemy-fire').remove();
            }
            //left arrow key press
            if (event.which == 37) {
                leftKeyPressed = true;
                $('#ship').css({ 'background-position': 'left' });
            }
            //right arrow key pressed
            if (event.which == 39) {
                $('#ship').css({ 'background-position': 'right' });
                rightKeyPressed = true;
            }
            //space bar is pessed
            if (event.which == 32) {
                var x1 = $('#ship-container').offset().left + 31;
                var y1 = $('#ship-container').offset().bottom;

                //create div to fire upwards
                $('body').append('<div id="shot"></div>');
                $('#shot').css({ 'bottom': y1 });
                $('#shot').css({ 'left': x1 });
                $('#shot').css({ 'display': 'block' });
                $('#shot').addClass('shot-animation');
                var shot = document.getElementById('shot');

                //remove shots after passed the screen
                shot.addEventListener('animationend', () => {
                    $('#shot').remove();
                });
            }
        }

    });

    //on key up center the spaceship image
    $(window).keyup(function (event) {
        if (event.which == 37 || event.which == 39) {
            $('#ship').css({ 'background-position': 'center' });
            leftKeyPressed = false;
            rightKeyPressed = false;
        }
    });

    //interval to check things in real time
    setInterval(function () {
        $('#score-count').html(score);
        $('#level-count').html(level);
        //check if enemy fire collided with player
        $(".enemy-fire").each(function (index) {
            if (collision($(this), $('#ship-container'))) {
                $('.enemy-fire').remove();
                console.log("Killed by enemy");
                $('#enemy-container').css("animation-play-state", "paused");
                $('#blast-ship').css({ 'display': 'block' });
                enableKeyPress = false;

                //timeout to remove blast animation
                setTimeout(function () {
                    $('#blast-ship').css({ 'display': 'none' });
                    $('.end-text-small').css({ 'display': 'none' });
                    $('#end').css({ 'display': 'flex' });
                    $('.end-text').html('You Lost!');
                    enableKeyPress = true;
                }, 1600);
            }
            // console.log( index + ": " + $( this ).offset().left );
        });

        //change ship position when buttom press is true
        if (rightKeyPressed || leftKeyPressed) {
            $('#ship-container').css({
                left: function (index, oldValue) {
                    return calculateNewValue(oldValue);
                }
            });
        }
        
        $('#ship-container').css({
            left: function (index, oldValue) {
                return calculateNewValue(oldValue);
            }
        });

        if ($('#enemy-container').length && $('#shot').length) {
            // console.log('Element found!');

            //check if the player shot the enemy
            if (collision($('#enemy-container'), $('#shot'))) {
                $('.enemy-fire').remove();
                $('#shot').remove();
                $('#enemy-container').css("animation-play-state", "paused");
                $('#blast').css({ 'display': 'block' });
                enableKeyPress = false;

                //remove blast animation after some time
                setTimeout(function () {
                    $('.enemy-fire').remove();
                    $('#blast').css({ 'display': 'none' });
                    $('#enemy-container').removeClass();
                    $('#enemy-container').css("animation-play-state", "running");
                    enableKeyPress = true;
                }, 1600);

                //upate score,level and restart
                setTimeout(function () {
                    score++;
                    level++;
                    if (level > 4) {
                        $('.end-text').html('You Win!');
                        $('.end-text-small').css({ 'display': 'none' });
                        $('#end').css({ 'display': 'flex' });
                        $('#enemy-container').css("animation-play-state", "paused");
                    }
                    $('#enemy-container').addClass('enemy-animation-level-' + level);
                    $('#score-count').html(score);
                    $('#level-count').html(level);
                }, 1700);



            }
        } else {
            // console.log('Element not found!');
        }
    }, 20);

    var maxValue = $('body').width() - $('#ship-container').width();

    // console.log(maxValue);

    //returns new position based on arrow key pressed
    function calculateNewValue(oldValue) {
        var newValue = parseInt(oldValue)
            - (leftKeyPressed ? 5 : 0)
            + (rightKeyPressed ? 5 : 0);
        return newValue < 0 ? 0 : newValue > maxValue ? maxValue : newValue;
    }

    //returns true if collision is detected between two div's
    function collision(div1, div2) {
        if (div1 != null && div2 != null) {
            var object1left = div1.offset().left;
            var object1top = div1.offset().top;
            var object1height = div1.outerHeight(true);
            var object1width = div1.outerWidth(true);
            var object1fromtop = object1top + object1height;
            var object1fromleft = object1left + object1width;
            var object2left = div2.offset().left;
            var object2top = div2.offset().top;
            var object2height = div2.outerHeight(true);
            var object2width = div2.outerWidth(true);
            var object2fromtop = object2top + object2height;
            var object2fromleft = object2left + object2width;
            // console.log(object1fromtop, object2top, object1top, object2fromtop, object1fromleft, object2left, object1left, object2fromleft);

            if (object1fromtop < object2top || object1top > object2fromtop || object1fromleft < object2left || object1left > object2fromleft) {

                return false;
            }
            // console.log('Colition detected');
            return true;
        }
        return false;

    }
});

