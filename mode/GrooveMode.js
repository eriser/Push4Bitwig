// Written by Jürgen Moßgraber - mossgrabers.de
//            Michael Schmalle - teotigraphix.com
// (c) 2014-2016
// Licensed under LGPLv3 - http://www.gnu.org/licenses/lgpl-3.0.txt

function GrooveMode (model)
{
    BaseMode.call (this, model);
    this.id = MODE_GROOVE;
}
GrooveMode.prototype = new BaseMode ();

GrooveMode.prototype.onValueKnob = function (index, value)
{
    if (index == 0)
    {
        Config.changeQuantizeAmount (value);
        return;
    }
    
    if (index > 1 && index < 7)
    {
        var v = this.model.getGroove ().getValue (index - 2);
        v.value = this.surface.changeValue (value, v.value);
        this.model.getGroove ().getRangedValue (index - 2).set (v.value, Config.maxParameterValue);
    }
};

GrooveMode.prototype.onFirstRow = function (index)
{
    switch (index)
    {
        case 7:
            this.model.getGroove ().toggleEnabled ();
            break;
    }
};

GrooveMode.prototype.updateDisplay = function ()
{
    var d = this.surface.getDisplay ();
    var groove = this.model.getGroove ();

    if (Config.isPush2)
    {
        var message = d.createMessage (DisplayMessage.DISPLAY_COMMAND_GRID);
        message.addByte (DisplayMessage.GRID_ELEMENT_PARAMETERS);
        message.addString ("");
        message.addBoolean (false);
        message.addString ("");
        message.addString ("");
        message.addColor (0);
        message.addBoolean (false);
        
        message.addString ("Quant Amnt");
        message.addInteger (Config.quantizeAmount * 1023 / 100);
        message.addString (Config.quantizeAmount + "%");
        message.addBoolean (this.isKnobTouched[0]);

        message.addOptionElement ("     Groove", "", false, "", "", false);
        
        var length = GrooveValue.Kind.values ().length;
        for (var i = 0; i < length; i++)
        {
            message.addByte (DisplayMessage.GRID_ELEMENT_PARAMETERS);
            message.addString ("");
            message.addBoolean (false);
            message.addString ("");
            message.addString ("");
            message.addColor (0);
            message.addBoolean (false);
            
            var v = groove.getValue (i);
            message.addString (v.name);
            message.addInteger (v.value);
            message.addString (v.valueString);
            message.addBoolean (this.isKnobTouched[i]);
        }
        
        message.addOptionElement ("", "", false, "    Global", groove.isEnabled () ? 'Enabled' : 'Disabled', groove.isEnabled ());
        message.send ();
    }
    else
    {
        d.clear ();
        d.setCell (0, 0, "Quant Amnt", Display.FORMAT_RAW)
         .setCell (1, 0, Config.quantizeAmount + "%")
         .setCell (2, 0, Config.quantizeAmount * 1023 / 100, Display.FORMAT_VALUE);
        for (var i = 0; i < GrooveValue.Kind.values ().length; i++)
        {
            var v = groove.getValue (i);
            d.setCell (0, 2 + i, v.name, Display.FORMAT_RAW)
             .setCell (1, 2 + i, v.valueString, Display.FORMAT_RAW)
             .setCell (2, 2 + i, v.value, Display.FORMAT_VALUE);
        }
        d.setCell (2, 7, "Global:")
         .setCell (3, 7, groove.isEnabled () ? 'Enabled' : 'Disabled')
         .allDone ();
    }
};

GrooveMode.prototype.updateFirstRow = function ()
{
    this.disableFirstRow ();

    var g = this.model.getGroove ();
    this.surface.updateButton (27, g.isEnabled () ? AbstractMode.BUTTON_COLOR_HI : AbstractMode.BUTTON_COLOR_ON);
};
