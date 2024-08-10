    var ctx = $("#canvas")[0].getContext("2d")
    
    var fillZero = function(num, length) {
        num = num.toString();
        var str = "";
        for (var i = 0, n = length - num.length; i < n; i++) {
            str += "0";
        }
        return str + num;
    }

    function run() {
        /**
         * @param {string} time 形式为 1.1.2.9的数组
         */
        var drawTime = function(time) {
            var bai = localStorage['bai'];
            var a = time[0],
                b = time[1],
                c = time[2],
                d = time[3];
            ctx.clearRect(0, 0, 19, 19);
            ctx.drawImage(bai == 1 ? imgbai[a] : img[a], 0, 0, 9, 9);
            ctx.drawImage(bai == 1 ? imgbai[b] : img[b], 10, 0, 9, 9);
            ctx.drawImage(bai == 1 ? imgbai[c] : img[c], 0, 10, 9, 9);
            ctx.drawImage(bai == 1 ? imgbai[d] : img[d], 10, 10, 9, 9);
            chrome.browserAction.setIcon({
                path: $("canvas")[0].toDataURL()
            })
        }
        drawTime([1, 2, 3, 4])
        setInterval(function() {
            var arr_2 = [
                localStorage["time1"] || "sec",
                localStorage["time2"] || "minute"
            ]
            var time = new Date();
            var data = {
                hour: fillZero(time.getHours(), 2),
                minute: fillZero(time.getMinutes(), 2),
                sec: fillZero(time.getSeconds(), 2),
                month: fillZero(time.getMonth() + 1, 2),
                date: fillZero(time.getDate(), 2),
                year: fillZero(time.getFullYear(), 4).substr(2, 4)
            }
            var data1 = data[arr_2[0]],
                data2 = data[arr_2[1]];
            drawTime([data1.charAt(0), data1.charAt(1), data2.charAt(0), data2.charAt(1)]);
            startBadgeTimer();
        }, 100)
    }
    var checkLoad = function() {
        count--;
        if (count == 0) {
            run();
        }
    }
    var img = new Array(10),
        count = 20;
    var imgcount = 0;
    for (var i = 0; i < 10; i++) {
        img[i] = new Image();
        img[i].src = "img/" + i + ".png"
        img[i].onload = checkLoad;
    }
    var imgbai = new Array(10)
    var imgcountbai = 0;
    for (var i = 0; i < 10; i++) {
        imgbai[i] = new Image();
        imgbai[i].src = "img/" + i + "-w.png"
        imgbai[i].onload = checkLoad;
    }

    function startBadgeTimer() {
        var a = new Date;
        var b = a.getHours();
        var c = a.getMinutes();
        b < 10 ? b = "0" + b : b = "" + b;
        c < 10 ? c = "0" + c : c = "" + c;
        var t = b + "" + c;
        chrome.browserAction.setBadgeText({
            text: localStorage['badge'] == 1 ? t : ""
        });
        chrome.browserAction.setBadgeBackgroundColor({
            color: getColor(localStorage["color"]!= undefined ? localStorage["color"] :"default")
        });            


    }

    function getColor(arg) {
        var color1;
        switch (arg) {
            case "default":
                color1 = "#0091ea";
                break;

            case "green":
                color1 = "green";
                break;

            case "yellow":
                color1 = "#ff8c00";
                break;

            case "red":
                color1 = "#f00";
                break;

            case "cyan":
                color1 = "#607d8b";
                break;

            case "purple":
                color1 = "#BB33FF";
                break;

            case "brown":
                color1 = "#996633";
                break;

            case "pink":
                color1 = "#FA7296";
                break;
        }
        return color1;
    }