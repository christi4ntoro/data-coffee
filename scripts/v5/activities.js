//Specific activities logic and config
function Activities() {
    var _self = this;

    var dragtotal = 0;
    var timers = [];

    this.checkActivitie = function(){
        var option = $(this).data("activitie");
        switch(option){
            case "x-answer":
                _self.checkAnswer();
            break;
            case "x-dragAB":
                _self.checkdragAB();
            break;
            case "x-dragTwo":
                _self.checkdragTwo();
            break;
            case "x-sortable":
                _self.sortVerifiy();
            break;
        }
    }

    //Option multiple unique response

    this.answer = function() {
        var $x_question = $(this).closest('.x-question');
        var $x_verificar = $("#x-content").find('.x-check_activitie');

        $x_question.find('.x-answer').removeClass('correct').removeClass('notcorrect').removeClass('qselected');

        $(this).addClass('qselected');

        var correct = $(".qselected").data('correct');

        if (correct == 'y')
            $(".qselected").addClass('correct');
        else
            $(".qselected").addClass('notcorrect');

        if($x_verificar.length == 0)
            _self.checkAnswer();      
    }

    //verificar

    this.checkAnswer = function(){
        main.stopMedia();
        var feed = '';
        var $x_question = $(".qselected").closest('.x-question');
        var $x_panel = $x_question.find('.x-feedback_panel');
        var correct = $(".qselected").data('correct');

        if (correct == 'y'){
            feed = $x_question.find('.x-feedback_good').html();
            if($("body").find('#correct_sound').length > 0)
                main.stopMedia();
                main.audioPlay("#correct_sound");
        }
        else{
            feed = $x_question.find('.x-feedback_wrong').html();
            if($("body").find('#incorrect_sound').length > 0)
                main.stopMedia();
                main.audioPlay("#incorrect_sound");
        }

        $x_panel.fadeOut(function () {
            $x_panel.html(feed);
            $x_panel.fadeIn(function () {
                _self.xkroll($x_panel);
                // if (correct == 'y') {
                //     if($(".x-button-back").length == 0)
                //         _self.showNextButton();
                // }
            });
        });
    }

    //Accordeon

    this.accordionEntry = function(e) {
        e.preventDefault();

        $(this).addClass('viewed');

        if ($(this).next('.x-accordion_content').is(':visible')) {
            return;
        }

        $('.x-accordion_content').slideUp();
        main.audioPlay("#button_sound");

        $(this).next('.x-accordion_content').slideDown(function () {
            if ($('.x-accordion_entry').length == $('.viewed').length) {
                _self.activityFinished();
            }
        });

        e.stopImmediatePropagation();
    }

    //hover

    this.xHover = function() {
        $('.x-hover').hover(_self.hoverIn, _self.hoverOut);
    }

    this.hoverIn = function() {
        $(this).addClass('x-related');
        $('.x-hover_panel').html($('#' + $(this).data('hover')).html());
        
        if ($('.x-hover').length == $('.x-related').length) {
            if($(".x-button-back").length == 0)
                $(".x-next").show();
        }

    }

    this.hoverOut = function() {
        $('.x-hover_panel').html('');
    }

    //Color In

    this.colorEntry = function() {
        var el = $(this);
        $(this).addClass('viewed');
        $(".x-box-color span").each(function(i,e){
            if($(this).data("color") == el.data("color"))
                $(this).addClass($(this).data("color"));
        });

        if ($('.x-click-color').length == $('.viewed').length) {
            _self.activityFinished();
        }
    }

    this.fadeEntry = function() {
        // $(this).addClass('viewed');
        var $entry = $(this);
        $entry.find('.x-fade_icon').fadeOut(function () {
            $entry.css('cursor', 'default');
            $entry.find('.x-fade_content').addClass('viewedOK');
            main.audioPlay("#button_sound");
            $entry.find('.x-fade_content').fadeIn(function () {
                if ($('.x-fade_entry').length == $('.viewedOK').length) {
                    _self.activityFinished();
                }
            });
        });
    }

    //Click In
    this.clickIn = function() {
        var target = $(this).data('click');
        var $panel = $('.x-click_panel');

        $(this).addClass('viewed');
        $(this).removeClass('x-click');

        $panel.append($('#' + target).html());
        $panel.fadeIn(function () {
            if ($('.bttn').length == $('.viewed').length) {
                _self.activityFinished();
            }
        });
    }

    this.clickInNormal = function() {
        var target = $(this).data('click');
        var $panel = $('.x-click_panel');

        $(this).addClass('viewed');
        main.audioPlay("#button_sound");

        $panel.fadeOut(function () {
            $panel.html($('#' + target).html());
            $panel.fadeIn(function () {
                if ($('.x-click-normal').length == $('.viewed').length) {
                    _self.activityFinished();
                }
            });
        });
    }

    this.clickInList = function() {
        var target = $(this).data('click');
        var $panel = $('.x-click_panel');

        $(this).addClass('viewed');

        $panel.fadeOut(function () {
            $panel.html($('#' + target).html());
            $panel.fadeIn(function () {
                if ($('.x-click').length == $('.viewed').length) {
                    _self.activityFinished();
                }
            });
        });
    }

    //Drag & Drop
    this.xDragGroup = function() {

        dragtotal = $('.x-drag').length;

        $('.x-drag_a').draggable({
            revert: true,
            start: _self.initDrag,
            drag: _self.dragging,
            stop: _self.dragStopped,
            zIndex: 1000,
            tolerance: 'touch'
        });
       $('.x-drop_a').droppable({
            accept: '.x-drag_a',
            drop: _self.droppedOne,
            hoverClass: "x-drophover",
            tolerance: 'touch'
        });
        $('.x-drag_b').draggable({
            revert: true,
            start: _self.initDrag,
            drag: _self.dragging,
            zIndex: 1000,
            stop: _self.dragStopped
        });
        $('.x-drop_b').droppable({
            accept: '.x-drag_b',
            drop: _self.droppedOne,
            hoverClass: "x-drophover",
            tolerance: 'touch'
        });
        $('.x-drag_c').draggable({
            revert: true,
            start: _self.initDrag,
            drag: _self.dragging,
            zIndex: 1000,
            stop: _self.dragStopped
        });
        $('.x-drop_c').droppable({
            accept: '.x-drag_c',
            drop: _self.droppedOne,
            hoverClass: "x-drophover",
            tolerance: 'touch'
        });
        $('.x-drag_d').draggable({
            revert: true,
            start: _self.initDrag,
            drag: _self.dragging,
            zIndex: 1000,
            stop: _self.dragStopped
        });
        $('.x-drop_d').droppable({
            accept: '.x-drag_d',
            drop: _self.droppedOne,
            hoverClass: "x-drophover",
            tolerance: 'touch'
        });
        $('.x-drag_e').draggable({
            revert: true,
            start: _self.initDrag,
            drag: _self.dragging,
            zIndex: 1000,
            stop: _self.dragStopped
        });
        $('.x-drop_e').droppable({
            accept: '.x-drag_e',
            drop: _self.droppedOne,
            hoverClass: "x-drophover",
            tolerance: 'touch'
        });
        $('.x-drag_f').draggable({
            revert: true,
            start: _self.initDrag,
            drag: _self.dragging,
            zIndex: 1000,
            stop: _self.dragStopped
        });
        $('.x-drop_f').droppable({
            accept: '.x-drag_f',
            drop: _self.droppedOne,
            hoverClass: "x-drophover",
            tolerance: 'touch'
        });
        $('.x-drag_g').draggable({
            revert: true,
            start: _self.initDrag,
            drag: _self.dragging,
            zIndex: 1000,
            stop: _self.dragStopped
        });
        $('.x-drop_g').droppable({
            accept: '.x-drag_g',
            drop: _self.droppedOne,
            hoverClass: "x-drophover",
            tolerance: 'touch'
        });
        $('.x-drag_h').draggable({
            revert: true,
            start: _self.initDrag,
            drag: _self.dragging,
            zIndex: 1000,
            stop: _self.dragStopped
        });
        $('.x-drop_h').droppable({
            accept: '.x-drag_h',
            drop: _self.droppedOne,
            hoverClass: "x-drophover",
            tolerance: 'touch'
        });
    }

    this.xDragOne = function() {
        $('.x-drag').draggable({
            revert: true,
            drag: _self.draggingOne,
            stop: _self.dragStoppedOne,
            zIndex: 1000
        });
        $('.x-drop').droppable({
            accept: '.x-drag',
            drop: _self.droppedOne,
            hoverClass: "x-drophover",
            tolerance: 'pointer'
        });
    }

    this.xDragTwo = function() {
        $('.x-drag').draggable({
            revert: true,
            drag: _self.draggingTwo,
            stop: _self.dragStoppedTwo,
            zIndex: 1000
        });
        $('.x-drop').droppable({
            accept: '.x-drag',
            drop: _self.droppedTwo,
            hoverClass: "x-drophover",
            tolerance: 'pointer'
        });
    }

    this.xDragMany = function() {
        $('.x-drag').draggable({
            revert: true,
            drag: _self.draggingMany,
            stop: _self.dragStoppedMany,
            zIndex: 1000
        });
        $('.x-drop').droppable({
            accept: '.x-drag',
            drop: _self.droppedMany,
            hoverClass: "x-drophover",
            tolerance: 'pointer'
        });
    }

    this.xDragManyTwo = function() {
        $(".x-drag_a").draggable({
            revert: true
        });
        $('.x-drop_a').droppable({
            accept: '.x-drag_a',
            drop: _self.droppedManyTwo,
            tolerance: 'pointer'
        });

        $(".x-drag_b").draggable({
            revert: true
        });
        $('.x-drop_b').droppable({
            accept: '.x-drag_b',
            drop: _self.droppedManyTwo,
            tolerance: 'pointer'
        });
    }

    this.initDrag = function(event, ui) {
        main.stopMedia();
        if($("body").find('#slide-paper_sound').length > 0)
            main.audioPlay("#slide-paper_sound");
    }

    this.draggingOne = function(event, ui) {
        ui.helper.addClass('indrag');
    }

    this.dragStoppedOne = function(event, ui) {
        ui.helper.removeClass('indrag');
    }

    this.droppedOne = function(event, ui) {
        var $source = $(ui.draggable);
        var $target = $(this);

        if ($source.data('option') == $target.data('option')) {
            $target.addClass('x-related');

            $target.html($target.text().split('_').join(''));
            $target.prepend('<strong>' + $source.html() + '</strong> ');
            $target.removeClass('isdroppable');

            $source.hide();

            $('#correct_feed').fadeIn(function () {
                var tid2 = setTimeout(function () {
                    $('#correct_feed').fadeOut();
                }, 1000);
                timers.push(tid2);
            });
        } else {
            $('#error_feed').fadeIn();
        }

        if ($('.x-drag').length > $('.x-drop').length) {
            if ($('.x-drop').length == $('.x-related').length) {
                $('#correct_feed').hide();
                $('#error_feed').hide();
                _self.activityFinished();
            }
        } else {
            if ($('.x-drag').length == $('.x-related').length) {
                $('#correct_feed').hide();
                $('#error_feed').hide();
                _self.activityFinished();
            }
        }
    }

    this.draggingTwo = function(event, ui) {
        ui.helper.addClass('indrag');
    }

    this.dragStoppedTwo = function(event, ui) {
        ui.helper.removeClass('indrag');
    }

    this.droppedTwo = function(event, ui) {
        var $source = $(ui.draggable);
        var $target = $(this);

        $target.html($target.text().split('_').join(''));
        $target.prepend('<strong>' + $source.html() + '</strong> ');
        $target.removeClass('isdroppable');
        $source.hide();

        if ($source.data('option') == $target.data('option'))
            $target.addClass('x-related');       
    }

    this.checkdragTwo = function(){
        if ($('.x-drop').length == $('.x-related').length)
            $('.x-feedback_panel').html($('.x-feedback_good').html());
        else
            $('.x-feedback_panel').html($('.x-feedback_wrong').html());
        $('.x-feedback_panel').fadeIn();

    }

    this.dragging = function(event, ui) {
        ui.helper.addClass('indrag');
    }

    this.dragStopped = function(event, ui) {
        ui.helper.removeClass('indrag');
    }

    this.droppedAB = function(event, ui) {
        var $x_verificar = $("#x-content").find('.x-check_activitie');

        var ab_selector = '';
        if ($(ui.draggable).hasClass('x-drag_a')) {
            ab_selector = '.x-drop_a';
        } else if ($(ui.draggable).hasClass('x-drag_b')) {
            ab_selector = '.x-drop_b';
        } else if ($(ui.draggable).hasClass('x-drag_c')) {
            ab_selector = '.x-drop_c';
        } else if ($(ui.draggable).hasClass('x-drag_d')) {
            ab_selector = '.x-drop_d';
        }

        $(ab_selector).append($(ui.draggable));

        $(ui.draggable).position({of: $(this), my: 'left top', at: 'left top'});

        $(ui.draggable).draggable('disable');

        main.stopMedia();
        if($("body").find('#tap-double_sound').length > 0)
            main.audioPlay("#tap-double_sound");

        dragtotal--;

        if (dragtotal == 0 && $x_verificar.length == 0) {
            _self.activityFinished();
        }
    }

    this.draggingMany = function(event, ui) {
        ui.helper.addClass('indrag');
    }

    this.dragStoppedMany = function(event, ui) {
        ui.helper.removeClass('indrag');
    }

    this.droppedMany = function(event, ui) {
        var $source = $(ui.draggable);
        var $target = $(this);
    
        if ($('.x-drop').children().length < parseInt($target.data("size"))) {
            $target.append($(ui.draggable));
            if($('.x-drop').children().length == parseInt($target.data("size"))){
                $('.x-drag').draggable('disable');
                switch($(".x-drop>div.x-drag_a").length){
                    case parseInt($target.data("size")):
                        $('#feedback_01').fadeIn();
                    break;
                    case (parseInt($target.data("size"))-1):
                        $('#feedback_02').fadeIn();
                    break;
                    case 1:
                        $('#feedback_03').fadeIn();
                    break;
                    default:
                        $('#feedback_04').fadeIn();
                    break;
                }
            }
        }
    }

    this.droppedManyTwo = function(event, ui) {
        var $source = $(ui.draggable);
        var $target = $(this);
    
        var feed = $(ui.draggable).data("option");
        $target.append($(ui.draggable));

        $(ui.draggable).addClass('match'); 

        //disable drag
        $(ui.draggable).draggable('disable');
        $(ui.draggable).removeClass('x-drag');

        if ($(".dragword").length == $(".match").length) {
            $("#final_feed").show();
        }

    }

    this.xSort = function() {
        //sort
        $('.x-sortable').sortable({
            placeholder: "draOrder-highlight",
            start: _self.sortStarted,
            stop: _self.sortStopped
        });
        $( ".x-sortable" ).disableSelection();
    }

    this.sortStarted = function(event, ui) {
        ui.helper.addClass('orderdragging');

        $('.x-sortable').find('div').each(function (index, item) {
            $(item).removeClass('ordergood').removeClass('orderbad');
        });
    }

    this.sortStopped = function(event, ui) {
        $('.x-sortable').find('div').each(function (index, item) {
            $(item).removeClass('orderdragging');
        });
    }

    this.sortVerifiy = function() {
        var total = 0;
        var correct = 0;
        $('.x-sortable').find('div').each(function (index, item) {
            total++;
            $(item).removeClass('orderdragging');

            if (index + 1 == $(item).data('order')) {
                //correct
                $(item).addClass('ordergood').removeClass('orderbad');
                correct++;
            } else {
                $(item).removeClass('ordergood').addClass('orderbad');
            }
        });

        if (total == correct)
            $('.x-feedback_panel').html($('.x-feedback_good').html());
        else
            $('.x-feedback_panel').html($('.x-feedback_wrong').html());
        $('.x-feedback_panel').fadeIn();
    }

    this.checkdragAB = function(){
        _self.activityFinished();
    }

    //Generales
    this.activityFinished = function() {
        var tid = setTimeout(function () {
            $("#final_feed").fadeIn();
            // $('#final_feed').slideDown(function () {
            //     $("#final_feed").fadeIn();
            //     _self.xkroll('#final_feed');
            //     if($(".x-button-back").length == 0)
            //         _self.showNextButton();
            // });
        }, 1000);

        timers.push(tid);
    }

    this.xkroll = function(what) {
        if (scrollEnabled) {
            $.scrollTo(what, 125, {axis: 'y', offset: 100});
        }
    }

    this.showNextButton = function() {
        if (hideNextEnabled) {
            var tid = setTimeout(function () {
                // $('.x-next').fadeIn();
            }, 3000);
            timers.push(tid);
        }
    }

    this.CloseFeed = function() {
        $("#x-feedback_panel").html("");
        $("#final_feed").hide();

        if ($(".match").length == $(".x-close_feed").length) {
            $("#final_feed").fadeIn();
        }
    }

    this.TryAgain = function() {
        $("#x-feedback_panel").html("");
        $("#final_feed").hide();
        $(".x-feedback_wrong").hide();
        $(".x-answer").removeClass("qselected");
        main.stopMedia();
        main.audioPlay("#closepopup_sound");
    }

    // Drag FeedBack
    this.xDragFeedback = function() {
        $('.x-drag').draggable({
            revert: true,
            drag: _self.draggingFeed,
            stop: _self.dragStoppedFeed,
            zIndex: 1000
        });
        $('.x-drop').droppable({
            accept: '.x-drag',
            drop: _self.droppedFeed,
            hoverClass: "x-drophover",
            tolerance: 'pointer'
        });
    }
    this.draggingFeed = function(event, ui) {
        ui.helper.addClass('indrag');
    }

    this.dragStoppedFeed = function(event, ui) {
        ui.helper.removeClass('indrag');
    }
    this.droppedFeed = function(event, ui) {
        var $source = $(ui.draggable);
        var $target = $(this);

        if ($source.data('option') == $target.data('option')) {
            $target.addClass('x-related');

            $target.html($target.text().split('_').join(''));
            $target.prepend($source.html());
            $target.removeClass('isdroppable');
            $target.addClass('x-okDrop dTag bgNone');

            $source.hide();

            var feed = $(ui.draggable).data("option");
            $(this).append($(ui.draggable));
            $(ui.draggable).addClass('match');
            $("#x-feedback_panel").html($("#feedback_" + feed).html());
            $("#x-feedback_panel").fadeIn();

            if($("body").find('#correct_sound').length > 0)
            main.stopMedia();
            main.audioPlay("#correct_sound");

            // $(document).on('click', '.x-close_feed', function () {
                if ($('.x-drag').length == $('.x-okDrop').length) {
                    // $(".x-next").fadeIn();
                    _self.activityFinished();
                }
            // });

        } else {
            main.stopMedia();
            main.audioPlay("#incorrect_sound");
        }
    }
    //END DragFeedBack
    
    //// DragPuzzle
    this.xDragPuzzle = function() {
        $('.x-drag').draggable({
            revert: true,
            drag: _self.draggingPuzzle,
            stop: _self.dragStoppedPuzzle,
            zIndex: 1000
        });
        $('.x-drop').droppable({
            accept: '.x-drag',
            drop: _self.droppedPuzzle,
            hoverClass: "x-drophover",
            tolerance: 'pointer'
        });
    }
    this.draggingPuzzle = function(event, ui) {
        ui.helper.addClass('indrag');
    }

    this.dragStoppedPuzzle = function(event, ui) {
        ui.helper.removeClass('indrag');
    }
    this.droppedPuzzle = function(event, ui) {
        var $source = $(ui.draggable);
        var $target = $(this);

        if ($source.data('option') == $target.data('option')) {
            $target.addClass('x-related');

            $target.html($target.text().split('_').join(''));
            $target.prepend($source.html());
            $target.removeClass('isdroppable');
            $target.addClass('x-okDrop dTag');

            $source.hide();

            var feed = $(ui.draggable).data("option");
            $(this).append($(ui.draggable));
            $(ui.draggable).addClass('match');
            $("#x-feedback_panel").html($("#feedback_" + feed).html());
            $("#x-feedback_panel").fadeIn();

            $(document).on('click', '.x-close_feed', function () {
                if ($('.x-drag').length == $('.x-okDrop').length) {
                    var t = setTimeout(function () {
                        $(".sc01").fadeIn();
                        $(".speech01").hide();
                        $(".speech02").addClass('disFlex');
                        course.stopActivity();
                    }, 1 * 1000);
                    timers.push(t);
                }
            });

        } else {
            main.stopMedia();
        }
    }

    //TOOLTIPBIG
    this.toolTipBig = function() {
        $('.x-zoneTT').tooltip({
            track: true,
            delay: 0,
            items: 'button',
            content: _self.getContentTT,
            open: _self.openTT
        });
    }

    this.getContentTT = function() {
        var $target = $(this);
        var $datatt = $target.data('tt');

        console.log($datatt);
        return $target.closest('.x-zoneTT').next('.x-infoTT').html();
    }

    this.openTT = function(event, ui) {
        $(this).addClass('viewed');

        if ($('.x-zoneTT').length == $('.viewed').length) {
            var t = setTimeout(function () {
                $('#final_feed').show();
            }, 8 * 1000);
            timers.push(t);
        }
    }
    // END
}