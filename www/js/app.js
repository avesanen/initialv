requirejs.config({
    //By default load any module IDs from js/lib
    baseUrl: '/',
    paths: {
        game: '/js/game',
        lib: '/js/lib'
    }
});

// Start the main app logic.
requirejs(['lib/jquery', 'game/game'],
    function   ($,game) {
    }
);