
clickMenu("blogMenu","blog");
clickMenu("controlMenu","control");
clickMenu("optionsMenu","options");
clickMenu("aboutMenu","about");
copyByID("shareThisPage");
time();




function clickMenu(menuID,textID) {
  document.getElementById(textID).addEventListener("click",function () {
    hideMenu("blogMenu", "blog");
    hideMenu("controlMenu", "control");
    hideMenu("optionsMenu", "options");
    hideMenu("aboutMenu", "about");
    showMenu(menuID,textID)
  });

}

function showMenu(menuID,textID) {
  document.getElementById(menuID).style.display = "block";
  document.getElementById(textID).style.backgroundColor ="rgba(3,76,218,1)";
  document.getElementById(textID).style.color = "white";
}

function hideMenu(menuID,textID){
  document.getElementById(menuID).style.display = "none";
  document.getElementById(textID).style.backgroundColor ="rgba(0,0,0,0)";
  document.getElementById(textID).style.color = "black";
}
function copyByID(textID){
  document.getElementById(textID).addEventListener("click",function () {
    copySite();
  });
}


document.onclick = function (event) {
  var e = event || window.event;
  var elem = e.srcElement || e.target;
  while (elem) {

    if (elem != document) {
      if (elem.id == "blogMenu" || elem.id == "blog"
        || elem.id == "controlMenu" || elem.id == "control"
        || elem.id == "optionsMenu" || elem.id == "options"
        || elem.id == "aboutMenu" || elem.id == "about") {

        return;
      }
      elem = elem.parentNode;
    }


    else {
      hideMenu("blogMenu", "blog");
      hideMenu("controlMenu", "control");
      hideMenu("optionsMenu", "options");
      hideMenu("aboutMenu", "about");
      return;
    }
  }
}

function time(){
  //获得显示时间的div
  t_div = document.getElementById('showtime');
  var now=new Date()
  //替换div内容
  var weekday = new Array(7)
  weekday[0] = "周日"
  weekday[1] = "周一"
  weekday[2] = "周二"
  weekday[3] = "周三"
  weekday[4] = "周四"
  weekday[5] = "周五"
  weekday[6] = "周六"
  var zero = "0";
  if (now.getMinutes()<10)
    zero = "0";
  else
    zero = "";
  t_div.innerHTML =
    weekday[now.getDay()]+" "+now.getHours()+":"+zero+now.getMinutes()+"&nbsp&nbsp"
  //等待一秒钟后调用time方法，由于settimeout在time方法内，所以可以无限调用
  setTimeout(time,1000);
}


function fenxiang() {
  var str = "我发现了一篇比较有用的文章，赶快看看吧！"
  str = str + '\r\n\r\n' +'引用标题：'+ document.title;
  str = str + '\r\n' + '引用地址：' + document.location.href;
  clipboardData.setData('text', str);
  alert('本章地址已经复制到您的粘贴板了，赶快将它粘贴到你要分享的地方吧：）');
}

function copySite() {

    var str = "向您分享一篇来自msfasr.com的文章："
    str = str + '\r\n' + '' + document.location.href;
    let transfer = document.createElement('input');
    document.body.appendChild(transfer);
    transfer.value = str  // 这里表示想要复制的内容
    transfer.focus();
    transfer.select();
    if (document.execCommand('copy')) {
        document.execCommand('copy');
    }
    transfer.blur();
    alert('本文章链接已复制到您的粘贴板，您可以在需要分享的地方粘贴。');
    document.body.removeChild(transfer);

}
