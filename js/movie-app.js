const API_URL = 'https://excessive-trail-bottom.glitch.me/movies';
const TMDB_URL = 'https://api.themoviedb.org/3/search/movie?api_key=' + TMDB_KEY;
const cards = $('#card-container')

loadMovies();
function loadMovies() {
    fetch(API_URL)
        .then(response => response.json())
        .then(movieData => {

            movieData.forEach(movie => {
                html = `<div class="card w-75">
                <img src="${movie.poster}" class="card-img-top" alt="${movie.title}">
                 <div class="card-body">
                <h5 class="card-title">${movie.title.toUpperCase()}</h5>
                <p class="card-text">User Rating:${movie.rating}</p>
                <p class="card-text">Genre: ${movie.genre}</p>
                <button data-dbid="${movie.id}" class="btn btn-danger deleteBtn" type="button"><i class="fas fa-trash-alt"></i></a>
                </div>
                </div>`
                cards.append(html);
            })
        })
}

$(document).on('click','.deleteBtn', function(e) {
    let dbID = $(this).attr('data-dbid')
    console.log(dbID);
    deleteMovie(dbID);
})

function addMovie() {
    $('#movieTitleInput').on('change', (e) => {
        let input = $('#movieTitleInput').val();
        let imgSrc = 'https://www.themoviedb.org/t/p/w220_and_h330_face/';
        fetch(`${TMDB_URL}&query="${input}"`)
            .then(results => results.json())
            .then(movieData => movieData.results.forEach(movie => {
                html = `<img id="${movie.id}" class="posterAdd" src="${imgSrc}${movie.poster_path}">`
                $('#moviePosterSelection').append(html);
                $(`#${movie.id}`).on('click', function() {
                    let movieInfo = {
                        title: movie.title,
                        rating: "rating",
                        poster: `https://www.themoviedb.org/t/p/w220_and_h330_face${movie.poster_path}`,
                        year: "",
                        genre: movie.genre_ids
                    }

                    let options = {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify(movieInfo)
                    }
                    return fetch(API_URL, options)
                        .then(response => response.json())
                        .then(movie => {
                            cards.empty();
                            loadMovies();
                        })
                })
            }))
    })
}

function deleteMovie(id) {
    let options = {
        method: 'DELETE'
    }

    fetch(`${API_URL}/${id}`, options)
        .then((response => {
            console.log("Deleted movie with id:" + id, response);
            console.log(cards);
            cards.empty();
            loadMovies();
        }))

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