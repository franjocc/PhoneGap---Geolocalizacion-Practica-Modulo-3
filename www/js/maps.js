var app={
    variables: {
        posicionClick: null,
        posicionCirculo: null,
        posicionActual: null,
        miMapa: null
     },

    inicio: function(){
        this.iniciaFastClick();
    },

    iniciaFastClick: function(){
        FastClick.attach(document.body);
    },
    
    dispositivoListo: function(){
        navigator.geolocation.getCurrentPosition(app.pintaCoordenadasEnMapa, app.errorAlSolicitarLocalizacion);
    },
    
    pintaCoordenadasEnMapa: function(position){  

        // 'L' hace referencia a un objeto de la librería leaflet.js
		app.variables.miMapa = L.map('map').setView([position.coords.latitude, position.coords.longitude], 13);
        
        L.tileLayer('https://api.mapbox.com/styles/v1/mapbox/outdoors-v10/tiles/256/{z}/{x}/{y}?access_token=pk.eyJ1IjoiZnJhbmpvY2MiLCJhIjoiY2l5NjFnZGk5MDA4azJxbzA5cnJ4MGpqeiJ9.DaRRHBU7vg6NUB75sfpbKw', {
            attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributions, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery o <a href="http://mapbox.com">Mapbox</a>',
            maxZoom: 18
    	}).addTo(app.variables.miMapa); 
        
        app.pintaMarcador([position.coords.latitude, position.coords.longitude], 'Estoy aqui!', app.variables.miMapa, true);
        
        app.variables.miMapa.doubleClickZoom.disable(); // Desactivamos el zoom con double click para captura el evento doubleclick (dblclick), para pintar un circulo con 1km de radio.
        
        app.variables.miMapa.on('click', function(evento){
            var texto = 'Marcador en l(' + evento.latlng.lat.toFixed(2) + ') y L(' + evento.latlng.lng.toFixed(2) + ')';
            app.pintaMarcador(evento.latlng, texto, app.variables.miMapa, false);
        });
        
        app.variables.miMapa.on('dblclick', function(evento){
            var texto = 'Mi Alrededor en l(' + evento.latlng.lat.toFixed(2) + ') y L(' + evento.latlng.lng.toFixed(2) + ')';
            app.pintaCirculo(evento.latlng, texto, app.variables.miMapa, false);
        });   
        
        navigator.geolocation.watchPosition(app.actualizaPosicionActualMapa, app.errorAlSolicitarLocalizacion, {timeout: 30000});
     },
    
    actualizaPosicionActualMapa: function(position){
        if (app.variables.miMapa != null) {
            app.pintaMarcador([position.coords.latitude, position.coords.longitude], 'Ahora estoy aqui!', app.variables.miMapa, true);
        }
    },
    
    pintaMarcador: function(latlng, texto, mapa, bPosicionActual) {
        var greenIcon = L.icon({
            //iconUrl: 'img/market-icon-green.png',
            iconUrl: 'https://cdn.rawgit.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-green.png',
            shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',            
            iconSize:     [25, 40], // size of the icon
            iconAnchor:   [25, 40], // point of the icon which will correspond to marker's location
            popupAnchor:  [-13, -35] // point from which the popup should open relative to the iconAnchor
        });      
        
        if (bPosicionActual) {
            if (app.variables.posicionActual != null) {
                mapa.removeLayer(app.variables.posicionActual);
            }
            app.variables.posicionActual = L.marker(latlng, {icon: greenIcon}).addTo(mapa);
            app.variables.posicionActual .bindPopup(texto).openPopup();
        }
        else {
            if (app.variables.posicionClick != null) {
                mapa.removeLayer(app.variables.posicionClick);
            }
            
            app.variables.posicionClick = L.marker(latlng).addTo(mapa);
            app.variables.posicionClick.bindPopup(texto).openPopup();
            
            app.variables.posicionClick.on("dblclick", function (evento) {
                var texto2 = 'Mi Alrededor en l(' + evento.latlng.lat.toFixed(2) + ') y L(' + evento.latlng.lng.toFixed(2) + ')';
                app.pintaCirculo(evento.latlng, texto2, mapa);
            });
        }    
        
    },
    
    pintaCirculo: function(latlng, texto, mapa) {
        if (app.variables.posicionCirculo != null) {
            mapa.removeLayer(app.variables.posicionCirculo);
        }

        app.variables.posicionCirculo = L.circle(latlng, {
            color: 'red',
            fillColor: '#f03',
            fillOpacity: 0.5,
            radius: 1000
        }).addTo(mapa);
        app.variables.posicionCirculo.bindPopup(texto).openPopup();
    },    
    
    errorAlSolicitarLocalizacion: function(error) {
        console.log(error.code + ': ' + error.message);
    }
};

if('addEventListener' in document){
    document.addEventListener('DOMContentLoaded',function() {
    app.inicio();
    },false);
    document.addEventListener('deviceready', function() {
        app.dispositivoListo();
    }, false);
}
