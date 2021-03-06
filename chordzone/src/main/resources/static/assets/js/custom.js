function sharp_flat(source, code) {
    var src = ["Ab", "A", "A#", "Bb", "B", "C", "C#", "Db", "D", "D#", "Eb", "E", "F", "F#", "Gb", "G", "G#"];
    var sharp = ["A", "Bb", "B", "B", "C", "C#", "D", "D", "Eb", "E", "E", "F", "F#", "G", "G", "Ab", "A"];
    var flat = ["G", "Ab", "A", "A", "Bb", "B", "C", "C", "C#", "D", "D", "Eb", "E", "F", "F", "F#", "G"];
    for (var i = 0; i < 17; ++i)
        if (src[i] == source)
            if (code == '#') return sharp[i]; else return flat[i];
    return "";
}

function changeStyle(obj, code) {
    oParent = obj.parentNode;
    if (oParent.tagName != 'DIV') oParent = oParent.parentNode;
    if (oParent.tagName != 'DIV') return;
    chords = oParent.getElementsByTagName("SPAN");
    for (i = 0; i < chords.length; ++i) {
        chordObj = chords[i];
        if (chordObj.getAttribute("class") != "chord") continue;
        chordStyle = chordObj.style;
        switch (code) {
            case 'I':
                if (chordStyle.fontStyle == "italic") chordStyle.fontStyle = "normal"; else chordStyle.fontStyle = "italic";
                break;
            case 'B':
                if (chordStyle.fontWeight == "bold") chordStyle.fontWeight = "normal"; else chordStyle.fontWeight = "bold";
                break;
            case '()':
                chordObj.innerHTML = chordObj.innerHTML.replace(reChords, "($1)");
                break;
            case '[]':
                chordObj.innerHTML = chordObj.innerHTML.replace(reChords, "[$1]");
                break;
            case 'bgcolor':
                chordStyle.color = obj.style.backgroundColor;
                break;
            case 'b':
            case '#':
                chordObj.innerHTML = chordObj.innerHTML.replace(reOneChord, function ($0, $1, $2, $3) {
                    return sharp_flat($2, code) + $3;
                });
                break;
        }
    }
    render_tab_chords();
}

function render_tab_chords() {
    $("#lyric").each(function () {
        var regExp = /[^[\]]+(?=])|[]+(?=\))/g;
        var chordExp = new RegExp("(([A-G][b#]?)((7sus4|7sus2|sus4|sus2|dim|aug|add9|m7M|maj7|m9|m7|m6|m|7M|9|7|6|4|11|m11|m7b5)?))", "g");
        var content = $(this).html();
        var words = content.match(regExp);
        words = array_unique(words);
        var chords = [];
        var n = 0;
        for (var i = 0; i < words.length; i++) {
            var chordString = words[i].match(chordExp).toString();
            var strSplit;
            if (chordString.indexOf(',') > -1) {
                strSplit = chordString.split(',');
                for (var j = 0; j < strSplit.length; j++) {
                    chords[n] = strSplit[j];
                    n++;
                }
            } else {
                chords[n] = chordString;
                n++;
            }
        }
        $("#show_tab").empty();
        for (var i = 0; i < chords.length; i++) {
            $("#show_tab").append('<div style="float:left;text-align:center" id="guitar-tab-' + i + '"> <span index="1" chord="' + chords[i] + '" class="jtab chordonly">' + chords[i] + '</span><span class="small" onclick="guitarTabChord_back(this)" title="Thế bấm hợp âm trước"><i class="fas fa-arrow-circle-left"><\/i><\/span><span class="small" onclick="guitarTabChord_default(this)" title="Thế bấm mặc định"> thế bấm <\/span><span class="small" onclick="guitarTabChord_next(this)" title="Thế bấm hợp âm sau"><i class="fas fa-arrow-circle-right"><\/i><\/span> </div>');
        }
        $("#show_tab").append('<div class="clear"><div class="row"><span></span></div></div>');
        jtab.renderimplicit();
    });
}

