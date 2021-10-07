const Form = document.querySelector("#form");
const Movies = document.querySelector("#movies");
const Searchmovie = document.querySelector("#searchmovies");
const MOVIE_DB_API = "d8bf019d0cca372bd804735f172f67e8";
const MOVIE_DB_ENDPOINT = "https://api.themoviedb.org";
const MOVIE_DB_IMAGE_ENDPOINT = "https://image.tmdb.org/t/p/w500";
const Menu = document.querySelector("#menu");
const Toggle = document.querySelector("#toggle");
const Search = document.querySelector("#search");
const Heading = document.querySelector("#heading");
const Related = document.querySelector("#related");
Form.addEventListener("submit", (e) => {
  e.preventDefault();
  searchMovie(Search.value);
});

Toggle.addEventListener("click", togglebar);

function togglebar() {
  Menu.classList.toggle("hidden");
}

function getmovies(url, render, id, name) {
  fetch(url)
    .then((res) => res.json())
    .then((res) => {
      let out = "";
      out = render(res);

      id.innerHTML = out;
      Heading.innerText = name;
    })
    .catch((err) => console.log(err));
}

function generateMovieDBUrl(path) {
  const url = `${MOVIE_DB_ENDPOINT}/3${path}?api_key=${MOVIE_DB_API}`;
  return url;
}

function getTrendingMovies() {
  const url = generateMovieDBUrl("/trending/movie/day");

  getmovies(url, view, Movies, "Trending Movies");
}

function getPopularMovies() {
  const url = generateMovieDBUrl("/movie/popular");

  getmovies(url, view, Movies, "Popular Movies");
}

function getTopratedMovies() {
  const url = generateMovieDBUrl("/movie/top_rated");

  getmovies(url, view, Movies, "Top-Rated Movies");
}

function getupcomingMovies() {
  const url = generateMovieDBUrl("/movie/upcoming");

  getmovies(url, view, Movies, "Upcoming Movies");
}

function view(data) {
  let out = "";

  data.results.forEach((data) => {
    out += `<div onclick="getdetails('${data.id}')" class="flex flex-none  flex-col rounded-md bg-gray-900 p-1 justify-center items-center max-w-xs border border-green-500">
    <img class="w-60 h-80 rounded" src=${MOVIE_DB_IMAGE_ENDPOINT}${data.poster_path} alt="">
    <h2 style="max-width:15rem" class="text-green-500 font-bold font-serif text-xl text-center mt-2">${data.title}</h2>
    </div>`;
  });
  return out;
}
function searchMovie(query) {
  const url = generateMovieDBUrl("/search/movie") + "&query=" + query;
  // const url = generateMovieDBUrl(`/movie/${data}`);
  getmovies(url, view, Searchmovie, `Searched "${query}"`);
  Movies.classList.add("hidden");
}

function getdetails(data) {
  sessionStorage.setItem("movie_id", data);
  window.location = "movies.html";
}

function getmovie() {
  let id = sessionStorage.getItem("movie_id");

  const url = generateMovieDBUrl(`/movie/${id}`);
  let movie = "";
  fetch(url)
    .then((res) => res.json())
    .then((data) => {
      movie = `<div class="flex md:flex-row flex-col gap-y-5 rounded-md bg-gray-900 p-1 justify-between mt-5  ">
      <div style="max-height:30rem" class=" flex-1 flex  justify-center  ">
      <img class="  border border-green-500 rounded" src=${MOVIE_DB_IMAGE_ENDPOINT}${data.poster_path} alt=""></div>
     <div class="flex-1 flex flex-col gap-y-5 "> 
      <h2  class="text-green-500 font-bold font-serif md:text-5xl text-3xl mt-2 md:ml-0 ml-2">${data.title}</h2>
      <div class="bg-gray-800  mt-5 flex flex-col  gap-y-4 pl-5 pt-5">

      <p class="max-w-sm text-md  font-mono font-medium text-green-500"><strong class="text-md font-mono text-gray-500">Tagline:</strong>${data.tagline}</p>
      <p class="max-w-sm text-md  font-mono font-medium text-green-500"><strong class="text-md font-mono text-gray-500">Genres:</strong>${data.genres[0].name}</p>
       <p class="max-w-sm text-md  font-mono font-medium text-green-500"><strong class="text-md font-mono text-gray-500">language:</strong>${data.original_language}</p>
        <p class="max-w-sm text-md  font-mono font-medium text-green-500"><strong class="text-md font-mono text-gray-500">Release date:</strong>${data.release_date}</p>
          <p class="max-w-sm text-md  font-mono font-medium text-green-500"><strong class="text-md font-mono text-gray-500">Popularity:</strong>${data.popularity}</p><div>

      </div>
      </div>
      <div class="bg-gray-800 pl-5 py-5"> 
        <h1 class="text-gray-500 text-xl font-medium font-mono">OverView:<h1>
        <p class="text-md max-w-xl mt-2 text-green-500">${data.overview}</p>  
      </div>
      </div>`;
      document.querySelector("#Details").innerHTML = movie;
    });
}

function getrelated() {
  let id = sessionStorage.getItem("movie_id");
  const url = generateMovieDBUrl(`/movie/${id}/similar`);
  getmovies(url, view, Related);
}

getTrendingMovies();
document.querySelector(".upcoming").addEventListener("click", getupcomingMovies);
document.querySelector(".Top").addEventListener("click", getTopratedMovies);
document.querySelector(".Popular").addEventListener("click", getPopularMovies);
document.querySelector(".Trending").addEventListener("click", getTrendingMovies);
