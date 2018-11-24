document.addEventListener('DOMContentLoaded', function(e) {

  var form = document.getElementsByTagName('form')[0],
    title = document.getElementsByClassName('title')[0],
    logo = document.getElementsByClassName('logo')[0],
    soundJedi = document.getElementById('sound-jedi'),
    soundDart = document.getElementById('sound-dart'),
    jediSide = document.getElementsByClassName('light')[0],
    darkSide = document.getElementsByClassName('dark')[0];

  setTimeout(() => {
    title.classList.add('show');
    setTimeout(() => {
      form.classList.add('show');
      jediSide.classList.add('scale');
      darkSide.classList.add('scale');
    }, 1000);
  }, 11000);

  jediSide.addEventListener('click', function() {
    soundJedi.play();
  })

  darkSide.addEventListener('click', function() {
    soundDart.play();
  })
});