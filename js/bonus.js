exports.Bonus = Bonus =function()
{
    this.STAGE_HEIGHT = 50 - 1;
    this.STAGE_WIDTH = 70 - 1;
    this.special = false;
};

Bonus.prototype.init = function()
{
    this.y = Math.floor(Math.random() * this.STAGE_HEIGHT);
    this.x = Math.floor(Math.random() * this.STAGE_WIDTH);
    this.special = false;
};

// dodanie parametru specjalny 
Bonus.prototype.specialBonus = function()
{
    this.special = true;
};
