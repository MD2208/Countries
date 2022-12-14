function setCountry(data) {
  document.querySelector('.country .row').innerHTML = "";
  document.querySelector('.borders .row').innerHTML = "";
  const country = data[0];
  const countryCard = `
  <div class='card card-head'>
  <div class='row'>
  <h6 class="card-title "> Result </h6>
  </div>
  </div>
  <div class="card content-card">
  <div class="row ">
    <div class="col-md-4 main-card">
      <img src="${country.flags.png}" class="img-fluid" alt="mainCountryimage">
    </div>
    <div class="col-md-8 main-card">
      <div class="card-body">
        <h3 class="card-title">${country.name.common}</h3>
        <hr>
        <ul class="list-group list-group-flush">
          <li class="list-group-item">Capital: ${country.capital[0]}</li>
          <li class="list-group-item">Population: ${(country.population > 1000000 ? (country.population/1000000).toFixed(1)+"M" : country.population)}</li>
          <li class="list-group-item">Languages: ${Object.values(country.languages)}</li>
          <li class="list-group-item">Currencies: ${country.currencies[Object.keys(country.currencies)[0]].name} ${country.currencies[Object.keys(country.currencies)[0]].symbol} </li>
        </ul>
      </div>
    </div>
  </div>
</div>
  `;
  document.querySelector(".loading").style.display="none";
  document.querySelector('.country .row').insertAdjacentHTML('beforeend', countryCard);
}

function setBorders(data) {
  document.querySelector('.borders .row').innerHTML = "";
  document.querySelector('.borders').style.display = 'block';
  for (let country of data) {
    const borderCard = `
    <div class="card border-card">
      <img src="${country.flags.png}" class="img-fluid" alt="mainCountryimage">
      <div class="card-body">
        <h6 class="card-title">${country.name.common}</h6>
        <hr>
        <ul class="list-group list-group-flush">
          <li class="list-group-item">Capital: ${country.capital[0]}</li>
          <li class="list-group-item">Languages: ${Object.values(country.languages)}</li>
        </ul>
      </div>
    </div>
  `;

    document.querySelector('.borders .row').insertAdjacentHTML('beforeend', borderCard);
  }
}

function handleErrors(data){
      document.querySelector(".loading").style.display='none';
      if(data=="Location Api Error"){
        document.querySelector('.error .alert').innerHTML = "Some troubles occured on location finding. Please try to search by writing";
        document.querySelector('.error').style.display = 'block';
        document.querySelector('.country .row').innerHTML = "";
        document.querySelector('.borders').style.display = 'none';
        setTimeout(() => {
          document.querySelector('.error').style.display = 'none';
           }, 3500);
      }
      else if(data=="No country"){
        document.querySelector('.error .alert').innerHTML = "There is no such country! Please try again!";
        document.querySelector('.error').style.display = 'block';
        document.querySelector('.country .row').innerHTML = "";
        document.querySelector('.borders').style.display = 'none';
        setTimeout(() => {
          document.querySelector('.error').style.display = 'none';
           }, 3500);
      }else{
        document.querySelector('.borders').style.display = 'block';
        document.querySelector('.borders .card-body').innerHTML = "This country has no neighbors";
      }
}

async function locSuccess(position){
  try{
      const long = position.coords.longitude;
      const lat = position.coords.latitude;
      const api_key= ''; // put your own api_key
      const url = `https://api.opencagedata.com/geocode/v1/json?q=${lat}+${long}&key=${api_key}`;
      const response = await fetch(url);
      console.log(response.ok);
      if(!response.ok){
        throw new Error("Location Api Error");
      }
      const data = await response.json();
      const location = data.results[0].components['ISO_3166-1_alpha-3'];
      document.querySelector(".searchText").value=location;
      document.querySelector('.btn-search').click();
    }catch(err){
      handleErrors("Location Api Error");
    }

}

function locErr(err){
  handleErrors("Location Api Error");
}

document.querySelector(".btn-search").addEventListener('click', () => {
  document.querySelector(".loading").style.display='block';
  const country = document.querySelector(".searchText").value;
  //console.log(country);
  // In version 1 we use XMLHttpRequest
  // const request = new XMLHttpRequest();
  // request.open('GET', 'https://restcountries.com/v3.1/name/' + country);
  // request.send();

  // In version 2 we will use fetch API
  fetch('https://restcountries.com/v3.1/name/' + country)
      .then((response) => {
        if(!response.ok){
          handleErrors("No country");
          throw new Error("There is no such country.");
        }
        return response.json()})
            .then((data) => {
              setCountry(data)
              if(!data[0].borders){
                handleErrors("border err");
                throw new Error(`The ${data[0].name.common} has no neighbor!`);
              }
              const countries = data[0].borders.toString();
              return fetch('https://restcountries.com/v3.1/alpha?codes=' + countries);
            })
                .then((response) =>  response.json())
                  .then((data) => setBorders(data))
                    .catch(err => console.log(err));
  //version 2 (fetchApi and promises) above
  //In order to use v1 delete the version 2 codes and handleErrors function and comment out every code!
  //load event waits till the get response succesfully from API.
  // This part done by callbacks and XMLHttpRequest!
  // request.addEventListener('load', function() {
  //   if (this.statusText == 'OK') {
  //     const data = JSON.parse(this.responseText);
  //     console.log(data[0]);
  //     setCountry(data);
  //     console.log(data[0].borders);
  //     if (data[0].borders) {
  //       const countries = data[0].borders.toString();
  //
  //       //we load the countries which have border to main country
  //       const req2 = new XMLHttpRequest();
  //       req2.open('GET', 'https://restcountries.com/v3.1/alpha?codes=' + countries);
  //       req2.send();
  //       req2.addEventListener('load', function() {
  //         const borderData = JSON.parse(this.responseText);
  //         setBorders(borderData);
  //       });
  //     } else {
  //       document.querySelector('.borders').style.opacity = 1;
  //       document.querySelector('.borders .card-body').innerHTML = "This country has no neighbors";
  //     }
  //
  //   } else {
  //     document.querySelector('.error .alert').innerHTML = "There is no such country! Please try again!";
  //     document.querySelector('.error').style.opacity = 1;
  //     document.querySelector('.country .row').innerHTML = "";
  //     setTimeout(() => {
  //       document.querySelector('.error').style.opacity = 0;
  //     }, 3500);
  //   }
  //
  //
  // });


});

document.querySelector(".btn-location").addEventListener('click', () => {
  if(navigator.geolocation){
      navigator.geolocation.getCurrentPosition(locSuccess,locErr);
  }
});
