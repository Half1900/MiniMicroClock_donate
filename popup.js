var fillZero=function(num,length){
        num=num.toString();
        var str="";
        for(var i=0,n=length-num.length;i<n;i++){
            str+="0";
        }
        return str+num;
    }

    setInterval(function(){
        var time=new Date();
        $("#time")[0].innerHTML="当前时间: "+
            fillZero(time.getFullYear(),4)+"-"+
            fillZero(time.getMonth()+1,2)+"-"+
            fillZero(time.getDate(),2)+" "+
            fillZero(time.getHours(),2)+":"+
            fillZero(time.getMinutes(),2)+":"+
            fillZero(time.getSeconds(),2)
    },100)
    var radio1=Array.prototype.slice.call(document.getElementsByName("time1"));
    var radio2=Array.prototype.slice.call(document.getElementsByName("time2"));
    var radioColor = Array.prototype.slice.call(document.getElementsByName("color"));
     radio1.forEach(function(i){
        var str = (i.id).substring(0,(i.id).length-1);
        if( localStorage["time1"]==str){
            i.checked=true;
        }
        i.onclick=function(){
            var str1 = (this.id).substring(0,(this.id).length-1);
            localStorage["time1"]=str1
        }
    })
    radio2.forEach(function(i){
        if( localStorage["time2"]==i.id){
            i.checked=true;
        }
        i.onclick=function(){
            localStorage["time2"]=this.id
        }
    })
    radioColor.forEach(function(i){
        if( localStorage["color"]==i.id){
            i.checked=true;
        }
        i.onclick=function(){
            localStorage["color"]=this.id
        }
    })
    localStorage["badge"]!=undefined && localStorage["badge"]==1 ? $("#l-lbl").text("当前已显示徽章时间") : $("#l-lbl").text("当前已隐藏徽章时间");
    if(localStorage["badge-color"]!=undefined && localStorage["badge-color"] == 1 ){
        $("#option-color").css("display","block")
        $("#badge-label-color").text("已显示徽章颜色");
    }else{
        $("#option-color").css("display","none");
        $("#badge-label-color").text("已隐藏徽章颜色");   
    } 
    if(localStorage["timer-date"]!=undefined && localStorage["timer-date"]==1 ){
        $(".options").css("display","block"); 
        $("#timer-label-color").text("已显示日期时间");      
    }else{
        $(".options").css("display","none");  
        $("#timer-label-color").text("已隐藏日期时间");      
    }
    clickEvent("bai");
    clickEvent("badge");
    clickEvent("badge-color");
    clickEvent("timer-date");
    $("body").on("click",".embed-c",function(){
        window.open("../donate.html");
    })
    function clickEvent(args){
        var click = document.getElementById(args);
        if(localStorage[args]==1){
            click.checked="checked"
        }else{
            click.checked=false
        }
        click.onclick=function(){            
            if(this.checked==true){
                localStorage[args]=1;
                args=="badge"? $("#l-lbl").text("当前已显示徽章时间") : "";
                if(args=="badge-color"){
                    $("#option-color").css("display","block");
                    $("#badge-label-color").text("已显示徽章颜色");
                };
                if(args=="timer-date"){
                    $(".options").css("display","block");
                    $("#timer-label-color").text("已显示日期时间") ;
                } ;
            }else{            
                localStorage[args]=0;
                args=="badge" ? $("#l-lbl").text("当前已隐藏徽章时间") : "";
                if(args=="badge-color"){
                    $("#option-color").css("display","none");
                    $("#badge-label-color").text("已隐藏徽章颜色");
                };
                if(args=="timer-date"){
                    $(".options").css("display","none");
                    $("#timer-label-color").text("已隐藏日期时间"); 
                };
            }
        }        
    }