document.addEventListener("DOMContentLoaded",function(e){var t=document.getElementsByTagName("form")[0],s=document.getElementsByClassName("title")[0],d=(document.getElementsByClassName("logo")[0],document.getElementById("sound-jedi")),n=document.getElementById("sound-dart"),a=document.getElementsByClassName("light")[0],l=document.getElementsByClassName("dark")[0];setTimeout(()=>{s.classList.add("show"),setTimeout(()=>{t.classList.add("show"),a.classList.add("scale"),l.classList.add("scale")},1e3)},11e3),a.addEventListener("click",function(){d.play()}),l.addEventListener("click",function(){n.play()})});