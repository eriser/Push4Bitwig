// Written by Jürgen Moßgraber - mossgrabers.de
//            Michael Schmalle - teotigraphix.com
// (c) 2014-2016
// Licensed under LGPLv3 - http://www.gnu.org/licenses/lgpl-3.0.txt

RibbonMode.MIDI_CCS        = [ 1, 11, 7, 64 ];
RibbonMode.CC_QUICK_SELECT = [ "Modulation", "Expression", "Volume", "Sustain", "", "", "" ];
RibbonMode.FUNCTION        = [ "Pitchbend", "CC", "CC/Pitch", "Pitch/CC", "Fader", "", "" ];
RibbonMode.FUNCTION_IDS    = [ Config.RIBBON_MODE_PITCH, Config.RIBBON_MODE_CC, Config.RIBBON_MODE_CC_PB, Config.RIBBON_MODE_PB_CC, Config.RIBBON_MODE_FADER ];


function RibbonMode (model)
{
    BaseMode.call (this, model);
    this.id = MODE_RIBBON;
}
RibbonMode.prototype = new BaseMode ();

RibbonMode.prototype.onValueKnobTouch = function (index, isTouched) 
{
    this.isKnobTouched[index] = isTouched;
};

RibbonMode.prototype.onValueKnob = function (index, value)
{
    if (index == 7)
        Config.setRibbonModeCC (changeValue (value, Config.ribbonModeCCVal, 1, 128));
};

RibbonMode.prototype.onFirstRow = function (index)
{
    if (index < 5)
        Config.setRibbonMode (index);
    else
        this.surface.restoreMode ();
};

RibbonMode.prototype.onSecondRow = function (index)
{
    if (index < 4)
        Config.setRibbonModeCC (RibbonMode.MIDI_CCS[index]);
    else
        this.surface.restoreMode ();
};

RibbonMode.prototype.updateDisplay = function ()
{
    var d = this.surface.getDisplay ();
    
    if (Config.isPush2)
    {
        var message = d.createMessage (DisplayMessage.DISPLAY_COMMAND_GRID);
        for (var i = 0; i < 7; i++)
        {
            message.addOptionElement (i == 0 ? "CC Quick Select" : "", RibbonMode.CC_QUICK_SELECT[i], false,
                                      i == 0 ? "Function" : "", RibbonMode.FUNCTION[i],
                                      i < RibbonMode.FUNCTION_IDS.length && Config.ribbonMode == RibbonMode.FUNCTION_IDS[i]);
        }
        
        message.addByte (DisplayMessage.GRID_ELEMENT_PARAMETERS);
        message.addString ("");
        message.addBoolean (false);
        message.addString ("");
        message.addString ("");
        message.addColor (0);
        message.addBoolean (false);
        message.addString ("Midi CC");
        message.addInteger (-1);
        message.addString ( Config.ribbonModeCCVal.toString ());
        message.addBoolean (this.isKnobTouched[5]);
        
        message.send ();
        return;
    }

    d.clear ()
     .setCell (0, 0, 'Modulatn')
     .setCell (0, 1, 'Expressn')
     .setCell (0, 2, 'Volume')
     .setCell (0, 3, 'Sustain')
     .setCell (0, 7, 'Midi CC')
     .setCell (1, 7, Config.ribbonModeCCVal.toString ())
     .setCell (3, 0, (Config.ribbonMode == Config.RIBBON_MODE_PITCH ? Display.RIGHT_ARROW : '') + 'Pitchbd')
     .setCell (3, 1, (Config.ribbonMode == Config.RIBBON_MODE_CC ? Display.RIGHT_ARROW : '') + 'CC')
     .setCell (3, 2, (Config.ribbonMode == Config.RIBBON_MODE_CC_PB ? Display.RIGHT_ARROW : '') + 'CC/Pitch')
     .setCell (3, 3, (Config.ribbonMode == Config.RIBBON_MODE_PB_CC ? Display.RIGHT_ARROW : '') + 'Pitch/CC')
     .setCell (3, 4, (Config.ribbonMode == Config.RIBBON_MODE_FADER ? Display.RIGHT_ARROW : '') + 'Fader')
     .allDone ();
};

RibbonMode.prototype.updateFirstRow = function ()
{
    for (var i = 0; i < 5; i++)
        this.surface.updateButton (20 + i, Config.ribbonMode == Config.RIBBON_MODE_PITCH + i ? AbstractMode.BUTTON_COLOR_HI : AbstractMode.BUTTON_COLOR_ON);
    for (var i = 5; i < 8; i++)
        this.surface.updateButton (20 + i, AbstractMode.BUTTON_COLOR_OFF);
};

RibbonMode.prototype.updateSecondRow = function ()
{
    for (var i = 0; i < 4; i++)
        this.surface.updateButton (102 + i, Config.isPush2 ? AbstractMode.BUTTON_COLOR_ON : AbstractMode.BUTTON_COLOR2_ON);
    for (var i = 4; i < 8; i++)
        this.surface.updateButton (102 + i, AbstractMode.BUTTON_COLOR_OFF);
};
