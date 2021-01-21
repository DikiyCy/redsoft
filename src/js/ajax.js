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
