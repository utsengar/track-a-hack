function constructHTML(data){
    setGeneralInfo(data);
    setActivityGraphs(data);
    setFileGraphs(data);
    setAuthors(data);
    setAuthorOfTheYear(data)
}


function setGeneralInfo(data){
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
    var axis_val = [];
    var data = [];
    for(var k in activity_by_hour_of_day){
        axis_val.push(k);
        data.push(activity_by_hour_of_day[k]);
    }

    setGraph("activity_by_hour_of_day", "Count", "Activity", axis_val, data);
}


function setFileGraphs(data){
    extensions_filecount = [];
    legend = [];
    for(k in data.extensions){
        if(k){
            legend.push("%% " + k);
        }else{
            legend.push("%% Unknown");
        }
        extensions_filecount.push(data.extensions[k].files);

    }
    setPieChart("file_extensions", extensions_filecount, legend);
}

function setAuthors(data){
    author_list = [];
    author_commit_count = [];
    for(k in data.authors){
        var first_name = k.split(" ")[0];
        author_list.push(first_name);
        author_commit_count.push(data.authors[k].commits);
    }

    $('#author_list').html('<div class="well">'+ String(author_list) +'</div>"');
    setHorizontalBarChart("author_commit_count", "Author commit count", author_commit_count, author_list);
}

function setAuthorOfTheYear(data){
    authors=[];
    count=[]
    for(k in data.author_of_year){
        var values = data.author_of_year[k];
        for(a in values){
            var first_name = a.split(" ")[0];
            authors.push(first_name);
            count.push(values[a]);
        }
    }

    setVericalBarChart("author_of_the_year", "Author of the Year", authors, count);
}

/*
 * Construct line graphs: reusable method
 */
function setGraph(div, xLabel, yLabel, axis_val, data){
    var r = Raphael(div),
    txtattr = { font: "12px sans-serif" };

    var position = $("#"+div).position();
    var lines = r.linechart(position.left, position.top, 250, 250, axis_val, [data], 
                            { nostroke: false, axis: "0 0 1 1", symbol: "circle", smooth: true }).hoverColumn(
                            function () {
                                this.tags = r.set();
                                for (var i = 0, ii = this.y.length; i < ii; i++) {
                                    this.tags.push(r.tag(this.x, this.y[i], this.values[i], 160, 10).insertBefore(this).attr(
                                        [{ fill: "#fff" }, 
                                            { fill: this.symbols[i].attr("fill") }]));
                                }
                            },
                            function () {
                                this.tags && this.tags.remove();
                            });
}


/*
 * Construct Pie charts: reusable method
 */
function setPieChart(div, data, legend){
    var position = $("#"+div).position();
    var height = $("#"+div).height();
    var width = $("#"+div).width();

    var r = Raphael(div);
    //txtattr = { font: "12px sans-serif" };
    //r.text(480, 10, "").attr(txtattr);

    pie = r.piechart(width/3, 342/2, 100, data,
                     { legend: legend, 
                         legendpos: "east"});
                         pie.hover(function () {
                             this.sector.stop();
                             this.sector.scale(1.1, 1.1, this.cx, this.cy);

                             if (this.label) {
                                 this.label[0].stop();
                                 this.label[0].attr({ r: 7.5 });
                                 this.label[1].attr({ "font-weight": 800 });
                             }
                         }, function () {
                             this.sector.animate({ transform: 's1 1 ' + this.cx + ' ' + this.cy }, 500, "bounce");

                             if (this.label) {
                                 this.label[0].animate({ r: 5 }, 500, "bounce");
                                 this.label[1].attr({ "font-weight": 400 });
                             }
                         });
}


/*
 * Construct horizontal bar chart: reusable method
 */
function setHorizontalBarChart(div, title, horizontal, vertical){
    var r = Raphael(div),
    fin = function () {
        this.flag = r.popup(this.bar.x, this.bar.y, this.bar.value || "0").insertBefore(this);
    },
    fout = function () {
        this.flag.animate({opacity: 0}, 300, function () {this.remove();});
    },
    fin2 = function () {
        var y = [], res = [];
        for (var i = this.bars.length; i--;) {
            y.push(this.bars[i].y);
            res.push(this.bars[i].value || "0");
        }
        this.flag = r.popup(this.bars[0].x, Math.min.apply(Math, y), res.join(", ")).insertBefore(this);
    },
    fout2 = function () {
        this.flag.animate({opacity: 0}, 300, function () {this.remove();});
    },
    txtattr = { font: "12px sans-serif" };
    r.text(100, 10, title).attr(txtattr);
    r.hbarchart(10, 10, 300, 220, [horizontal], {stacked: true}).hover(fin, fout).label([vertical], true);
}



/*
 * Construct vertical bar chart: reusable method
 */
function setVericalBarChart(div, title, horizontal, vertical){
    var position = $("#"+div).position();
    var r = Raphael(div),
    fin = function () {
        this.flag = r.popup(this.bar.x, this.bar.y, this.bar.value || "0").insertBefore(this);
    },
    fout = function () {
        this.flag.animate({opacity: 0}, 300, function () {this.remove();});
    },
    fin2 = function () {
        var y = [], res = [];
        for (var i = this.bars.length; i--;) {
            y.push(this.bars[i].y);
            res.push(this.bars[i].value || "0");
        }
        this.flag = r.popup(this.bars[0].x, Math.min.apply(Math, y), res.join(", ")).insertBefore(this);
    },
    fout2 = function () {
        this.flag.animate({opacity: 0}, 300, function () {this.remove();});
    },
    txtattr = { font: "12px sans-serif" };
    r.text(100, 10, title).attr(txtattr);
    r.barchart(10, 10, 300, 220, [vertical]).hover(fin, fout).label([horizontal], true);
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

jQuery.fn.center = function () {
    this.css("position","absolute");
    this.css("top", (($(window).height() - this.outerHeight()) / 2) + 
             $(window).scrollTop() + "px");
    this.css("left", (($(window).width() - this.outerWidth()) / 2) + 
             $(window).scrollLeft() + "px");
    return this;
}

