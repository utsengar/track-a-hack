function constructHTML(data){
    setGeneralInfo(data);
    setActivityGraphs(data);
}


function setGeneralInfo(data){
    //Construct JSON
    general_data = {
        projectname: data.projectname,
        total_authors: data.total_authors,
        total_commits: data.total_commits,
        total_files: data.total_files,
        total_lines: data.total_lines,
        total_lines_added: data.total_lines_added,
        total_lines_removed: data.total_lines_removed
    }
    setHtml('static/js/handlebars/general.handlebars',  '#general', general_data);    
}

function setActivityGraphs(data){
    activity_by_hour_of_day_Graph(data.activity_by_hour_of_day);
}


function activity_by_hour_of_day_Graph(activity_by_hour_of_day){
    var data = "Count,Activity \n"
    for(var k in activity_by_hour_of_day){
        data += k + "," + activity_by_hour_of_day[k] + "\n";
    }

    setSimpleGraph("activity", "Activity by hour of day" ,"Count", "Activity", data);
}


function setSimpleGraph(div, title, xLabel, yLabel, data){
          g = new Dygraph(
              document.getElementById(div),
              function() {
                return data;
              },
              {
                labelsDiv: document.getElementById('status'),
                labelsSeparateLines: true,
                labelsKMB: true,
                legend: 'always',
                colors: ["rgb(51,204,204)",
                         "rgb(255,100,100)",
                         "#00DD55",
                         "rgba(50,50,200,0.4)"],
                width: 400,
                height: 200,
                title: title,
                xlabel: xLabel,
                ylabel: yLabel,
                axisLineColor: 'white',
                drawXGrid: false
              }
          );
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
