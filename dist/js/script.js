'use strict';
function getResource(url){

  return new Promise(function(resolve, reject){

    const xhr = new XMLHttpRequest();

    xhr.open("GET", url, true);

    xhr.send();

    xhr.addEventListener('readystatechange', function(e){

      if( xhr.readyState != 4  ) return;

      if( xhr.status == 200 ){

        resolve( xhr.responseText );

      } else {

        reject( xhr.statusText );

      }

      });

  })

}
;

const btnAll = document.querySelectorAll('.main .btn');

const localStoreList = [

  '1_btn',
  '2_btn',
  '3_btn',
  '4_btn'

];

const listClasses = [
  'avail',
  'avail',
  'post',
  'avail'
]

document.addEventListener('DOMContentLoaded', function () {

  btnAll.forEach( function(item, ind) {

    if (localStorage.getItem(localStoreList[ind])) {

      item.setAttribute('class', 'btn btn_postponed');

    } else {

      switch (listClasses[ind]) {

        case 'avail':  item.classList.add('btn_available');
          break;

        case 'post':   item.classList.add('btn_postponed');
          break;

        case 'bought':   item.classList.add('btn_bought');
          break;

        default : '';
          break;
      }

    }

    item.addEventListener('click', function () {

      if (item.className === 'btn btn_available') {

        item.setAttribute('class', 'btn btn_loader');

        const res = getResource('https://jsonplaceholder.typicode.com/posts/1')
          .then(function () {

            localStorage.setItem(localStoreList[ind], true);
            item.setAttribute('class', 'btn btn_postponed')

          })
          .catch(function () {

            alert('Ошибка соединения, проверьте свою сеть');
            item.setAttribute('class', 'btn btn_available');

          });



      }

    })


  });

});
