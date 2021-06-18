'use strict';
let count = 0;
let movieDisplay;
let movie;
let movieList;
let form;
let inputs;
let textAreaInput;

// event handlers
const handleAddNewToggle = e => {
    const moviesDisplay = resetMovies();
    form.classList.toggle("hidden")
    toggleAddMovieButtonText();
}

const handleAddNewSubmit = e => {
    e.preventDefault();
    const newMovieInfo = getMovieToPost();
    axios.post("http://localhost:8080/movie/create", newMovieInfo)
    .then(res=>{
        console.log(res);
        handleAddNewToggle();
        movieDisplay.innerHTML = "";
        movieDisplay.innerHTML = "Movie Successfully Created";
        setTimeout(()=>{
            window.location.reload(true);
        }, 1500)
    })
    .catch(err=>{
        movieDisplay.innerHTML = "";
        movieDisplay.innerHTML = "Something went wrong"
    })
}

const handleRatingChange = e => {
    const ratingLabel = document.querySelector("#rating-label");
    const rangeInput = document.querySelector("#rating-input");
    const newVal = rangeInput.value;

    ratingLabel.innerHTML = "Rating " + newVal + "/10";
}

// helpers
const resetDisplay = () => {
    const displayDiv = document.querySelector(".display");
    displayDiv.innerHTML = "";
    return displayDiv;
}

const resetMovies = () => {
    const moviesDisplay = document.querySelector(".movies");
    moviesDisplay.innerHTML = "";
}

const getMovieToPost = () => {
    let newMovieToAdd = {};
    inputs.forEach(input=>{
        newMovieToAdd = {...newMovieToAdd, [input.name]: input.value};
    })
    newMovieToAdd[textAreaInput.name] = textAreaInput.value;
    return newMovieToAdd;
}

const toggleAddMovieButtonText = () => {
    count++;
    const button = document.querySelector("#add-new-movie-button");
    button.innerHTML = ""
    button.innerText = "";
    if (count % 2 !== 0) {
        button.innerHTML = "Cancel"
        button.innerText = "Cancel";
    } else {
        button.innerHTML = "Add Movie to Database"
        button.innerText = "Add Movie to Database";
    }
}

const getAllMovies = () => {
    return axios.get("http://localhost:8080/movie/getAll");
}

const displayAllMovies = () => {
    movieDisplay.innerHTML = "";
    getAllMovies()
    .then(res=>{
        movieList = [...res.data]
        res.data.forEach(movie=>{
            movieDisplay.appendChild(createShortMovieDisplay(movie));
        })
    })
}

const handleUpdateToggle = e => {

}

const viewFullMovie = e => {
    movie.innerHTML = "";
    const movieInfo = movieList.filter(movie=>movie.id === Number(e.target.id))[0];
    movie.appendChild(createFullMovieDisplay(movieInfo));

}

const createShortMovieDisplay = movie => {
    const {title, year, id} = movie;

    const container = document.createElement("div");
    container.style.display = "flex";
    const updateButton = document.createElement("button");
    updateButton.addEventListener("click", handleUpdateToggle);
    updateButton.innerHTML = "Update Movie"
    const titleA = document.createElement("a");
    titleA.href="#";
    titleA.id = id;
    titleA.onclick = viewFullMovie;
    titleA.style.margin = "auto 2%";
    titleA.innerHTML = title;
    const yearP = document.createElement("p");
    yearP.style.margin = "auto 2%";
    yearP.innerHTML = year;
    container.appendChild(titleA);
    container.appendChild(yearP);
    container.appendChild(updateButton);
    return container;
}

const createFullMovieDisplay = movie => {
    const {title, year, rating, summary} = movie;

    const container = document.createElement("div");
    container.style.width = "80%";
    container.style.margin = "auto";
    container.style.border = "solid black 1px";
    container.style.textAlign = "center";

    const movieTitle = document.createElement("h3");
    const movieYear = document.createElement("h5");
    const movieRating = document.createElement("p");
    const movieSummary = document.createElement("p");

    movieTitle.innerHTML = title;
    movieYear.innerHTML = "Released: " + year;
    movieRating.innerHTML = "Rating: " + rating + "/10";
    movieSummary.innerHTML = summary;

    container.appendChild(movieTitle);
    container.appendChild(movieYear);
    container.appendChild(movieRating);
    container.appendChild(movieSummary);

    return container;
}

window.onload = (()=>{
    movieDisplay = document.querySelector(".movies");
    displayAllMovies();
    form = document.querySelector(".add-movie-form");
    inputs = document.querySelectorAll(".add-movie-form input");
    textAreaInput = document.querySelector("#summary-input");
    movie = document.querySelector(".movie");
    movie.style.marginTop = "2%";
    const submitButton = document.querySelector("#new-movie-submit");
    submitButton.addEventListener("click", handleAddNewSubmit);
})