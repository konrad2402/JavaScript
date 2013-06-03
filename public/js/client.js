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
	// gdy się rozłączy
    server.on('Waz.disconnect', function (client)
    {
        console.log(client);
    });
	// każda zmiana funkcji serwerowych, które dzieją się na planszy
	server.on('update', function (weze)
    {
        drawCanvas(weze);
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
function drawCanvas(weze)
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
//loading user
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
