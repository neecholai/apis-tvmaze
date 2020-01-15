/** Given a query string, return array of matching shows:
 *     { id, name, summary, episodesUrl }
 */


/** Search Shows
 *    - given a search term, search for tv shows that
 *      match that query.  The function is async show it
 *       will be returning a promise.
 *
 *   - Returns an array of objects. Each object should include
 *     following show information:
 *    {
        id: <show id>,
        name: <show name>,
        summary: <show summary>,
        image: <an image from the show data, or a default imege if no image exists, (image isn't needed until later)>
      }
 */
async function searchShows(query) {
  // TODO: Make an ajax request to the searchShows api.  

  // Search API with Axios with our query
  let searchObjects = (await axios.get('http://api.tvmaze.com/search/shows', { params: { q: query } })).data

  let showList = [];

  // ASK WHY for (let of searchObjects) yields type error for accessing .show
  for (let searchObject of searchObjects) {
    let { id, name, summary, image } = searchObject.show;
    // Initialize show object

    let showObj = {
      id,
      name,
      summary,
      image: image.medium || "https://store-images.s-microsoft.com/image/apps.65316.13510798887490672.6e1ebb25-96c8-4504-b714-1f7cbca3c5ad.f9514a23-1eb8-4916-a18e-99b1a9817d15?mode=scale&q=90&h=300&w=300"
    }

    // Insert show object into array of shows that match query.
    showList.push(showObj);
  }

  return showList;

}




/** Populate shows list:
 *     - given list of shows, add shows to DOM
 */

function populateShows(shows) {
  const $showsList = $("#shows-list");
  $showsList.empty();

  for (let show of shows) {
    let $item = $(
      `<div class="col-md-6 col-lg-3 Show" data-show-id="${show.id}">
         <div class="card" data-show-id="${show.id}">
           <div class="card-body">
             <h5 class="card-title">${show.name}</h5>
             <img class="card-img-top" src=${show.image}>
             <p class="card-text">${show.summary}</p>
           </div>
           <button class="show-episodes">Show Episodes</button>
         </div>
       </div>
      `);

    $showsList.append($item);
  }

  $("#shows-list").on("click", ".show-episodes", async function (e) {
    let id = $(e.target).parent().data().showId;
    let episodeList = await getEpisodes(id);
    populateEpisodesList(episodeList);
  });
}


/** Handle search form submission:
 *    - hide episodes area
 *    - get list of matching shows and show in shows list
 */

$("#search-form").on("submit", async function handleSearch(evt) {
  evt.preventDefault();

  let query = $("#search-query").val();
  if (!query) return;

  $("#episodes-area").hide();

  let shows = await searchShows(query);

  populateShows(shows);


});


/** Given a show ID, return list of episodes:
 *      { id, name, season, number }
 */

async function getEpisodes(id) {
  // TODO: get episodes from tvmaze
  //       you can get this by making GET request to
  //       http://api.tvmaze.com/shows/SHOW-ID-HERE/episodes
  let episodes = (await axios.get(`http://api.tvmaze.com/shows/${id}/episodes`)).data;

  let episodeList = [];

  for (let episode of episodes) {
    let { id, name, season, number } = episode;

    let episodeObj = {
      id,
      name,
      season,
      number
    }

    episodeList.push(episodeObj);
  }

  return episodeList;
  // TODO: return array-of-episode-info, as described in docstring above
}

function populateEpisodesList(episodeList) {

  let $episodeContainer = $("#episodes-list");
  $episodeContainer.empty();
  for (let episode of episodeList) {
    let newLi = `<li>${episode.name} (season ${episode.season}, number ${episode.number})</li>`
    $episodeContainer.append(newLi);
  }

  $("#episodes-area").css("display", "");

}