function array_unique(arr) {
    var result = [];
    for (var i = 0; i < arr.length; i++) {
        if (result.indexOf(arr[i]) === -1) {
            result.push(arr[i]);
        }
    }
    return result;
}

function bodyLoad() {
    chord = "(([A-G][b#]?)((7sus4|7sus2|sus4|sus2|dim|aug|add9|m7M|maj7|m9|m7|m6|m|7M|9|7|6|4|11|m11|m7b5)?(\\s*[-/]?\\s*)))";
    openBracket = "[\\[\\(]";
    closeBracket = "[\\]\\)]";
    reOneChord = new RegExp(chord, "g");
    reChords = new RegExp(openBracket + "(" + chord + "+)" + closeBracket, "g");
    document.body.innerHTML = document.body.innerHTML.replace(reChords, "<span class=chord>$&</span>");
}

$(function () {
    bodyLoad();
    render_tab_chords();
});
guitarTabChord_back = function (n) {
    var r = n.parentNode;
    var i = jQuery("#" + r.id + " .jtab");
    console.log(i);
    var u = i.attr("chord");
    var t = parseInt(i.attr("index"), 10);
    console.log(t);
    t--;
    t == 0 && (t = 10);
    i.attr("index", t);
    jtab.render(jQuery("#" + r.id + " .jtab"), u + ":" + t)
};
guitarTabChord_next = function (n) {
    var r = n.parentNode, i = jQuery("#" + r.id + " .jtab"), u = i.attr("chord"), t = parseInt(i.attr("index"), 10);
    t++;
    t == 11 && (t = 1);
    i.attr("index", t);
    jtab.render(jQuery("#" + r.id + " .jtab"), u + ":" + t)
};
guitarTabChord_default = function (n) {
    var t = n.parentNode, i = jQuery("#" + t.id + " .jtab"), r = i.attr("chord");
    i.attr("index", 1);
    jtab.r
};
$(document).ready(function (e) {
    $(".likes").on("click", function () {
        var element = $(this);
        var per = $(this).parents(".ibar");
        var sid = per.attr("id");
        var htm = $(this).attr('id')
        if (htm == "like") {
            $.ajax({
                type: "POST",
                url: "https://hopamviet.vn/chord/like",
                data: 'sid=' + sid + '&sta=like',
                success: function (reslike) {
                    if (reslike == 1) {
                        var numlikes = $("#lik" + sid).html();
                        numlikes = parseInt(numlikes);
                        element.html("<i class='fas fa-star' style='color:#FFD76E;'></i> Đã thích");
                        $("#lik" + sid).html(numlikes + 1);
                    }
                }
            });
        } else if (htm == "unlike") {
            $.ajax({
                type: "POST",
                url: "https://hopamviet.vn/chord/like",
                data: 'sid=' + sid + '&sta=unlike',
                success: function (reslike) {
                    if (reslike == 1) {
                        var numlikes = $("#lik" + sid).html();
                        numlikes = parseInt(numlikes);
                        element.html("<i class='far fa-star'></i> Thích");
                        $("#lik" + sid).html(numlikes - 1);
                    }
                }
            });
        }
        return false;
    });
    $('.user').typeahead({ajax: '/ajax/autocomplete_user'});
    $("[data-toggle='tooltip']").tooltip();
    $("#fontsize").click(function () {
        var ourText = $("#lyric");
        var currFontSize = ourText.css("fontSize");
        var finalNum = parseFloat(currFontSize, 10);
        var stringEnding = currFontSize.slice(-2);
        var minSize = 14;
        var maxSize = 18;
        if (maxSize > finalNum) {
            finalNum++;
        } else {
            finalNum = minSize;
        }
        ourText.css("fontSize", finalNum + stringEnding);
    });
    $("#clone").click(function () {
        $("#lyric").append($("#lyric").clone());
    });
});
$(document).on("click", ".add", function () {
    var song_play_id = $(this).data('id');
    $("#song_play_id").val(song_play_id);
});
$(document).on("click", ".open", function () {
    var id = $(this).data('id');
    $(".modal-body #id").val(id);
});
$("a[data-toggle=popover]").popover();