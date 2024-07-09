// script.js
$(document).ready(function() {
    const tamanoTablero = 10;
    const totalCasillas = tamanoTablero * tamanoTablero;
    let jugadorActual = 1;
    let posicionesJugadores = [0, 0];
    let nombresJugadores = ["", ""];
    let listaJugadores = [];
    let victoriasJugadores = {};
    let dificultad = "facil";
    let serpientesYEscaleras;
    
    const facilSyE = {
        2: 23,
        8: 34,
        20: 77,
        32: 48,
        41: 79
    };

    /**
     * Represents a mapping of difficult positions to easier positions in a game.
     * @type {Object<number, number>}
    */
   const dificilSyE = {
        2: 23,
        8: 34,
        20: 77,
        32: 48,
        41: 79,
        74: 92,
        89: 69,
        99: 5
    };
    
    /**
     * Actualiza la selección de jugadores en los elementos de lista desplegable.
    */
   function actualizarSeleccionJugadores() {
       $('#seleccion-jugador1, #seleccion-jugador2').empty();
       listaJugadores.forEach(jugador => {
           $('#seleccion-jugador1, #seleccion-jugador2').append(`<option value="${jugador}">${jugador}</option>`);
        });
    }
    
    /**
     * Represents a game of serpientes y escaleras.
     * @file script.js
     * @summary This file contains the JavaScript code for the serpientes y escaleras game.
     * @description The game allows two players to take turns rolling a dice and moving their respective tokens on a game board.
     * The game includes snakes and ladders that can either help or hinder the players' progress.
     * The players' names, game difficulty, and game statistics are stored and displayed.
     * The game can be reset and restarted at any time.
     * @requires jQuery
     */
    
    $('#formulario-jugadores').submit(function(event) {
        event.preventDefault();
        nombresJugadores[0] = $('#seleccion-jugador1').val();
        nombresJugadores[1] = $('#seleccion-jugador2').val();
        dificultad = $('#dificultad').val();
        
        if (!nombresJugadores[0] || !nombresJugadores[1]) {
            alert('Por favor, seleccione ambos jugadores.');
            return;
        }
        
        if (nombresJugadores[0] === nombresJugadores[1]) {
            alert('Los jugadores no pueden tener el mismo nombre.');
            return;
        }
        
        serpientesYEscaleras = dificultad === "facil" ? facilSyE : dificilSyE;
        $('#jugador-actual').text(nombresJugadores[jugadorActual - 1]);
        $('#pantalla-principal').hide();
        $('#pantalla-juego').show();
        crearTablero();
        actualizarTablero();
    });
    
    $('#nuevo-jugador').click(function() {
        $('#modal-nuevo-jugador').show();
    });

    $('#ver-estadisticas').click(function() {
        mostrarEstadisticas();
        $('#modal-estadisticas').show();
    });

    $('.cerrar').click(function() {
        $('.modal').hide();
    });

    $('#form-nuevo-jugador').submit(function(event) {
        event.preventDefault();
        /**
         * Represents the value of the input field for the new player's name.
         * @type {string}
         */
        const nuevoJugador = $('#nombre-nuevo-jugador').val().trim();
        
        if (nuevoJugador === "") {
            alert('El nombre del jugador no puede estar vacío.');
            return;
        }
        
        if (listaJugadores.includes(nuevoJugador)) {
            alert('Ya existe un jugador con ese nombre.');
            return;
        }
        
        listaJugadores.push(nuevoJugador);
        victoriasJugadores[nuevoJugador] = 0;
        actualizarSeleccionJugadores();
        $('#modal-nuevo-jugador').hide();
        $('#nombre-nuevo-jugador').val('');
    });

    $('#regresar').click(function() {
        $('#pantalla-juego').hide();
        $('#pantalla-principal').show();
    });

    $('#lanzar-dado').click(function() {
        /**
         * Represents the result of a random number generation.
         * @type {number}
         */
        const resultado = Math.floor(Math.random() * 6) + 1;
        $('#numero-dado').text(resultado);
        moverJugador(resultado);
    });

    /**
     * Creates the game board by appending div elements to the tablero element.
     */
    function crearTablero() {
        const $tablero = $('#tablero');
        $tablero.empty();
        for (let i = totalCasillas; i > 0; i--) {
            $tablero.append(`<div id="casilla-${i}">${i}</div>`);
        }
    }

    /**
     * Moves the player to a new position based on the given result.
     * If the new position is equal to the total number of squares, the player wins the game.
     * Otherwise, the current player is updated and the board is updated.
     * @param {number} resultado - The result of the player's move.
     * @returns {void}
     */
    function moverJugador(resultado) {
        const posicionActual = posicionesJugadores[jugadorActual - 1];
        let nuevaPosicion = posicionActual + resultado;
        if (nuevaPosicion > totalCasillas) {
            nuevaPosicion = totalCasillas;
        }
        posicionesJugadores[jugadorActual - 1] = nuevaPosicion;
        verificarSyE();
        actualizarTablero();
        if (nuevaPosicion === totalCasillas) {
            alert(`¡${nombresJugadores[jugadorActual - 1]} ha ganado!`);
            actualizarVictorias(nombresJugadores[jugadorActual - 1]);
            reiniciarJuego();
            return;
        }
        jugadorActual = jugadorActual === 1 ? 2 : 1;
        $('#jugador-actual').text(nombresJugadores[jugadorActual - 1]);
    }

    /**
     * Verifies if the current player has landed on a snake or ladder position and updates their position accordingly.
     */
    function verificarSyE() {
        const posicion = posicionesJugadores[jugadorActual - 1];
        if (serpientesYEscaleras[posicion]) {
            posicionesJugadores[jugadorActual - 1] = serpientesYEscaleras[posicion];
        }
    }

    /**
     * Updates the game board by adding appropriate classes to the cells based on player positions.
     */
    function actualizarTablero() {
        $('#tablero div').removeClass('jugador1 jugador2');
        $('#casilla-' + posicionesJugadores[0]).addClass('jugador1');
        $('#casilla-' + posicionesJugadores[1]).addClass('jugador2');
    }

    /**
     * Actualiza el número de victorias de un jugador y muestra las estadísticas actualizadas.
     * @param {string} nombreJugador - El nombre del jugador cuyas victorias se van a actualizar.
     */
    function actualizarVictorias(nombreJugador) {
        victoriasJugadores[nombreJugador]++;
        mostrarEstadisticas();
    }

    /**
     * Displays the statistics of players.
     */
    function mostrarEstadisticas() {
        $('#estadisticas-jugadores').empty();
        for (const jugador in victoriasJugadores) {
            $('#estadisticas-jugadores').append(`<p>${jugador}: ${victoriasJugadores[jugador]} victorias</p>`);
        }
    }

    /**
     * Reinicia el juego, restableciendo las posiciones de los jugadores y actualizando el tablero.
     */
    function reiniciarJuego() {
        posicionesJugadores = [0, 0];
        jugadorActual = 1;
        $('#jugador-actual').text(nombresJugadores[jugadorActual - 1]);
        actualizarTablero();
    }
});


