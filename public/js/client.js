var canvas,
    context,
    server;
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
    });
    
    server.on('Waz.disconnect', function (client)
    {
        console.log(client);
        drawDisconnectEvents(client);
    });
}
//Czeka na ruch gracza, na naciœniêcie klawiasza 
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
		//wysy³a wiadomoœæ do serwera
        server.emit('Waz.requestDirection', {direction : direction});
    });
}
// konstruktor
function glowny()
{
    canvas = $('#glowny');
    context = canvas.get(0).getContext('2d');
    // funkcje zwiazane z uzytkownikiem
    connect();
}
