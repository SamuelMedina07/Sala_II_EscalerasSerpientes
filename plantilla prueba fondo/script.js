$(document).ready(function () {
    const tamanoTablero = 10;
    const totalCasillas = tamanoTablero * tamanoTablero;
    let jugadorActual = 1;
    let posicionesJugadores = [0, 0];
    let nombresJugadores = ["", ""];
    let listaJugadores = [];
    let victoriasJugadores = {};
    let perdidasJugadores ={};
    let partidasJugadas={};
    let partidasAbandonadas={};
    let dificultad = "facil";
    let serpientesYEscaleras;
    let movimientosTotales=0;
    PrimeraVezJugando();

    const facilSyE = {
        3: 21,
        7: 14,
        10: 38,
        32: 48,
        30: 49,
        41: 64,
        59: 86,
        71: 92,
        89: 99,
        97: 78,
        94: 47,
        83: 27,
        

    };

    const dificilSyE = {
        3: 21,
        7: 14,
        10: 38,
        32: 48,
        30: 49,
        41: 64,
        59: 86,
        71: 92,
        89: 99,
        97: 78,
        94: 47,
        83: 27,
        69: 17,
        52: 25,
        36: 5,
        32: 1
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
            reiniciarJuego();
        } else {
            $('#tablero').removeClass('fondo-facil').addClass('fondo-dificil');
            reiniciarJuego();
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
        perdidasJugadores[nuevoJugador] = 0;
        partidasJugadas[nuevoJugador]=0;
        partidasAbandonadas[nuevoJugador]=0;
        actualizarSeleccionJugadores();
        $('#nombre-nuevo-jugador').val('');
    });

    $('#regresar').click(function () {
        $('#pantalla-juego').hide();
        $('#pantalla-principal').show();
    });

    function getRandomValue(max, min){
        valor = parseInt(Math.random() * (max - min) + min);
        return valor;
        //alert(valor);
    }

    $('#lanzar-dado').click(function () {
        const resultado = getRandomValue(6,1);
        $('#numero-dado').text(resultado);
        moverJugador(resultado);
        movimientosTotales++;
    });



    function crearTablero() {
        const $tablero = $('#tablero');
        $tablero.empty();
        for (let i = totalCasillas; i > 0; i--) {
            $tablero.append(`<div id="casilla-${i}">${i}</div>`);
        }
    }

    $('#abandonar').click(function () {

        if (movimientosTotales<2)
        {
           alert(`ERROR NO PUEDE ABANDONAR EN SU PRIMER MOVIMIENTO ${nombresJugadores[jugadorActual - 1]} SOLO SE PUEDE ABANDONAR APARTIR DE SU SEGUNDO MOVIMIENTO`); 
        }
        else{
            let confirmResult = confirm(`¿Quieres abandonar ${nombresJugadores[jugadorActual - 1]}?`);

            if (confirmResult) {
                alert(`${nombresJugadores[jugadorActual - 1]} ha abandonado la partida`);
                actualizarPerdidas(nombresJugadores[jugadorActual - 1])
                actualizarAbandonos(nombresJugadores[jugadorActual - 1])
                alert(`¡${nombresJugadores[jugadorAnterior -1]} ha ganado por default!`); 
                actualizarVictorias(nombresJugadores[jugadorAnterior -1]);   
    
                reiniciarJuego();
                $('#pantalla-juego').hide();
            $('#pantalla-principal').show();
                
            } else {
                alert("¡Continua Jugando!");
            }
    

        }
           });

   

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
            actualizarVictorias(nombresJugadores[jugadorActual - 1])
            alert(`¡${nombresJugadores[jugadorAnterior -1]} ha perdido!`); 
            actualizarPerdidas(nombresJugadores[jugadorAnterior -1]);   

            reiniciarJuego();
            $('#pantalla-juego').hide();
            $('#pantalla-principal').show();

            return;
        }
        jugadorActual = jugadorActual === 1 ? 2 : 1;
        /* alert('Jugador Actual'+ nombresJugadores[jugadorActual - 1]); */
        $('#jugador-actual').text(nombresJugadores[jugadorActual - 1]);
        jugadorAnterior = jugadorActual === 2 ? 1 : 2;;
        /* alert('Jugador Anterior'+ nombresJugadores[jugadorAnterior -1]); */


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
        partidasJugadas[nombreJugador]++;
        mostrarEstadisticas();
        generarGrafico();
    }
    function actualizarPerdidas(nombreJugador){
        perdidasJugadores[nombreJugador]++;
        partidasJugadas[nombreJugador]++;
        mostrarEstadisticas();
    }
    function actualizarAbandonos(nombreJugador){
        partidasAbandonadas[nombreJugador]++;
        mostrarEstadisticas();
    }

    function mostrarEstadisticas() {

        $('#estadisticas-jugadores').empty();
        for (const jugador in victoriasJugadores) {
            $('#estadisticas-jugadores').append(`<p>${jugador}= Partidas Jugadas:${partidasJugadas[jugador]}
                Victorias:${victoriasJugadores[jugador]} Perdidas: ${perdidasJugadores[jugador]}
                Abandonos: ${partidasAbandonadas[jugador]}</p> `);
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