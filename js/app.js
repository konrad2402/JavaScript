var Server = require('./server.js').Server;
var Waz = require('./waz.js').Waz;
var Bonus = require('./bonus.js').Bonus;

var s = new Server();
s.init(5000);
var weze = {};
var bonus = {};
var newBonus = 0;
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
    console.log('Client disconnected');
    delete weze[playerId];
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
    checkColisions();
	s.update(weze, bonus);
};
function checkColisions()
{
// spotkanie pomiędzy wężami i premią
    for (var i in weze)
    {
//  zawiera aktualnego węża
        var waz = weze[i];


        for (var j in bonus)
        {
            if(waz.hasColision(bonus[j]))
            {
//Usuwamy bonus i zwiększa rozmiar węża z funkcją addLength ();
                waz.addLength();
//  zlicza punkty awęża
                waz.eatBonus(bonus[j]);

                delete bonus[j];
                newBonus++;
// co 3-eci bonus jest extra, nie 10 a 30punktów
                if (newBonus % 3 === 0)
                {
                    addSpecialBonus();
                }
                else
                {
                    addBonus();
                }
                break;
            }
        }
    }
// tabela, która będzie zawierać wszystkie węże aby zrestartować
	var resetWeze = [];
// kolizja węży
    for (i in weze)
    {
        var waz = weze[i];

        for (var l in weze)
        {
            for (var k in weze[l].elements)
            {
// jeśli sam się zjada
                if (weze[l].playerId == waz.playerId &&
                    k == weze[l].elements.length - 1)
                {
                    continue;
                }
                if (waz.hasColision(weze[l].elements[k]))
                {
                   resetWeze.push(waz);

                    if (weze[l].playerId != waz.playerId)
                    {
                        weze[l].kill();
                    }
                }
            }
        }
    }
//Death węża
    for (var m in resetWeze)
    {
        resetWeze[m].die();
    }
}
// specjalny bonus
function addSpecialBonus()
{
    for (var i=0; i<1; i++)
    {
        bonus[i] = new Bonus();
        bonus[i].init();
        bonus[i].specialBonus();
    }
}
// zwykly bonus
function addBonus()
{
    for (var i=0; i<1; i++)
    {
        bonus[i] = new Bonus();
        bonus[i].init();
    }
}
// co 100ms
var tick = setInterval(updateSate, 100);
addBonus();
