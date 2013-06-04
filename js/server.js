var express = require("express"),
    http = require('http'),
    events = require("events"),
    io = require('socket.io'),
    app = express();

exports.Server = Server = function()
{
    this.clientId = 1;
};
//inicjalizacja serwera
Server.prototype.init = function(port)
{
//Tworzenie serwera
    this.server = http.createServer(app);
//Ustaw ścieżkę do folderu aplikacji "klienta"
    app.use(express.static(__dirname + '/../public'));
	//Nasłuchiwanie portu
    this.server.listen(port);
	// Inicjalizacja gniazda
    this.startSockets();
    this.em = new events.EventEmitter();
    console.log('Nasluchuje na : ' + port);
};
Server.prototype.startSockets = function()
{
//nasłuchuje na serwerze
    this.socket = io.listen(this.server);
    this.socket.configure( function()
    {
        this.socket.set('log level', 1);
    }.bind(this));
	// dodłączenie użytkownika
    this.socket.of('/waz').on('connection', function(client)
    {
        client.wazId = this.clientId;
        this.clientId++;
		// odpowiedź do gracza 
        client.emit('response', {wazId: client.wazId});
		// odpowiedź do reszty użytkowników
		this.socket.of('/waz').emit('Waz.newWaz',client.wazId);
        this.em.emit('Server.newWaz', client.wazId);
		// naciśniecie strzałki na klawat...
        client.on('Waz.requestDirection', function (data)
        {
        //odzyskuje ustawienie użytkownika i wpisany kierunek 
            this.em.emit('Waz.changeDirection',
            {
                id: client.wazId,
                direction: data.direction
            });
        }.bind(this));
		//jeśli się rozłączy
        client.on('disconnect', function(){
            this.socket.of('/waz').emit('Waz.disconnect',client.wazId);

            this.em.emit('Waz.disconnect', client.wazId);
        }.bind(this));

    }.bind(this));


};
// wysyła aktualizacje węża
Server.prototype.update = function(weze, bonus)
{
    this.socket.of('/waz').emit('update', weze, bonus);
};
