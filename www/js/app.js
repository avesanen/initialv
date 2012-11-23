requirejs.config({
    //By default load any module IDs from js/lib
    baseUrl: '/',
    paths: {
        game: '/js/game',
        lib: '/js/lib',
        'socket.io': 'socket.io/socket.io'
    }
});

// Start the main app logic.
requirejs(['lib/jquery', 'game/game'],
    function   ($,game) {
    }
);