var canvas,
    context,
    server,
    wazId,
    STAGE_HEIGHT = 50,// wielkość planszy
    STAGE_WIDTH = 70,
    BLOCK_HEIGHT = 10,//wielkość pól
    BLOCK_WIDTH = 10;
// polaczenie z uzytkownikiem
function connect ()
{
    //laczenie z url serwera
    server = io.connect('http://localhost:5000/waz');
    // serer wysyla odpowiedz po zalogowaniu uzytkownika
    server.on('response', function (data)
    {
	// wyswietla w przegladarce uzytkownika
        console.log('Waz Id response : ' + data.wazId);
        wazId = data.wazId;
    });
	// gdy się loguje
    server.on('Waz.newWaz', function(client){
        drawConnectEvents(client);
    });
	// gdy się rozłączy
    server.on('Waz.disconnect', function (client)
    {
        console.log(client);
        drawDisconnectEvents(client);
    });
	// każda zmiana funkcji serwerowych, które dzieją się na planszy
	server.on('update', function (weze, bonus)
    {
        drawCanvas(weze, bonus);
        drawScores(weze);
    });
}
//Czeka na ruch gracza, na naciśnięcie klawiasza 
function listenKeys()
{
    var direction;
    $(document).keydown(function (e)
    {
        var key = e.keyCode;

        switch (key)
        {
            case 37:
                    direction = 'left';
            break;

            case 38:
                    direction = 'up';
            break;

            case 39:
                    direction = 'right';
             break;

            case 40: 
                    direction = 'down';
            break;

            default:
                  direction = 'right';

            break;
        }
		//wysyła wiadomość do serwera
        server.emit('Waz.requestDirection', {direction : direction});
    });
}
// rysuje pole gry :D
function drawCanvas(weze, bonus)
{
//Wszystkie pola są wypełnione
    context.fillStyle = '#00CED1'; // woda morska :D
    for (var i=0; i<STAGE_WIDTH; i++)
    {
        for (var j=0; j<STAGE_HEIGHT; j++)
        {
            context.fillRect(i * BLOCK_WIDTH, j * BLOCK_HEIGHT, BLOCK_WIDTH - 1, BLOCK_HEIGHT - 1);
        }
    }
//dla każdego z węży
    for(i in weze)
    {
        var waz = weze[i],
            wazLength = waz.elements.length;
//dla każdego węża, pole z aktualnej pozycji jest wypełnione
		for (var j=0; j<wazLength; j++)
        {
            var element = waz.elements[j],
                x = element.x * BLOCK_WIDTH,
                y = element.y * BLOCK_HEIGHT;

            if(waz.playerId == wazId)
            {
//user
                context.fillStyle = 'rgba(255, 0, 0, ' + (j*wazLength/100 +.1) + ')';
            }

            else
            {
//inni użytkownicy są czarni
                context.fillStyle = 'rgba(0, 0, 0, ' + (j*wazLength/100 +.1) + ')';
            }
            context.fillRect(x, y, BLOCK_WIDTH - 1, BLOCK_HEIGHT -1);
        }
    }
// dla premii
    for (i in bonus)
    {
        if(bonus[i].special == true)
        {
// Jeśli jest to specjalny bonus ma żółty kolor
            context.fillStyle = 'yellow';}
        else
        {
// ZWYkła premia
			context.fillStyle = '#0000FF';
        }
        context.fillRect(bonus[i].x * BLOCK_WIDTH, bonus[i].y * BLOCK_HEIGHT, BLOCK_WIDTH - 1, BLOCK_HEIGHT -1);
    }
}

// Gdy się podłączy ktoś
function drawConnectEvents (client)
{
    var joueurconnected = '<div>' +
                                'Gracz '+client+' podłączył się!' +
                          '</div>';
    $('#event-list').prepend(joueurconnected);
}

// gry się rozłączy
function drawDisconnectEvents (client)
{
    var joueurdisconnected = '<div>' +
                                 'Gracz '+client+' rozłączył się!' +
                             '</div>';
    $('#event-list').prepend(joueurdisconnected);
}
//funkcja, która aktualizuje wyniki
function drawScores(weze)
{
    for (i in weze){
        var waz = weze[i];
        var thisPlayerId = waz.playerId;

        if(thisPlayerId == wazId)
        {
// dla gracza
			var thisPlayerName = "<h3 class='gracz'>Gracz "+thisPlayerId +". Twój wynik:)</h3>";
        }
        else
        {
 //dla innych graczy
            var thisPlayerName ="<h3 class='innyGracz'>Przeciwnik "+thisPlayerId +", jego wynik:</h3>";
        }
//zmienna, która zawiera odtwarzacz linii
        var thislignePlayer = '<li id="player'+thisPlayerId+'"></li>';

// zmienna która zwawiera informacje o graczu po każdym odświeżeniu serwera
        var thisPlayer =    '<span>Zabicia : '+ waz.kills +'</span>' +
                            '<span>  Zebrane klocki : '+ waz.goodies +'</span>' +
                            '<span>  Zginięcia : '+ waz.deaths +'</span>' +
                            '<span>  Wynik : '+ waz.score +'</span>';

// wyświetla info o graczu
        $('#player-list').append(thislignePlayer);
        $('#player'+thisPlayerId +'').empty().append(thisPlayerName+thisPlayer);
    }
}
// konstruktor
$(function ()
{
    canvas = $('#glowny');
    context = canvas.get(0).getContext('2d');
    // funkcje zwiazane z uzytkownikiem
    connect();
    listenKeys();
});