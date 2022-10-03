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
          <li class="list-group-item">Currencies: ${country.currencies[Object.keys(country.currencies)].name} ${country.currencies[Object.keys(country.currencies)].symbol} </li>
        </ul>
      </div>
    </div>
  </div>
</div>
  `;

  document.querySelector('.country .row').insertAdjacentHTML('beforeend', countryCard);
}

function setBorders(data) {
  document.querySelector('.borders .row').innerHTML = "";
  document.querySelector('.borders').style.opacity=1;
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

document.querySelector(".btn-search").addEventListener('click', () => {
  const country = document.querySelector(".searchText").value;
  console.log(country);
  const request = new XMLHttpRequest();
  request.open('GET', 'https://restcountries.com/v3.1/name/' + country);
  request.send();

  //load event waits till the get response succesfully from API.

  request.addEventListener('load', function() {
    if (this.statusText == 'OK') {
      const data = JSON.parse(this.responseText);
      console.log(data[0]);
      setCountry(data);
      console.log(data[0].borders);
      if(data[0].borders){
      const countries = data[0].borders.toString();

      //we load the countries which have border to main country
      const req2 = new XMLHttpRequest();
      req2.open('GET', 'https://restcountries.com/v3.1/alpha?codes=' + countries);
      req2.send();
      req2.addEventListener('load', function(){
        const borderData=JSON.parse(this.responseText);
        setBorders(borderData);
        });
      }else{
        document.querySelector('.borders').style.opacity=1;
        document.querySelector('.borders .card-body').innerHTML="This country has no neighboors";
      }

    } else {
      document.querySelector('.error .alert').innerHTML = "There is no such country! Please try again!";
      document.querySelector('.error').style.opacity = 1;
      document.querySelector('.country .row').innerHTML = "";
      setTimeout(() => {
        document.querySelector('.error').style.opacity = 0;
      }, 3500);
    }


  });


});
