$(document).ready(mainReady);

var main;
var course;
var xkorm;
var activities;
var exams;
var aux_load = false;
var preload;
var secuenceSubModules = [];
var actualTheme = "theme00";
var baseImg;

//SCORM
var scorm = pipwerks.SCORM;
scorm.version = "1.2";

//true for show arrow on activity end
var hideNextEnabled = true;
//true for auto scroll
var scrollEnabled = false;

//diegodis
var progress = { //Objeto para alamcenar el progreso en temas y subtemas
    theme: 0,
    subtheme: 0,
    porcentajecal: 0,
    goals:[],
    submodules:[]
};

function mainReady() {

    if ($.browser.msie) {
        $('body').html($('#ie_msg').html());
        return;
    }

    xkorm = new Xkorm();
    exams = new Exams();    
    activities = new Activities();    
    course = new Course(jsonCourse);
    main = new Main();

    if (preload != null) {preload.close();}

    preload = new createjs.LoadQueue(true);
    preload.addEventListener("error", main.loadError);
    preload.addEventListener("progress", main.handleFileProgress);
    preload.addEventListener("fileload", main.handleFileLoad);
    preload.addEventListener("complete", main.loadComplete);
    preload.loadManifest(manifest_route);


//events     
//hash
$(window).bind("hashchange", function () {
//main.goToView(parseInt(location.hash.replace("#", "")));  
main.goToView(location.hash.replace("#", ""));

});

//call lmsfinish on exit
$(window).bind("unload", function () {
    main.endTime();
    main.finish();
});


//resize
$(window).bind("resize", function () {
    $('#x-content').css('height', ($(window).height()  - $('#progressBar').height()) + 'px');
});

$(document).on("click", ".x-next", main.goToNext);
$(document).on("click", ".x-previous", main.goToPrevious);
$(document).on("click", ".x-audio_effect", main.playAudioEffect);

$(document).on("click", ".x-template", main.template);

$(document).on('click', '.x-toc_title', main.showTocContents);

$(document).on("click", ".x-close_top_btn", main.closeTop);

//POP
$(document).on("click", ".x-open_pop", main.openPop);
$(document).on("click", ".x-close_pop", main.closePop);

//FANCY
$(document).on('click', '.x-on_top', main.onTop);
$(document).on('click', '.x-on_top_close', main.closeOnTop);
$(document).on('click', '.x-on_top_close_none', main.closeOnTop_none);
$(document).on('click', '.x-on_top_close_svg', main.closeOnTop_svg);
$(document).on('click', '.x-on_top_close_scene', main.closeOnTop_scene);
$(document).on('click', '.x-on_label_cont', main.labelCont);
$(document).on('click', '.x-on_label_cont input', main.cargaCont);

//JUMP
$(document).on("click", ".x-jump", main.jump);
$(document).on("click", ".x-visited", main.visited);

// TABS
$(document).on("click", ".x-tabs", main.openTab);

/* Eventos de teclado */
$(document).keydown(function(e){
    if(aux_load){
        switch (e.keyCode) {
            case 37:
            if($(".x-previous").css('display') == 'block')
                main.goToPrevious();
            break;
            case 39:
            if($(".x-next").css('display') == 'block')
                main.goToNext();
            break;
        }
    }
});

/* Activities */
$(document).on('click', '.x-answer', activities.answer);
//POP
$(document).on("click", ".x-close_feed", activities.CloseFeed);
//Try Again
$(document).on("click", ".x-try_again", activities.TryAgain);
//accordion
$(document).on('click', '.x-on-accordionTab', activities.accordionEntry);
//x-click
$(document).on('click', '.x-click', activities.clickIn);
$(document).on('click', '.x-click-normal', activities.clickInNormal);
$(document).on('click', '.x-click-list', activities.clickInList);
//fade
$(document).on('click', '.x-fade_entry', activities.fadeEntry);
//color
$(document).on('click', '.x-click-color', activities.colorEntry);
//verificar
$(document).on('click', '.x-check_activitie', activities.checkActivitie);


/*main.loadBase(function () {
main.initSCO();//init scorm
main.startTime();//start time count
main.loadStartMenu();//load menu
main.loadStartView();//load view
});*/




$(document).on('click', '.dk-icon-menu', openModal);

$(document).on('click', '.dk-menu-dialog-close', closeModal);





}


