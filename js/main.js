let mainContainer;
let totalShipsContainer;

function createStarship(starship) {
  const spanStarship = document.createElement("p")
  const starShipNode = document.createTextNode(`${starship.name}: ${starship.times}`)
  spanStarship.append(starShipNode)
  mainContainer.appendChild(spanStarship)
}

function generateArrStarships(arr) {
  return Object.keys(arr)
    .map(starship => ({ name: starship, times: arr[starship] }))
    .sort((a, b) => b.times - a.times)
}

function getStarWarsShips(url = `https://swapi.dev/api/starships`, starShips = []) {
  return new Promise((resolve, reject) => fetch(url)
    .then(response => {
      if (response.status !== 200) {
        throw `${response.status}: ${response.statusText}`;
      }
      response.json().then(data => {
        starShips = starShips.concat(data.results);

        if (data.next) {
          getStarWarsShips(data.next, starShips).then(resolve).catch(reject)
        } else {
          resolve(starShips);
        }
      }).catch(reject);
    }).catch(reject));
}


window.onload = () => {
  mainContainer = document.getElementById('main-container');
  totalShipsContainer = document.querySelector('#total-ships');
  getStarWarsShips().then(res => {

    const total = res.length
    const spanTotal = document.createElement("span")
    const node = document.createTextNode(total)
    spanTotal.appendChild(node)
    totalShipsContainer.appendChild(spanTotal)


    const starships = {}
    res.forEach(starship => {
      starships[starship.starship_class] = !starships[starship.starship_class] ? 1 : starships[starship.starship_class] += 1
    })

    const orderedStarshipList = generateArrStarships(starships)
    orderedStarshipList.forEach(starship => createStarship(starship))
  });
}