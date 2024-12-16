//Specific course logic and config
function Course(jsonCourse) {
    var _self = this;
    
    //Minimum passing score
    var scoreToPass = 0;
    
    var timers = [];
    
    var counters = [];
    
    //Content Transition
    this.transition = "fadeInLeft";
    
    //navigation //  false = libre //  true = progresiva
    this.navigation = true;
    
    this.mediaLocation = 'video/';
    
    this.afterViewLoaded = function (view) {
        //clear timers
        for (var i = 0; i < timers.length; i++) {
            clearTimeout(timers[i]);
        }
        
        var index = parseInt(view.substring(0, view.indexOf("/") + 1).replace("m", ""));
        
        // $('#breadcrumb').html('<h4 class="animated fadeInRight">'+main.getActualBreadCrumb()+'</h4>');
        
        $('#pagination').html(main.getActualPagination());
        
        $('.x-mission').text(main.getGoals());
        
        //username
        $(".x-username").html(xkorm.getUsername());
        
        var fnName = view.substring(view.indexOf("/") + 1, view.length);
        
        main.stopMedia();
        
        if($(".xk_video").length > 0) {
            main.videos();
        }
        
        if (_self[fnName] != undefined) {
            _self[fnName]();
        }
    };
    
    this.getScoreToPass = function () {
        return scoreToPass;
    };
    
    function scrollToDiv() {
        $('html, body').animate({
            scrollTop: $("#final_feed").offset().top
        }, 2000);
    }
    
    function showAll() {
        $(".dk-icon-menu").show();
        $(".dk-breadcrumb").show();
        $(".dk-progress").show();
        $("#progressBar").show();
    }
    
    // AUDIO LOOP
    function playInOut(id) {
        $(id).get(0).play();
    }
    
    // AUDIO LOOP
    function playActivity() {
        $('#audio_activity').get(0).play();
        $('#audio_activity').get(0).volume = 0.45;
    }
    
    function stopActivity() {
        $('#audio_activity').get(0).pause();
    }
    
    // HOLOGRAM
    function loadSVG() {
        $('.x-svg-holo').load('images/props/holopad.svg');
        
        var $xsvg = $(".x-svg").data("xsvg");
        $('.x-svg').load('images/' + $xsvg + '.svg', function(data){
            // M105
            $('#plano-btn').hide();
            
            $('#plano-btn').click(function(){
                location.href = "#m1_06";
                main.stopMedia();
                main.audioPlay("#click_sound");
            });
            
            // M106
            // $('#BRA, #but-axis02, #but-axis03, #but-axis04, #but-axis05, #but-axis06').hide();
            $('.x-m106').click(function(){
                var content = $(this).data('content');
                $(".x-emergente").load("contents/" + content + ".html", function(response, status){
                    if (status === 'success') {
                        $('.x-emergente').html(response);
                        $('.x-on_top_content').fadeIn();
                    }
                    else {
                        console.log('Se presentó un error');
                    }
                });
                
                $(this).attr("class", "x-m106 viewed");
                
                // CLOSEPOPUP
                $(document).on('click', '.x-on_top_close', function () {
                    if ($('.x-m106').length == $('.viewed').length) {
                        var t = setTimeout(function () {
                        }, 1 * 1000);
                        timers.push(t);
                    }
                });
                //
            });
            // --
        });
    }
    
    //SPECIFIC LOGIC FOR THIS COURSE SLIDES
    // Module 01
    this.m1_06 = function () {
        showAll();
        loadSVG();
        
        this.goTag = function () {
            var $tag = $(this).data("tag");
            
            if ($tag == "clk01") {
                $(".sc01").hide();
                main.audioPlay('#button_sound');
                
                $('#BRA, #but-axis02, #but-axis03, #but-axis04, #but-axis05, #but-axis06').show();
            }
        };
        
        $(document).on("click", ".x-goTag", this.goTag);
    }
}