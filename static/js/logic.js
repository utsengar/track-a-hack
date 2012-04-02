function constructHTML(data){
    setGeneralInfo(data);
    setActivity(data);
}


function setGeneralInfo(data){
    //Construct JSON
    setHtml('static/js/handlebars/general.handlebars',  '#general', {projectname: data.projectname});    
}

function setActivity(data){
    //Construct JSON
    setHtml('static/js/handlebars/activity.handlebars',  '#activity', {last_active_day: data.last_active_day});    
}


function setHtml(source, div, jsonData){
    getTemplateAjax(source, function(template) {
        html = template(jsonData);
        $(div).empty();
        $(div).html(html);
    });
}


function getTemplateAjax(path, callback) {
    var source;
    var template;

    $.ajax({
        url: path,
        success: function(data) {
            source    = data;
            template  = Handlebars.compile(source);    
            callback(template);
        }
    });
}
