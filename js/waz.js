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
    this.playerId = playerId;
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