function openModal(){
    main.buildMenu();
    $(".dk-menu-dialog").show()
    main.stopMedia();
    main.audioPlay("#popup_sound");
}


function closeModal(){
    $(".dk-menu-dialog").hide()
    main.stopMedia();
    main.audioPlay("#closepopup_sound");
}





function Main() {

var _self = this;
//diegodis
var actualView = jsonCourse.modules[0].submodules[0].code;

var started = 0;

var aux_estado_item = "";
var aux_estado_peso = 0;

var index_title = 0;

this.handleFileProgress = function(event) {
    var porcentaje = preload.progress*100|0;
    var html = '<div class="c100 p'+porcentaje+' small"><span>'+porcentaje+'%</span><div class="slice"><div class="bar"></div><div class="fill"></div></div></div>';
    $(".preload").html(html);
}

this.loadComplete = function(event) {
    $(".preload").remove();
    _self.loadBase(function () {
_self.initSCO();//init scorm
_self.startTime();//start time count
_self.loadStartView();//load view
//diegodis
_self.buildGoals();// build initGoals
_self.buildSecuenceSubModules();
});
}

this.handleFileLoad = function(event){
/*console.log("A file has loaded of type: " + event.item.type);
switch(event.item.id){
case 'image1':

break;
case 'image2':

break;                  
}*/
}

this.loadError = function(evt) {
    console.log("Error!",evt.text);
}

this.initSCO = function () {

    if(xkorm.api_loaded())
        xkorm.lmsInitialize(progress);
    else
        xkorm.init(_self.generateJsonProgressSCORM());
};



this.loadStartView = function () {

    $('#x-content').css('height', ($(window).height() - $('#progressBar').height()) + 'px');
//outside the lms
if (xkorm.api_loaded()) {
    var loc = xkorm.getLocation().replace("location_", "")
    if (loc == "") {
        location.hash = "#"+jsonCourse.modules[0].submodules[0].code;
    } else {
        location.hash = "#" + loc;
    }
} else {
    if (location.hash == "") {
        location.hash = "#"+jsonCourse.modules[0].submodules[0].code;
    } else {
        _self.goToView(location.hash.replace("#", ""));
    }
}

_self.initbase(jsonCourse.modules[0].submodules[0].code);
};

this.initbase = function(hashloc){
    if(hashloc == "m0_01"){
        $(".dk-breadcrumb").hide();
        $(".dk-progress").hide();
        $("#progressBar").hide();
        // $(".x-next").hide();
    }
}

this.getActualView = function(){
    return index_title;
}

this.loadBase = function (callback) {

    $("body").load("templates/base.html", function(response, status){
        if (status === 'success') {
            $("#x-info, #x-toc").tooltip();
            callback();
        }
        else {
            console.log('Se presentó un error');
        }
    });
};

this.goToNext = function () {
//@diegodis
/*  if (actualView >= course.getJsonLengthSumbodules()) {
return;
}*/

_self.stopMedia();
_self.audioPlay("#click_sound");
course.transition = "fadeInRight";

//actualView++;
actualView = _self.nextToSubmoduleCode(actualView, "next");

location.hash = "#" + actualView;
};

this.goToPrevious = function () {
/*if (actualView <= 0) {
return;
}*/
_self.stopMedia();
_self.audioPlay("#click_sound");
course.transition = "fadeInLeft";

//actualView--;

actualView = _self.nextToSubmoduleCode(actualView , "prev");
location.hash = "#" + actualView;
};

this.goToView = function (code) {
    $(".x-next").show();


actualView = code;

if(code == jsonCourse.modules[0].submodules[0].code){
    $(".x-previous").hide();
}

if(code == jsonCourse.modules[jsonCourse.modules.length - 1].submodules[ jsonCourse.modules[jsonCourse.modules.length -1].submodules.length -1 ].code){
    $(".x-next").hide();
}


var key = _self.getSubmoduleByCode(code);



aux_load = false;

$("#x-content").load("contents/" + key + ".html", function(response, status){
    $('#x-content').hide();


    $(".dk-menu-dialog").hide();
    if (status === 'success') {
//set xkorm location
xkorm.setLocation("location_" + code);

if( xkorm.ab_initio )
    xkorm.updateData(_self.generateJsonProgressSCORM());

_self.updateProgress();

if( xkorm.resume ) 
    xkorm.updateData(_self.generateJsonProgressSCORM());


$('#x-content').removeClass().addClass(course.transition + ' animated').one('webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend', function(){
    $(this).removeClass();
    aux_load = true;
});

if ($(".exam").length > 0) {
    exams.loadExam();
}

$('#x-content').show();

//mark visited           
var item_menu_actual;
course.afterViewLoaded(key);
}
else {
    console.log('Se presentó un error');
}
});
};

this.updateProgress = function () {
    var viewed = 0;

//diegodis
//_self.updateJsonProgress(xkorm.getJsonSuspendData());
xkorm.loadJsonData();
_self.updateJsonProgress(xkorm.getJsonSuspendData());
if( xkorm.resume )
    _self.getSubmoduleByCode(actualView);

/*$(xkorm.getDataArray()).each(function (index, val) {
if (val == 1) {
viewed++;
}
});*/

var perc = Math.floor(_self.progressPercent());


var html = '<div class="c100 p'+perc+' small"><span>'+perc+'%</span><div class="slice"><div class="bar"></div><div class="fill"></div></div></div>';
$(".dk-progress").html(html);

//$("#x-perc_bar").progressbar({value: perc, max: 100});
//diegodis
var linea = Math.floor(((_self.getIndexSubmoduleByCode(actualView)) * 100)/secuenceSubModules.length);
$("#x-perc_bar").animate({width: linea + "%"}, 500);

//set status
if (perc == 100) {

xkorm.setLessonStatusCompleted("completed");
//done, check status
xkorm.setScore(xkorm.getObjectiveScore(0));
if (xkorm.getScore() >= course.getScoreToPass()) {
    xkorm.setLessonStatus("passed");
} else {
    xkorm.setLessonStatus("failed");
}

xkorm.setExit("");//normal exit
//commit on 100%
xkorm.commit();
}
else{
    xkorm.setLessonStatusCompleted("incomplete");
    xkorm.commit();
}
};

this.startTime = function () {
    started = new Date().getTime();
};

this.endTime = function () {
    var end = new Date().getTime();
    var time = end - started;
    var timeInSeconds = time / 1000;
    var timeInHours = Math.floor(timeInSeconds / 3600);
    var minutes = Math.floor(((timeInSeconds / 3600) - timeInHours) * 60);
    var h = "";
    var m = "";
    var s = "00";
    if (timeInHours < 10) {
        h = "0" + timeInHours;
    } else {
        h = new String(timeInHours);
    }

    if (minutes < 10) {
        m = "0" + minutes;
    } else {
        m = new String(minutes);
    }

    console.log(h + ":" + m + ":" + s);

    xkorm.setTime(h + ":" + m + ":" + s);
};

this.playAudioEffect = function () {
    new Audio("sounds/" + $(this).data("audio") + ".mp3").play();
};

this.finish = function () {
    xkorm.finish();
};

this.template = function () {
    if($(".x-emergente").length == 0)
        $("#x-content").append('<div class="x-emergente"></div>');
    $(".x-emergente").load("templates/"+$(this).data("template")+".html", function(response, status){
        if (status === 'success') {
            $('.x-emergente').html(response);
            $('.x-on_top_content').fadeIn();
            main.stopMedia();
            main.audioPlay("#popup_sound");
        }
        else {
            console.log('Se presentó un error');
        }
    });
};

this.showTocContents = function () {
    $(this).next(".x-module_contents").slideToggle();
};

this.closeTop = function () {
    $("#x-top_content").slideUp();
};

// POPUP
this.openPop = function () {
    $("#" + $(this).data("content")).show();
    $(this).addClass("viewed");
}

// VISITED
this.visited = function () {
    $(this).addClass("visited");
}


this.closePop = function () {
    $(".x-pop_message").hide();
    if ($(".viewed").length == $(".x-open_pop").length) {
        $("#final_feed").fadeIn();
        $(".x-next").fadeIn();
    }
}

// POPUP
this.openTab = function () {
    $(this).addClass("viewed");
    if ($(".viewed").length == $(".x-tabs").length) {
        var t = setTimeout(function () {
            $('#final_feed').show();
            $(".x-next").show();
            scrollToDiv();
        }, 5 * 1000);
        timers.push(t);
    }
}

function scrollToDiv() {
    $('html, body').animate({
        scrollTop: $("#final_feed").offset().top
    }, 2000);
}

//FANCY
this.onTop = function() {
    $(this).addClass('viewed');
    var content = $(this).data('content');

    $(".x-emergente").load("contents/" + content + ".html", function(response, status){
        if (status === 'success') {
            $('.x-emergente').html(response);
            $('.x-on_top_content').fadeIn();
            main.stopMedia();
            main.audioPlay("#popup_sound");

            if($(".xk_video").length > 0)
                main.videos();
        }
        else {
            console.log('Se presentó un error');
        }
    });        
}

this.closeOnTop = function() {
    $('.x-on_top_content').fadeOut(function () {
        $('.x-on_top_content').remove();
        main.stopMedia();
        main.audioPlay("#closepopup_sound");
    });

    if ($('.x-on_top').length == $('.viewed').length) {
        if($('#final_feed').length > 0){
            ($('#final_feed')).slideDown(2000, function () {
                // $(".x-next").show();
                main.stopMedia();
                main.audioPlay("#feed_sound");
            });
        }
        // else
            // $(".x-next").show();
    }
}

this.closeOnTop_svg = function() {
    $('.x-on_top_content').fadeOut(function () {
        $('.x-on_top_content').remove();
        main.stopMedia();
        main.audioPlay("#closepopup_sound");
    });
}

this.closeOnTop_none = function() {
    $('.x-on_top_content').fadeOut(function () {
        $('.x-on_top_content').remove();
        main.stopMedia();
        main.audioPlay("#closepopup_sound");
    });
}

this.closeOnTop_scene = function() {
    $('.x-on_top_content').fadeOut(function () {
        $('.x-on_top_content').remove();
        main.stopMedia();
        main.audioPlay("#closepopup_sound");
    });

    if ($('.x-on_top').length == $('.viewed').length) {
        $(".sc02").hide();
        $(".sc03").addClass('disFlex');
    }
}

//
this.labelCont = function(){
    $('label').removeClass('paginadorActual');
    $(this).addClass('paginadorActual');
}

this.cargaCont = function(){
    for(i=1; i<=$("#contenidosIn").children().length; i++){
        $(".cont" + i).hide();
    };
    $("." + this.id).show();
}

//Jump
this.jump = function () {
    if(!$(this).hasClass("dk-icon-bloqueado")){
        var pos = -1;
        var code = $(this).data("jump");
        location.href = "#" +code;
        main.stopMedia();
        main.audioPlay("#click_sound");
    }
};

// MULTIMEDIA //
// Videos
// Videos
this.videos = function(){
    $('.xk_video').each(function() {

        var $video = $(this);
        var w = $video.data('width');
        var h = $video.data('height');
        var name = $video.data('name');
        var auto = $video.data('autoplay');

        var jump = $video.data('jump');

        var autoplay = '';
        if (auto == 'y') {
            autoplay = 'autoplay';
        }

        var videoTag = '';
        videoTag += '<video id="' + name + '" controls ' + autoplay + ' width="' + w + '"' + ' height="' + h + '"' + ' style="margin:auto;">';
        videoTag += '<source src="' + course.mediaLocation + name + '.webm' + '" type="video/webm">';
        videoTag += '<source src="' + course.mediaLocation + name + '.mp4' + '" type="video/mp4">';
        videoTag += '</video>';
        $video.html(videoTag);

        $('#' + name).get(0).onplay = function() {
            $('video').each(function() {
                if ($(this).attr('id') != name) {
                    $(this).get(0).pause();
                }
            });
        };

        $('#' + name).get(0).onended = function() {
            if($video.data().hasOwnProperty("jump")){
                var pos = -1;
                var name = $video.data("jump");
                console.log("location videos ->"+name);
                location.href = "#" + name;
            } else if ($video.data().hasOwnProperty("hidenext")){
                $('#final_feed').slideDown(function () {
                    _self.xkroll('#final_feed');
                });
            }
            else
                // $(".x-next").show();
                activities.activityFinished();
        };

    });
}

//audios

this.audios = function() {
    $('.xk_audio').each(function() {

        var $audio = $(this);
        var name = $audio.data('name');
        var contr = $audio.data('controls');
        var auto = $audio.data('autoplay');
        var autoplay = '';
        if (auto == 'y') {
            autoplay = 'autoplay';
        }

        var controls = '';
        if (contr == 'y') {
            controls = 'controls';
        }

        var audioTag = '';
        audioTag += '<audio id="' + name + '"' + ' ' + controls + ' ' + autoplay + ' style="margin:auto;">';
        audioTag += '<source src="' + course.mediaLocation + name + '.mp3?t=' + (new Date().getTime()) + '" type="audio/mpeg">';
        audioTag += '</audio>';
        $audio.html(audioTag);
        $('#' + name).get(0).onplay = function() {
            $('audio').each(function() {
                if ($(this).attr('id') != name) {
                    $(this).get(0).pause();
                }
            });
        };
        $('#' + name).get(0).onended = function() {

        };
    });
}

this.audioPlay = function(id) {
    $(id).get(0).play();
}

//stop audio and video

this.stopMedia = function() {
    $('video, audio').each(function(index, item) {
        if (item.id != 'click_sound' && item.id.indexOf('loop') == -1) {
            item.pause();
        }
    });
}

//Goals
this.buildGoals = function(){
    var goalsStr = "";
        for (var i = 0; i<jsonCourse.goals.length; i++) {
            goalsStr += "<div title='"+jsonCourse.goals[i].name+"' class='dk-goal ";
            if(jsonCourse.goals[i].status){
                goalsStr += "dk-goal-ok animated bounceIn";      
            }else{
                goalsStr += "dk-goal-fail";
            }
            goalsStr += "'></div>";
        }
        $(".dk-goals").html(goalsStr);
}


this.activateGoal = function(code){
    for (var i = 0; i<jsonCourse.goals.length; i++) {
        if(jsonCourse.goals[i].code == code){
            jsonCourse.goals[i].status = true;

            // $('.container').removeClass(actualTheme).addClass(jsonCourse.goals[i].theme);
            // actualTheme = jsonCourse.goals[i].theme;

            _self.buildGoals();
            return;
        }
    }
}

this.getGoals = function() {
    const result_obj = secuenceSubModules.filter(o => o.template == _self.getSubmoduleByCode(actualView));
    const goals_ele = jsonCourse.goals.filter(o => o.code == result_obj[0].goals);
    return goals_ele[0].mission;
}


this.updateJsonProgress = function(jsonObj){

    if(jsonObj != undefined){
        progress = jsonObj;

        for (var i = 0; i< jsonCourse.modules.length; i++ ) {
            for (var j = 0; j < jsonCourse.modules[i].submodules.length; j++) {
                for (var k =0 ; k < progress.submodules.length; k++) {
                    if(progress.submodules[k].code == jsonCourse.modules[i].submodules[j].code){
                        jsonCourse.modules[i].submodules[j].status = progress.submodules[k].status;
                    }
                }
            }
        }

        jsonCourse.goals = progress.goals;

    }
    _self.buildGoals();   
}


this.generateJsonProgressSCORM = function(){
    var submodules = [];

    for (var i = 0; i< jsonCourse.modules.length; i++ ) {
        for (var j = 0; j < jsonCourse.modules[i].submodules.length; j++) {
            var tmpSub = {
                code:jsonCourse.modules[i].submodules[j].code,
                status:jsonCourse.modules[i].submodules[j].status
            }   
            submodules.push(tmpSub);
        }
    }
    progress.submodules = submodules;
    progress.goals = jsonCourse.goals;

    return progress;

}


this.getSubmoduleByCode = function (code){
    for (var i = 0; i < jsonCourse.modules.length; i++) {
        for(var j = 0; j < jsonCourse.modules[i].submodules.length; j++){
            if(jsonCourse.modules[i].submodules[j].code == code){
                jsonCourse.modules[i].submodules[j].status = true;
                return jsonCourse.modules[i].submodules[j].template;
            }
        }

    }
}

this.buildSecuenceSubModules = function(){
    secuenceSubModules = [];
    for (var i = 0; i < jsonCourse.modules.length; i++) {
        for(var j = 0; j < jsonCourse.modules[i].submodules.length; j++){
            secuenceSubModules.push(jsonCourse.modules[i].submodules[j]);
        }

    }
}

this.nextToSubmoduleCode = function(code ,position){

    for (var i = 0; i < secuenceSubModules.length; i++) {
        if(code == secuenceSubModules[i].code){
            if(position == "next" && secuenceSubModules[i+1].code != undefined){
                return secuenceSubModules[i+1].code;
            }else if(position == "prev" && secuenceSubModules[i-1].code != undefined){
                return secuenceSubModules[i-1].code;
            }
        }     
    }

    return;

}

this.getIndexSubmoduleByCode = function(code){
    for (var i = 0; i < secuenceSubModules.length; i++) {
        if(code == secuenceSubModules[i].code){
            return (i + 1);
        }     
    }

    return 0;
}

this.buildMenu = function(){
    var itemSec = 1;
    var menuStr = "<div class='dk-menu-dialog-close glitch-nav closePopUps menu'><i class='fa fa-times-circle'></i></div>";
    for (var i=0; i < jsonCourse.modules.length; i++) {
        menuStr += "<div class='dk-js-module'>"
        for (var j = 0; j<jsonCourse.modules[i].submodules.length; j++) {
            if(jsonCourse.modules[i].submodules[j].status){
                menuStr +="<a class='submodule x-jump' data-tooltip='"+jsonCourse.modules[i].title+": "+jsonCourse.modules[i].submodules[j].title+"' data-jump='"+jsonCourse.modules[i].submodules[j].code+"' title='"+jsonCourse.modules[i].title+": "+jsonCourse.modules[i].submodules[j].title+"' data-range='1' >"+itemSec+"</a>";
            }else{
                menuStr +="<button class='submodule' data-tooltip='"+jsonCourse.modules[i].title+": "+jsonCourse.modules[i].submodules[j].title+"' >"+itemSec+"</button>";
            }  
            itemSec++;
        }
        menuStr += "</div>";
    }
    $(".dk-menu-dialog").html(menuStr);
}

this.progressPercent = function(){
    var total = 0;

    for (var i = 0; i < secuenceSubModules.length; i++) {
        if(secuenceSubModules[i].status){
            total++;
        }     
    }

    return ((total* 100)/secuenceSubModules.length);

}

this.getActualBreadCrumb = function (){
    for (var i=0; i < jsonCourse.modules.length; i++) {
        for (var j = 0; j<jsonCourse.modules[i].submodules.length; j++) {
            if(actualView == jsonCourse.modules[i].submodules[j].code){
                // return " <b>/</b> "+jsonCourse.modules[i].submodules[j].title;
                return ""+jsonCourse.modules[i].submodules[j].title+"";
            }
        }
    }

    return "";
}

this.getActualPagination  = function (){
    return _self.getIndexSubmoduleByCode(actualView)+"/"+secuenceSubModules.length;
}

this.setBaseImg = function (srcL) {
    baseImg = srcL;
}
}