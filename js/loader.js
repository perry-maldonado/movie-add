let loader = {
    initialize : function() {
        let html =
            `<div class="loading-overlay"></div>
             <div class="loading-overlay-image-container">
                <img src="../assets/loading.gif" class="loading-overlay-img">
             </div>`

        $('body').append(html);
    },

    showLoader : function() {
        $('.loading-overlay').show();
        $('.loading-overlay-image-container').show();
    },

    hideLoader : function() {
        $('.loading-overlay').hide();
        $('.loading-overlay-img').hide();
    }

}

