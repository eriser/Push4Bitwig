// Written by Jürgen Moßgraber - mossgrabers.de
//            Michael Schmalle - teotigraphix.com
// (c) 2014-2016
// Licensed under LGPLv3 - http://www.gnu.org/licenses/lgpl-3.0.txt

// Push character codes for value bars
Display.BARS_NON    = String.fromCharCode (6);
Display.BARS_ONE    = String.fromCharCode (3);
Display.BARS_TWO    = String.fromCharCode (5);
Display.BARS_ONE_L  = String.fromCharCode (4);
Display.NON_4       = Display.BARS_NON + Display.BARS_NON + Display.BARS_NON + Display.BARS_NON;
Display.RIGHT_ARROW = String.fromCharCode (127);

Display.SPACES =
[
    '',
    ' ',
    '  ',
    '   ',
    '    ',
    '     ',
    '      ',
    '       ',
    '        ',
    '         ',
    '          ',
    '           ',
    '            ',
    '             '
];

Display.DASHES =
[
    '',
    Display.BARS_NON,
    Display.BARS_NON + Display.BARS_NON,
    Display.BARS_NON + Display.BARS_NON + Display.BARS_NON,
    Display.BARS_NON + Display.BARS_NON + Display.BARS_NON + Display.BARS_NON,
    Display.BARS_NON + Display.BARS_NON + Display.BARS_NON + Display.BARS_NON + Display.BARS_NON,
    Display.BARS_NON + Display.BARS_NON + Display.BARS_NON + Display.BARS_NON + Display.BARS_NON + Display.BARS_NON,
    Display.BARS_NON + Display.BARS_NON + Display.BARS_NON + Display.BARS_NON + Display.BARS_NON + Display.BARS_NON + Display.BARS_NON,
    Display.BARS_NON + Display.BARS_NON + Display.BARS_NON + Display.BARS_NON + Display.BARS_NON + Display.BARS_NON + Display.BARS_NON + Display.BARS_NON,
    Display.BARS_NON + Display.BARS_NON + Display.BARS_NON + Display.BARS_NON + Display.BARS_NON + Display.BARS_NON + Display.BARS_NON + Display.BARS_NON + Display.BARS_NON
];

Display.SYSEX_MESSAGE =
[
    "F0 47 7F 15 18 00 45 00 ",
    "F0 47 7F 15 19 00 45 00 ",
    "F0 47 7F 15 1A 00 45 00 ",
    "F0 47 7F 15 1B 00 45 00 "
];


// 4 rows (0-3) with 4 blocks (0-3). Each block consists of 
// 17 characters or 2 cells (0-7).
function Display (output)
{
    AbstractDisplay.call (this, output, 4 /* No of rows */, 4 /* No of blocks */, 8 /* No of cells */, 68 /* No of characters */);
}
Display.prototype = new AbstractDisplay ();
Display.FORMAT_RAW = AbstractDisplay.FORMAT_RAW;
Display.FORMAT_VALUE = AbstractDisplay.FORMAT_VALUE;
Display.FORMAT_PAN = AbstractDisplay.FORMAT_PAN;


Display.prototype.clearCell = function (row, cell)
{
    this.cells[row * 8 + cell] = cell % 2 == 0 ? '         ' : '        ';
    return this;
};

Display.prototype.setBlock = function (row, block, value)
{
    var cell = 2 * block;
    if (value.length > 9)
    {
        this.cells[row * 8 + cell]     = value.substr (0, 9);
        this.cells[row * 8 + cell + 1] = this.pad (value.substring (9), 8, ' ');
    }
    else
    {
        this.cells[row * 8 + cell] = this.pad (value, 9, ' ');
        this.clearCell (row, cell + 1);
    }
    return this;
};

Display.prototype.setCell = function (row, cell, value, format)
{
    this.cells[row * 8 + cell] = this.pad (this.formatStr (value, format), 8, ' ') + (cell % 2 == 0 ? ' ' : '');
    return this;
};

