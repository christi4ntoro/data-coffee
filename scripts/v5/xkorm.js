//SCORM API
function Xkorm() {
    var _self = this;
    var data = [];
    this.resume = false;
    this.ab_initio = false;
    var jsonData;

    this.api_loaded = function () {
        var API = scorm.API.getHandle();
        if (API != undefined) {
            return true;
        }
        return false;
    };

    this.init = function (progress) {
        _self.sendData(progress);

        switch (scorm.version) {
            case "1.2":
                scorm.set("cmi.core.score.min", 0);
                scorm.set("cmi.core.score.max", 100);
                break;
            case "2004":
                scorm.set("cmi.score.min", 0);
                scorm.set("cmi.score.max", 100);
                break;
        }
    };

    this.updateData = function (progress) {
        
        _self.sendData(progress);
        
    };

    this.loadData = function () {
        var strData = _self.getData();
        for (var i = 0; i < strData.length; i++) {
            data[i] = parseInt(strData.charAt(i));
        }
    };

    this.loadJsonData = function(){
        var tmpSD = scorm.get("cmi.suspend_data");
        if(tmpSD != "" && tmpSD != "undefined"){
            jsonData = JSON.parse(tmpSD);
        }
    }

    this.statusSubmoduleCode = function (code){
        for (var i = 0; i < jsonData.submodules.length ; i++) {
           if(jsonData.submodules[i].code == code){
                if(jsonData.submodules[i].status != undefined){
                    return jsonData.submodules[i].status;
                }
                return false;
           }
        }
        return false;
    }

    this.getUsername = function () {
        var uname;

         switch (scorm.version) {
            case "1.2":
                uname = scorm.get("cmi.core.student_name");
                break;
            case "2004":
                uname = scorm.get("cmi.learner_name");
                break;
        }

        if (String(uname).length > 0 && String(uname).indexOf(",") != -1) {
            uname = uname.split(", ")[1];
        } else {
            uname = "ESTUDIANTE";
        }
        return uname;
    };

    this.getEntryMode = function () {
        var entry;

         switch (scorm.version) {
            case "1.2":
                entry = scorm.get("cmi.core.entry");
                break;
            case "2004":
                entry = scorm.get("cmi.entry");
                break;
        }
        return entry;
    };

    this.sendData = function (data) {
        scorm.set("cmi.suspend_data", JSON.stringify(data));
    };

    this.getJsonSuspendData = function(){
        return jsonData;
    }

    this.getData = function () {
        return scorm.get("cmi.suspend_data");
    };

    this.getDataArray = function () {
        return data;
    }

    this.getLocation = function () {
        var location;

        switch (scorm.version) {
            case "1.2":
                location = scorm.get("cmi.core.lesson_location");
                break;
            case "2004":
                location = scorm.get("cmi.location");
                break;
        }
        return location;
    };

    this.setLocation = function (location) {
        switch (scorm.version) {
            case "1.2":
                scorm.set("cmi.core.lesson_location", location);
                break;
            case "2004":
                scorm.set("cmi.location", location);
                break;
        }
    };

    this.getLessonStatus = function () {
        var lesson_status;

        switch (scorm.version) {
            case "1.2":
                lesson_status = scorm.get("cmi.core.lesson_status");
                break;
            case "2004":
                lesson_status = scorm.get("cmi.success_status");
                break;
        }
        return lesson_status;

    };

    this.getLessonStatusCompleted = function () {
        var lesson_status;

        switch (scorm.version) {
            case "1.2":
                lesson_status = scorm.get("cmi.core.lesson_status");
                break;
            case "2004":
                lesson_status = scorm.get("cmi.completion_status");
                break;
        }
        return lesson_status;
    };

    this.setLessonStatus = function (status) {
        switch (scorm.version) {
            case "1.2":
                scorm.set("cmi.core.lesson_status", status);
                break;
            case "2004":
                scorm.set("cmi.success_status", status);
                break;
        }
    };

    this.setLessonStatusCompleted = function (status) {
        switch (scorm.version) {
            case "1.2":
                scorm.set("cmi.core.lesson_status", status);
                break;
            case "2004":
                scorm.set("cmi.completion_status", status);
                break;
        }
    };

    this.getScore = function () {
        var score;

        switch (scorm.version) {
            case "1.2":
                score = scorm.get("cmi.core.score.raw");
                break;
            case "2004":
                score = scorm.get("cmi.score.raw");
                break;
        }
        return score;
    };

    this.setScore = function (score) {
        switch (scorm.version) {
            case "1.2":
                scorm.set("cmi.core.score.raw", String(score));
                break;
            case "2004":
                scorm.set("cmi.score.raw", String(score));
                break;
        }
    };

    this.getLessonMode = function () {
        var mode;
        switch (scorm.version) {
            case "1.2":
                mode = scorm.get("cmi.core.lesson_mode");
                break;
            case "2004":
                mode = scorm.get("cmi.mode");
                break;
        }
        return mode;
    };

    this.commit = function () {
        scorm.save();
    };

    this.finish = function () {
        scorm.quit();
    };

    this.serializeData = function (data_array) {
        var str = "";
        for (var i = 0; i < data_array.length; i++) {
            str += data_array[i];
        }
        return str;
    };

    this.setTime = function (time) {
        //HH:MM:SS
        switch (scorm.version) {
            case "1.2":
                scorm.set("cmi.core.session_time", time);
                break;
            case "2004":
                scorm.set("cmi.session_time", time);
                break;
        }
    };

    this.setExit = function (status) {
        switch (scorm.version) {
            case "1.2":
                scorm.set("cmi.core.exit", status);
                break;
            case "2004":
                scorm.set("cmi.exit", status);
                break;
        }
    };

    this.addComment = function (comment) {
        switch (scorm.version) {
            case "1.2":
                scorm.set("cmi.comments", comment + " - ");
                break;
            case "2004":
                scorm.set("cmi.comments_from_learner._children", comment + " - ");
                break;
        }
    };

    this.getComments = function () {
        var comments;
        switch (scorm.version) {
            case "1.2":
                comments = scorm.get("cmi.comments");
                break;
            case "2004":
                comments = scorm.get("cmi.comments_from_learner._children");
                break;
        }
        return comments;
    };

    this.lmsInitialize = function (progress) {
        scorm.init();
        if (_self.getEntryMode() == "ab-initio") {
            _self.ab_initio = true;
            _self.init(progress);
        } else {
            //resume
            _self.resume = true;
            _self.loadJsonData();
        }
    };

    this.getObjectiveScore = function (oid) {
        var score;
        switch (scorm.version) {
            case "1.2":
                score = scorm.get("cmi.objectives." + oid + ".score.raw")
                break;
            case "2004":
                score = scorm.get("cmi.score.raw");
                break;
        }
        return score;
    };

    this.setObjectiveScore = function (oid, value) {
        switch (scorm.version) {
            case "1.2":
                scorm.set("cmi.objectives." + oid + ".score.raw", value);
                break;
            case "2004":
                scorm.set("cmi.score.raw", value);
                break;
        }
    };

    this.setObjectiveStatus = function (oid, status) {
        switch (scorm.version) {
            case "1.2":
                scorm.set("cmi.objectives." + oid + ".status", status);
                break;
            case "2004":
                scorm.set("cmi.objectives." + oid + ".success_status ", status);
                break;
        }
    };

    this.setInteraction = function (iseq, iid, type, weight, pattern, response, result) {
        scorm.set("cmi.interactions." + iseq + ".id", iid);
        scorm.set("cmi.interactions." + iseq + ".type", type);
        scorm.set("cmi.interactions." + iseq + ".weighting", weight);
        scorm.set("cmi.interactions." + iseq + ".student_response", response);
        scorm.set("cmi.interactions." + iseq + ".result", result);

        scorm.set("cmi.interactions." + iseq + ".correct_responses.0.pattern", pattern);
    };
    
    this.setInteractionResponse = function (iseq, response) {
        scorm.set("cmi.interactions." + iseq + ".student_response", response);
    };

    this.calcScoreFromInteractions = function () {
        
    };
    
    this.setCustomJSON = function(){
        //Objeto para alamcenar el progreso en temas y subtemas
        var progress = {
            theme: 0,
            subtheme: 0,
            porcentajecal: 0,
            visitado: [],
            posevaluaciones: ["m2-1-1","m2-4-1","m2-4-2","m2-7-1","m2-7-2","m3-2-1","m3-6-1","m3-6-2","m3-6-3"],
            calificaciones: [],
        };
    }
}