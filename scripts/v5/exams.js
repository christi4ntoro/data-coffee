function Exams() {
    var _self = this;

    var actualQuestion = 0;

    var inExam = false;

    var selected;
    var all;
    var scoreExam;

    this.buttons = function () {
        $(document).on("click", "#q-verify", _self.verifyQuestionClick);
        $(document).on("click", "#q-tryagain", _self.TryAgain);
        $(document).on("click", "#q-next", _self.nextQuestionClick);
        $(document).on("click", ".q-option", _self.selectOptionClick);
    };

    this.loadExam = function () {
        if(xkorm.api_loaded()){
            if (xkorm.getObjectiveScore(0) != "") {
                $("#examBox").hide();
                $("#q-verify").hide();

                $("#x-NoMoreTry").fadeIn( "slow", function() {
                    $("#x-NoMoreTry").find("#q-exam_score").text(xkorm.getObjectiveScore(0));
                    $(".x-next").show();
                    $(".x-previous").show();
                });

                return;
            }
        }
        else{
            if(scoreExam != undefined){
                $("#examBox").hide();
                $("#q-verify").hide();

                $("#x-NoMoreTry").fadeIn( "slow", function() {
                    $("#x-NoMoreTry").find("#q-exam_score").text(scoreExam);
                    $(".x-next").show();
                    $(".x-previous").show();
                });

                return;
            }
        }

        inExam = true;

        var $exam = $(".exam");

        all = [];
        var $questions = $exam.find(".q-question");

        for (var i = 0; i < $questions.length; i++) {
            var id = $($questions.get(i)).attr("id");
            all[i] = id;
        }

        //config questions
        if ($exam.data("random"))
            _self.shuffleArray(all);

        var discarded;

        selected = all.slice(0, parseInt($exam.data("questions")));
        
        discarded = all.slice(parseInt($exam.data("questions")), all.length);
        for (var i = 0; i < discarded.length; i++) {
            $("#" + discarded[i]).remove();
        }

        $("#" + selected[actualQuestion]).show();
    };

    this.inExam = function () {
        return inExam;
    };

    this.getPattern = function ($q) {
        var pattern = "";
        var type = $q.data("type");

        if (type == "choice") {
            $q.find(".q-option").each(function () {
                var $opt = $(this);
                if ($opt.hasClass("q-correct")) {
                    pattern = $opt.attr("id");
                }
            });
        }
        return pattern;
    };

    this.shuffleArray = function (array) {
        //Fisher-Yates (aka Knuth) Shuffle.
        var currentIndex = array.length, temporaryValue, randomIndex;

        // While there remain elements to shuffle...
        while (0 !== currentIndex) {
            // Pick a remaining element...
            randomIndex = Math.floor(Math.random() * currentIndex);
            currentIndex -= 1;

            // And swap it with the current element.
            temporaryValue = array[currentIndex];
            array[currentIndex] = array[randomIndex];
            array[randomIndex] = temporaryValue;
        }

        return array;
    };

    this.verifyQuestionClick = function () {
        if(actualQuestion >= 0 && $("#" + selected[actualQuestion] + "> div.q-selected").length == 0)
            return
        var feed = '';
        var correct = $("#" + selected[actualQuestion] + "> div.q-selected").hasClass('q-correct');
        var feed_good = $("#" + selected[actualQuestion] + "> div div.x-body-feedback_good").html();
        var feed_wrong = $("#" + selected[actualQuestion] + "> div div.x-body-feedback_wrong").html();

        if (correct){
            $('#x-feedback_good').find(".x-content-feedback").html(feed_good);      
            feed = $('#x-feedback_good').html();
            if($("body").find('#correct_sound').length > 0)
                main.stopMedia();
                main.audioPlay("#correct_sound");
        }
        else{
            $('#x-feedback_wrong').find(".x-content-feedback").html(feed_wrong);
            feed = $('#x-feedback_wrong').html();
            if($("body").find('#incorrect_sound').length > 0)
                main.stopMedia();
                main.audioPlay("#incorrect_sound");
        }        

        $("#x-feedback_panel").fadeOut(function () {
            $("#x-feedback_panel").html(feed);
            $("#x-feedback_panel").fadeIn(function () {
                _self.xkroll($("#x-feedback_panel"));
            });
        });

    };

    this.nextQuestionClick = function () {
        
        $(".q-question").hide();
        $("#x-feedback_panel").html("");

        actualQuestion++;
        if(actualQuestion >= selected.length){
            _self.examFinished();
            return
        }

        $("#" + selected[actualQuestion]).show();
    };

    this.TryAgain = function() {
        $("#x-feedback_panel").html("");
        $(".q-option").removeClass("qselected");
    }

    this.xkroll = function(what) {
        if (scrollEnabled) {
            $.scrollTo(what, 125, {axis: 'y', offset: 100});
        }
    }

    this.examFinished = function () {
        inExam = false;

        $("#q-next").hide();
        $("#q-verify").hide();
        $(".x-next").fadeIn();

        _self.sendInteractions();
        $("#examBox").hide();

        if(xkorm.getObjectiveScore(0) >= 80 || scoreExam >= 80){
            $("#x-badgeYes").fadeIn( "slow", function() {
                if(xkorm.api_loaded())
                    $("#x-badgeYes").find("#q-exam_score").text(xkorm.getObjectiveScore(0));
                else
                    $("#x-badgeYes").find("#q-exam_score").text(scoreExam);

                main.activateGoal('geb01');
                main.audioPlay('#outro');

                $(".x-next").show();
                $(".x-previous").show();
            });   
        }
        else{
            $("#x-badgeNo").fadeIn( "slow", function() {
                if(xkorm.api_loaded())
                    $("#x-badgeNo").find("#q-exam_score").text(xkorm.getObjectiveScore(0));
                else
                    $("#x-badgeNo").find("#q-exam_score").text(scoreExam);

                $(".x-next").show();
                $(".x-previous").show();
            });
        }
    };

    this.sendInteractions = function () {
        var weight = 100 / $(".q-question").length;
        var correct = 0;

        $(".q-question").each(function (index, item) {
            var $question = $(item);
            var pattern = _self.getPattern($question);

            var response = $question.find(".q-option.q-selected").attr("id");
            var status = $question.find(".q-option.q-selected.q-correct").length == 1 ? "correct" : "wrong";

            if (status == "correct") {
                correct++;
            }

            xkorm.setInteraction(index, $question.attr("id"), $question.data("type"), weight, pattern, response, status);
        });

        var score = Math.round(weight * correct);
        scoreExam = score;
        xkorm.setObjectiveScore(0, score);
    };

    this.selectOptionClick = function () {
        $(this).parent(".q-question").find(".q-option").removeClass("q-selected");
        $(this).addClass("q-selected");
    };

    _self.buttons();
}