Display.prototype.writeLine = function (row, text)
{
    var array = [];
    for (var i = 0; i < text.length; i++)
        array[i] = text.charCodeAt(i);
    this.output.sendSysex (Display.SYSEX_MESSAGE[row] + toHexStr (array) + "F7");
};

Display.prototype.formatValue = function (value)
{
    var noOfBars = Math.round (16 * value / Config.maxParameterValue);
    var n = '';
    for (var j = 0; j < Math.floor (noOfBars / 2); j++)
        n += Display.BARS_TWO;
    if (noOfBars % 2 == 1)
        n += Display.BARS_ONE;
    return this.pad (n, 8, Display.BARS_NON);
};

Display.prototype.formatPan = function (pan)
{
    var middle = Config.maxParameterValue / 2;
    if (pan == middle)
         return Display.NON_4 + Display.NON_4;
    var isLeft = pan < middle;
    var pos = isLeft ? middle - pan : pan - middle;
    var noOfBars = Math.round (16 * pos / Config.maxParameterValue);
    var n = '';
    for (var i = 0; i < Math.floor (noOfBars / 2); i++)
        n += Display.BARS_TWO;
    if (noOfBars % 2 == 1)
        n += isLeft ? Display.BARS_ONE_L : Display.BARS_ONE;
    n = Display.NON_4 + this.pad (n, 4, Display.BARS_NON);
    return isLeft ? this.reverseStr (n) : n;
};

Display.prototype.pad = function (str, length, character)
{
    if (typeof (str) == 'undefined' || str == null)
        str = '';
    var diff = length - str.length;
    if (diff < 0)
        return str.substr (0, length);
    if (diff > 0)
        return str + (character == ' ' ? Display.SPACES[diff] : Display.DASHES[diff]);
    return str;
};

Display.prototype.padLeft = function (str, length, character)
{
    if (typeof (str) == 'undefined' || str == null)
        str = '';
    var diff = length - str.length;
    if (diff < 0)
        return str.substr (0, length);
    if (diff > 0)
        return (character == ' ' ? Display.SPACES[diff] : Display.DASHES[diff]) + str;
    return str;
};

Display.prototype.formatStr = function (value, format)
{
    switch (format)
    {
        case Display.FORMAT_VALUE:
            return this.formatValue (value);
        case Display.FORMAT_PAN:
            return this.formatPan (value);
        default:
            return value ? value.toString () : "";
    }
};

// 
// Push 2 specific
//

Display.prototype.showNotification = function (message)
{
    if (Config.isPush2)
    {
        var msg = this.createMessage (DisplayMessage.DISPLAY_COMMAND_GRID);
        msg.addOptionElement ("", "", false, "", "", false);
        msg.addOptionElement ("", "", false, "", "", false);
        msg.addOptionElement ("", "", false, "", "", false);
        msg.addOptionElement (message, "", false, "", "", false);
        msg.addOptionElement ("", "", false, "", "", false);
        msg.addOptionElement ("", "", false, "", "", false);
        msg.addOptionElement ("", "", false, "", "", false);
        msg.addOptionElement ("", "", false, "", "", false);
        
        if (this.isNotificationActive)
            Config.sendPort = this.commPort;
        
        msg.send ();
        
        this.commPort = Config.sendPort;
        Config.sendPort = -1;
        this.isNotificationActive = true;
        
        scheduleTask (doObject (this, function ()
        {
            this.isNotificationActive = false;
            Config.sendPort = this.commPort;
        }), null, AbstractDisplay.NOTIFICATION_TIME);
        
        return;
    }
    
    AbstractDisplay.prototype.showNotification.call (this, message);
};

Display.prototype.createMessage = function (command)
{
    return new DisplayMessage (command);    
};

Display.prototype.shutdown = function ()
{
    this.createMessage (DisplayMessage.DISPLAY_COMMAND_SHUTDOWN).send ();
};

function displayNotification (message, suppressDisplay)
{
    host.showPopupNotification (message);
    if (!suppressDisplay)
        controller.surface.getDisplay ().showNotification ('        ' + message);
}
