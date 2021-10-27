const API_URL = 'https://excessive-trail-bottom.glitch.me/movies';
const TMDB_URL = 'https://api.themoviedb.org/3/search/movie?api_key=' + TMDB_KEY;
const OMDB_URL = `http://www.omdbapi.com/?apikey=${OMDB_KEY}&`
const VIDEO_URL = `https://image.tmdb.org/t/p/w500/`
const cards = $('#card-container')
const starRating = [...document.getElementsByClassName("rating_star")];

function loadMovies() {
    fetch(API_URL)
        .then(results => results.json())
                .then(movieData => {
                    movieData.forEach(movie => {
                        html = `<div class="card movie-card w-75" data-dbid="${movie.id}">
                        <img src="${movie.poster}" class="card-img-top" alt="${movie.title}">
                        <div class="card-body">
                        <h5 class="card-title" id="${movie.id}">${movie.title}</h5>
                        <p class="card-text"><strong>User Rating: </strong>${movie.rating}</p>
                        <p class="card-text"><strong>Genre:</strong> ${movie.genre}</p>
                        <button data-dbid="${movie.id}" class="btn btn-danger deleteBtn" type="button"><i class="fas fa-trash-alt"></i></a>
                        <!-- Button trigger modal -->
                        <button 
                            type="button" 
                            class="btn btn-primary float-right editBtn" 
                            data-toggle="modal" 
                            data-target="#editModal">
                                <i class="far fa-edit"></i>
                        </button>
                        </div>
                        </div>`
                        cards.append(html);
                    })
                })
}
function addMovie() {
    $('#movieTitleInput').on('change', (e) => {
        let input = $('#movieTitleInput').val();
        let imgSrc = 'https://www.themoviedb.org/t/p/w220_and_h330_face/';
        fetch(`${TMDB_URL}&query="${input}"`)
            .then(results => results.json())
            .then(movieData => movieData.results.forEach(movie => {
                console.log(movie.id);
                html = `<img id="${movie.id}" class="posterAdd" src="${imgSrc}${movie.poster_path}">`
                $('#moviePosterSelection').append(html);
                $(`#${movie.id}`).on('click', function (e) {
                    console.log(movie.title);
                    console.log(e);
                    console.log(movie);
                    $('#moviePosterSelection').empty();
                    $('#movieTitleInput').val("");
                    $('#addMovieModal').modal('toggle');
                    $('#addMovieModal').on('hidden.bs.modal', function(e) {
                        loacation.reload();
                    })

                    let title = movie.title;

                    fetch(`${OMDB_URL}t=${title}`)
                        .then(response => response.json())
                        .then(movie => {
                            console.log(movieData);

                            let movieInfo = {
                                id: movie.imdbID,
                                title: movie.Title,
                                rating: movie.imdbRating,
                                poster: movie.Poster,
                                year: movie.Year,
                                genre: movie.Genre
                            }


                            let options = {
                                method: 'POST',
                                headers: {
                                    'Content-Type': 'application/json'
                                },
                                body: JSON.stringify(movieInfo)
                            }
                            fetch(API_URL, options)
                                .then(response => response.json())
                                .then(movie => {
                                    console.log(movie);
                                    cards.empty();
                                    loadMovies();

                                })
                        })


                })
            }))
    })
}
function editMovie(id) {

    //Should use PATCH to change parts rather than PUT to change the whole obj
    let options = {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(id)
    }
     return fetch (`${API_URL}/${id}`, options)
         .then((response=>{
            console.log("edit movie with id:" + id, response);
            console.log(cards);
            cards.empty();
            loadMovies();

             return response.json()
         }))


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

$(window).on('load', function() {
    loadMovies();
        loader.initialize();
        loader.showLoader();
    setTimeout(loader.hideLoader, 6000);
})
$(document).on('click', '.deleteBtn', function (e) {
    let dbID = $(this).attr('data-dbid')
    console.log(dbID);
    deleteMovie(dbID);
})
$(document).on('click', '.editBtn', function (e) {
    e.preventDefault();
    const ID = $(this).parent().parent().attr('data-dbid')
    console.log(ID);

    fetch (`${API_URL}/${ID}`)
        .then(response => response.json())
        .then(function(results) {
            console.log(results);
            $('#movieTitleEdit').val(results.title);
            $('#editRating').val(results.rating);
        })
        .catch(() => {
            $(".modal-title").html("We're sorry, something went wrong.")
        })

    $('.editSubmit').on('click', function(e) {
        e.preventDefault();

        let editedTitle = $('#movieTitleEdit').val();
        let editedRating = $('#editRating').val();

        let movieInfo = {
            title: editedTitle,
            rating: editedRating
        }

        let options = {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(movieInfo)
        }

        fetch (`${API_URL}/${ID}`, options)
            .then(() => location.reload())
            .catch(() => console.log('Something went wrong with the movie edit!'))

    });
});
$('#saveChanges').on('click', addMovie());
$(document).on('dblclick','.movie-card', function() {
    let input = $(this).children().children().eq(0).text();

    fetch(`${TMDB_URL}&query="${input}"&append_to_response=videos`)
        .then(results => results.json())
        .then(movieData => {

            let ID = movieData.results[0].id;
            let rating = $(this).children().children().eq(1).text();
            let genre = $(this).children().children().eq(2).text();

            fetch(`https://api.themoviedb.org/3/movie/${ID}?api_key=${TMDB_KEY}&append_to_response=videos`)
                .then(results => results.json())
                .then(movieData => {
                    console.log(movieData.videos.results);
                    movieData.videos.results.forEach(key => {
                        console.log(key.key)

                    html = `<button id="backClose" class="btn btn-danger mr-3 mt-3">X</button>
                            <div class="jumbotron jumbotron-fluid poster-jumbotron" style="background-image: url(${VIDEO_URL}/${movieData.backdrop_path})">
                                <div class="movieBackInfo d-flex">                                
                                    <div>                                    
                                        <h1 id="movieBackTitle">${movieData.title}</h1>
                                        <p>${movieData.overview}</p>
                                        <img src="${VIDEO_URL}/${movieData.poster_path}" class="posterBack">
                                        <div class="d-flex">
                                            <p class="m-2">${rating}</p>
                                            <p class="m-2">${genre}</p>
                                            <p class="m-2">Release Date: ${movieData.release_date}</p>
                                        </div>
                                    </div>    
                                    <div id="preview" class="align-self-center mr-5">
                                        <iframe width="550" height="300" src="https://www.youtube.com/embed/${key.key}" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
                                    </div>
                                </div>                                
                            </div>`
                        
                    $('.main-container').empty();
                    $('.main-container').append(html)
                })
                    $('#backClose').on('click', function() {
                        location.reload();
                    })
                })
        })






    console.log($(this).children().children().eq(0).attr("id"));


})
