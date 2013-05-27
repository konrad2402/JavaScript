var express = require("express"),
    http = require('http'),
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
//Ustaw �cie�k� do folderu aplikacji "klienta"
    app.use(express.static(__dirname + '/../public'));
	//Nas�uchiwanie portu
    this.server.listen(port);
	// Inicjalizacja gniazda
    this.startSockets();
    this.em = new events.EventEmitter();
    console.log('Listening port : ' + port);
};
Server.prototype.startSockets = function()
{
//nas�uchuje na serwerze
    this.socket = io.listen(this.server);
//Akcja po��czenia u�ytkownika
    this.socket.of('/waz').on('connection', function(client)
    {
        client.wazId = this.clientId;
        this.clientId++;
		//odpowied� di klienta
        client.emit('response', {wazId: client.wazId});
		//je�li si� roz��czy
        client.on('disconnect', function(){
            this.socket.of('/waz').emit('Waz.disconnect',client.wazId);
        }.bind(this));

    }.bind(this));


};