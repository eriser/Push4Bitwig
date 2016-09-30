// Written by Jürgen Moßgraber - mossgrabers.de
//            Michael Schmalle - teotigraphix.com
// (c) 2014-2016
// Licensed under LGPLv3 - http://www.gnu.org/licenses/lgpl-3.0.txt

function ScaleLayoutMode (model)
{
    BaseMode.call (this, model);
    this.id = MODE_SCALE_LAYOUT;
    this.scales = model.getScales ();
}
ScaleLayoutMode.prototype = new BaseMode ();

ScaleLayoutMode.prototype.onFirstRow = function (index)
{
    var sl = this.scales.getScaleLayout ();
    if (index < Scales.LAYOUT_NAMES.length / 2)
        this.scales.setScaleLayout (index * 2 + sl % 2);
    else if (index == 7)
        this.scales.setScaleLayout (Math.floor (sl / 2) * 2 + (sl % 2 == 0 ? 1 : 0));
    else
        return;
    
    this.surface.getActiveView ().updateNoteMapping ();
    Config.setScaleLayout (Scales.LAYOUT_NAMES[this.scales.getScaleLayout ()]);
};

ScaleLayoutMode.prototype.updateFirstRow = function ()
{
    var sl = this.scales.getScaleLayout ();
    var pos = Math.floor (sl / 2);
    for (var i = 0; i < Math.floor (Scales.LAYOUT_NAMES.length / 2); i++)
        this.surface.updateButton (20 + i, pos == i ? AbstractMode.BUTTON_COLOR_HI : AbstractMode.BUTTON_COLOR_ON);
    this.surface.updateButton (25, AbstractMode.BUTTON_COLOR_OFF);
    this.surface.updateButton (26, AbstractMode.BUTTON_COLOR_OFF);
    this.surface.updateButton (27, AbstractMode.BUTTON_COLOR_ON);
};

ScaleLayoutMode.prototype.updateDisplay = function ()
{
    var d = this.surface.getDisplay ();
    var sl = this.scales.getScaleLayout ();
    var pos = Math.floor (sl / 2);
    
    if (Config.isPush2)
    {
        var message = d.createMessage (DisplayMessage.DISPLAY_COMMAND_GRID);
        for (var i = 0; i < Scales.LAYOUT_NAMES.length; i += 2)
            message.addOptionElement ("", "", false, i == 0 ? "Scale layout" : "", Scales.LAYOUT_NAMES[i].replace (' ^', ''), pos == Math.floor (i / 2));
        message.addOptionElement ("", "", false, "", "", false);
        message.addOptionElement ("", "", false, "", "", false);
        message.addOptionElement ("", "", false, "", sl % 2 == 0 ? "Horizontal" : "Vertical", false);
        message.send ();
    }
    else
    {
        d.clear ().setBlock (1, 0, 'Scale layout:');
        for (var i = 0; i < Scales.LAYOUT_NAMES.length; i += 2)
            d.setCell (3, i / 2, (pos == Math.floor (i / 2) ? Display.RIGHT_ARROW : ' ') + Scales.LAYOUT_NAMES[i].replace (' ^', ''));
        d.setCell (3, 7, sl % 2 == 0 ? "Horizontal" : "Vertical");
        d.allDone ();
    }
};
