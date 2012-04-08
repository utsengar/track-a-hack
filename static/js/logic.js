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
    for(k in data.authors){
        author_list.push(k);
    }

    $('#author_list').html('<div class="well">'+ String(author_list) +'</div>"');

}

function setAuthorOfTheYear(data){
    authors=[];
    count=[]
    for(k in data.author_of_year){
        authors.push(k);
        count.push(data.author_of_year[k]);
    }

    setBarChart("author_of_the_year", count, authors);
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
 * Construct bar chart: reusable method
 */
function setBarChart(div, vertical, horizontal){
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

    r.text(160, 10, "Single Series Chart").attr(txtattr);
    r.text(480, 10, "Multiline Series Stacked Chart").attr(txtattr);
    r.text(160, 250, "Multiple Series Chart").attr(txtattr);
    r.text(480, 250, "Multiline Series Stacked Chart\nColumn Hover").attr(txtattr);

    r.barchart(10, 10, 300, 220, [[55, 20, 13, 32, 5, 1, 2, 10]]).hover(fin, fout);
    r.hbarchart(330, 10, 300, 220, [[55, 20, 13, 32, 5, 1, 2, 10], [10, 2, 1, 5, 32, 13, 20, 55]], {stacked: true}).hover(fin, fout);
    r.hbarchart(10, 250, 300, 220, [[55, 20, 13, 32, 5, 1, 2, 10], [10, 2, 1, 5, 32, 13, 20, 55]]).hover(fin, fout);
    var c = r.barchart(330, 250, 300, 220, [[55, 20, 13, 32, 5, 1, 2, 10], [10, 2, 1, 5, 32, 13, 20, 55]], {stacked: true, type: "soft"}).hoverColumn(fin2, fout2);
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

