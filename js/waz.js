exports.Waz = Waz =function()
{
	this.WAZ_LENGTH = 8; 
    this.STAGE_WIDTH = 70 - 1;
    this.STAGE_HEIGHT = 50 - 1;
};
// stworzenie weza z parametrem gracza
Waz.prototype.init = function (playerId)
{
    this.currentlength = this.WAZ_LENGTH;
    this.deaths = 0;
    this.playerId = playerId;
    this.goodies = 0;
    this.kills = 0;
    this.score = 0;
	//zawiera ciało weża
    this.elements = [];
	//domyślny kierunek węża
    this.direction = 'right';
	var rand = Math.floor(Math.random() * this.STAGE_HEIGHT);
//tworzenie węża w pętli for
    for (var i=this.WAZ_LENGTH; i>0; i--){
        this.elements.push({x: -i, y: rand});
    }
};
//dzieli ciało weza
Waz.prototype.doStep = function ()
{
    var length = this.elements.length - 1;
    for (var i=0; i<length; i++){
        this.moveBlock(i);
    }
    this.moveHead();
};
//Porusza ciało weża
Waz.prototype.moveBlock = function(i)
{
    this.elements[i].x = this.elements[i + 1].x;
    this.elements[i].y = this.elements[i + 1].y;
};

//Porusza głową weża, początkiem :D
Waz.prototype.moveHead = function(i, direction)
{
    var length = this.elements.length;
    var head = this.elements[length -1];
	//zmiany położenia
    switch (this.direction)
    {
        case 'left':
                head.x--;
        break;

        case 'right':
                head.x++;
        break;

        case 'down':
                head.y++;
        break;

        case 'up':
                head.y--;
        break;

    }

	// gdy wąż wyjdzie poza pole gry, natychmiast wraca z drugiej strony
	if (head.x > this.STAGE_WIDTH)
    {
        head.x = 0;
    }
    else if (head.x < 0)
    {
        head.x = this.STAGE_WIDTH;
    }

    if (head.y > this.STAGE_HEIGHT)
    {
        head.y = 0;
    }
    else if(head.y < 0)
    {
        head.y = this.STAGE_HEIGHT;
    }
};
// sprawdza czy kierunek jest prawidłowy
Waz.prototype.setDirection = function(direction)
{
    if (direction == 'right' && this.direction !='left' ||
        direction == 'left' && this.direction !='right' ||
        direction == 'down' && this.direction !='up'    ||
        direction == 'up' && this.direction !='down')
    {
        this.direction = direction;
    }

};
// restart węża
Waz.prototype.reset = function ()
{
    this.currentlength = this.WAZ_LENGTH;
    this.elements = [];
  var rand = Math.floor(Math.random() * this.STAGE_HEIGHT);
    for (var i=this.currentlength; i>0; i--){
        this.elements.push({x: -i, y: rand});
    }
};

Waz.prototype.hasColision = function (item)
{
    var head = this.elements[this.elements.length - 1];
    if (head.x == item.x && head.y == item.y)
    {
        return true;
    }
    return false;
};
// dodaje pole do węża
Waz.prototype.addLength = function ()
{
    var wazQueue = this.elements[0];
    this.currentlength = this.currentlength + 30;
    this.elements.unshift ({x: wazQueue.x, y: wazQueue.y});
};
// zwiększa wynik po zjedzeniu bonusa
Waz.prototype.eatBonus = function (bonus)
{
// sprawdza czy bonus jest specjalny 
    if(bonus.special === true)
    {
        this.score = this.score + 30;
    }
    else
    {
        this.score = this.score + 10;
    }
    this.goodies++;
};
// zwiększa wynik za zabicie węża
Waz.prototype.kill = function ()
{
    this.score = this.score + 50;
};
// zwiększa zginięcia węża i zmniejsza jego wynik
Waz.prototype.die = function ()
{
    this.deaths++;
    this.score = this.score - 50;
    this.reset();
};