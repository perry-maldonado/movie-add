const API_URL = 'https://excessive-trail-bottom.glitch.me/movies';
const TMDB_URL = 'https://api.themoviedb.org/3/search/movie?api_key=' + TMDB_KEY;
const cards = document.querySelector('#card-container')

fetch(API_URL)
    .then(response => response.json())
    .then(movieData => {
        console.log(movieData)
        movieData.forEach(movie => {
            console.log(movie.title)
            console.log(movie.actors)
            html = `<div class="card">
                <img src="${movie.poster}" class="card-img-top" alt="${movie.title}">
                 <div class="card-body">
                <h5 class="card-title">${movie.title.toUpperCase()}</h5>
                <p class="card-text">User Rating:${movie.rating}</p>
                <p class="card-text">Genre: ${movie.genre}</p>
                </div>
                </div>`
            $('#card-container').append(html);
        })
    })

function addMovie() {
    $('#movieTitleInput').on('change', (e) => {
        let input = $('#movieTitleInput').val();
        let imgSrc = 'https://www.themoviedb.org/t/p/w220_and_h330_face/';
        fetch(`${TMDB_URL}&query="${input}"`)
            .then(results => results.json())
            .then(movieData => movieData.results.forEach(movie => {
                console.log(movie.poster_path);
                html = `<img src="${imgSrc}${movie.poster_path}">`
                $('#moviePosterSelection').append(html);
            }))
    })


}



$('#saveChanges').on('click', addMovie());

const starRating = [...document.getElementsByClassName("rating_star")];

function rating(stars) {
    const starClassActive = "rating-start fas fa-star";
    const starClassInactive = "rating-start far fa-star";
    const starsLength = stars.length;
    let i;
    stars.map((star) => {
        star.onclick = () => {
            i = stars.indexOf(star);
            if (star.className === starClassInactive) {
                for (i; i >= 0; --i) stars[i].className = starClassActive;

            } else {
                for (i; i < starsLength; ++i) stars[i].className = starClassInactive;
            }
        };
    })
}

rating(starRating);


