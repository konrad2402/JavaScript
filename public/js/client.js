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
// konstruktor
function glowny()
{
    canvas = $('#glowny');
    context = canvas.get(0).getContext('2d');
    // funkcje zwiazane z uzytkownikiem
    connect();
}
