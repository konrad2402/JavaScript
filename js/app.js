var Server = require('./server.js').Server;
var Waz = require('./waz.js').Waz;

var s = new Server();
s.init(5000);

var weze = {};
// utwórz nowy wąż jak się ktoś zaloguje
s.em.addListener('Server.newWaz', function(playerId)
{
    var waz = new Waz();
    waz.init(playerId);
    weze[playerId] = waz;
});
// gdy się rozłączy 
s.em.addListener('Waz.disconnect', function(playerId)
{// komunikat w terminalu po rozłączeniu się użytkownika
    console.log('Gracz zrezygnował');
    delete waze[playerId];
});
//naciśnięcie przycisku na klawiaturze
s.em.addListener('Waz.changeDirection', function(data)
{
// metodą setDirection, zdefiniowana w waz.js
    weze[data.id].setDirection(data.direction);
});

var updateSate = function ()
{
//d la każdego indeksu w tablicy
    for (var i in weze)
    {
//pozycja poruszania
        weze[i].doStep();
    }
//aktualizuje pozycje węży 
	s.update(weze);
};
// co 100ms
var tick = setInterval(updateSate, 100);










