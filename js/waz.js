exports.Waz = Waz =function()
{
	this.WAZ_LENGTH = 8; 
};
Waz.prototype.init = function (playerId)
{
    this.currentlength = this.WAZ_LENGTH;
    this.playerId = playerId;
    this.kills = 0;
	//zawiera cia�o we�a
    this.elements = [];
};
//Porusza cia�o we�a
Waz.prototype.moveBlock = function(i)
{
    this.elements[i].x = this.elements[i + 1].x;
    this.elements[i].y = this.elements[i + 1].y;
};
//Porusza g�ow� we�a, pocz�tkiem :D
Waz.prototype.moveHead = function(i, direction)
{
    var length = this.elements.length;
    var head = this.elements[length];
	//zmiany po�o�enia
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
};