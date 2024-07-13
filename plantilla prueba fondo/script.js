$(document).ready(function () {
    const tamanoTablero = 10;
    const totalCasillas = tamanoTablero * tamanoTablero;
    let jugadorActual = 1;
    let posicionesJugadores = [0, 0];
    let nombresJugadores = ["", ""];
    let listaJugadores = [];
    let victoriasJugadores = {};
    let dificultad = "facil";
    let serpientesYEscaleras;
    PrimeraVezJugando();

    const facilSyE = {
        2: 23,
        8: 34,
        20: 77,
        32: 48,
        41: 79
    };

    const dificilSyE = {
        2: 23,
        8: 34,
        20: 77,
        32: 48,
        41: 79,
        74: 92,
        76: 27,
        97: 42
    };

    function PrimeraVezJugando() {
        document.getElementById("CantidadJugadores").innerHTML = "La cantidad de jugadores inscritos son 0";
    }

    function actualizarSeleccionJugadores() {
        $('#seleccion-jugador1, #seleccion-jugador2').empty();
        listaJugadores.forEach(jugador => {
            $('#seleccion-jugador1, #seleccion-jugador2').append(`<option value="${jugador}">${jugador}</option>`);
        });
    }

    $('#formulario-jugadores').submit(function (event) {
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

        if (dificultad === "facil") {
            $('#tablero').removeClass('fondo-dificil').addClass('fondo-facil');
        } else {
            $('#tablero').removeClass('fondo-facil').addClass('fondo-dificil');
        }

        crearTablero();
        actualizarTablero();
    });

    $('#nuevo-jugador').click(function () {
        $('#modal-nuevo-jugador').show();
    });

    $('#ver-estadisticas').click(function () {
        mostrarEstadisticas();
        $('#modal-estadisticas').show();
    });

    $('.cerrar').click(function () {
        $('.modal').hide();
    });

    $('#form-nuevo-jugador').submit(function (event) {
        event.preventDefault();
        const nuevoJugador = $('#nombre-nuevo-jugador').val().trim();

        if (nuevoJugador === "") {
            alert('El nombre del jugador no puede estar vacío.');
            return;
        }

        if (listaJugadores.includes(nuevoJugador)) {
            alert('Ya existe un jugador con ese nombre.');
            return;
        }

        let CantJuga = "La cantidad de jugadores inscritos son " + (listaJugadores.length + 1);
        document.getElementById("CantidadJugadores").innerHTML = CantJuga;
        listaJugadores.push(nuevoJugador);
        victoriasJugadores[nuevoJugador] = 0;
        actualizarSeleccionJugadores();
        $('#nombre-nuevo-jugador').val('');
    });

    $('#regresar').click(function () {
        $('#pantalla-juego').hide();
        $('#pantalla-principal').show();
    });

    $('#lanzar-dado').click(function () {
        const resultado = Math.floor(Math.random() * 6) + 1;
        $('#numero-dado').text(resultado);
        moverJugador(resultado);
    });

    function crearTablero() {
        const $tablero = $('#tablero');
        $tablero.empty();
        for (let i = totalCasillas; i > 0; i--) {
            $tablero.append(`<div id="casilla-${i}">${i}</div>`);
        }
    }

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

    function verificarSyE() {
        const posicion = posicionesJugadores[jugadorActual - 1];
        if (serpientesYEscaleras[posicion]) {
            posicionesJugadores[jugadorActual - 1] = serpientesYEscaleras[posicion];
        }
    }

    function actualizarTablero() {
        $('#tablero div').removeClass('jugador1 jugador2');
        $('#casilla-' + posicionesJugadores[0]).addClass('jugador1');
        $('#casilla-' + posicionesJugadores[1]).addClass('jugador2');
    }

    function actualizarVictorias(nombreJugador) {
        victoriasJugadores[nombreJugador]++;
        mostrarEstadisticas();
        generarGrafico();
    }

    function mostrarEstadisticas() {
        $('#estadisticas-jugadores').empty();
        for (const jugador in victoriasJugadores) {
            $('#estadisticas-jugadores').append(`<p>${jugador}: ${victoriasJugadores[jugador]} victorias</p>`);
        }
    }

    function reiniciarJuego() {
        posicionesJugadores = [0, 0];
        jugadorActual = 1;
        $('#jugador-actual').text(nombresJugadores[jugadorActual - 1]);
        actualizarTablero();
    }

    function generarGrafico() {
        google.charts.load('current', {'packages': ['corechart']});
        google.charts.setOnLoadCallback(grafico);

        function grafico() {
            const data = new google.visualization.DataTable();
            data.addColumn('string', 'Jugador');
            data.addColumn('number', 'Victorias');
            for (const jugador in victoriasJugadores) {
                data.addRow([jugador, victoriasJugadores[jugador]]);
            }

            const options = {
                title: 'Victorias por Jugador',
                pieHole: 0.4,
                width: 800,
                height: 800
            };

            const pieChart = new google.visualization.PieChart(document.querySelector('#pieChart div'));
            pieChart.draw(data, options);
        }
    }

    generarGrafico(); // Generar el gráfico inicialmente
});