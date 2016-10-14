// Written by Jürgen Moßgraber - mossgrabers.de
//            Michael Schmalle - teotigraphix.com
// (c) 2014-2016
// Licensed under LGPLv3 - http://www.gnu.org/licenses/lgpl-3.0.txt

function NoteMode (model)
{
    BaseMode.call (this, model);
    this.id = MODE_NOTE;
    
    this.noteLength   = 1.0;
    this.noteVelocity = 127;
    this.clip = null;
    this.step = 0;
    this.note = 60;
}
NoteMode.prototype = new BaseMode ();

NoteMode.prototype.setValues = function (clip, step, note, noteLength, noteVelocity)
{
    this.clip = clip;
    this.step = step;
    this.note = note;
    this.noteLength = noteLength;
    this.noteVelocity = noteVelocity;
};

NoteMode.prototype.onValueKnob = function (index, value)
{
    switch (index)
    {
        case 0:
            this.noteLength = changeIntValue (value, Math.floor (this.noteLength), 1, 1024);
            this.clip.setStep (this.step, this.note, this.noteVelocity, this.noteLength);
            println(this.noteLength);
            break;
        case 1:
            this.noteLength = changeValue (value, this.noteLength, 0, 1024);
            // this.clip.setStep (this.step, this.note, this.noteVelocity, this.noteLength);
            println(this.noteLength);
            break;
        case 2:
            this.noteVelocity = changeIntValue (value, this.noteVelocity, 1, 128);
            this.clip.setStep (this.step, this.note, this.noteVelocity, this.noteLength);
            break;
    }
};

NoteMode.prototype.onFirstRow = function (index)
{
    switch (index)
    {
        case 1:
            // TODO
            break;
        default:
            break;
    }
};

NoteMode.prototype.updateDisplay = function ()
{
    var d = this.surface.getDisplay ();
    var groove = this.model.getGroove ();

    var quarters = Math.floor (this.noteLength);
    var fine = Math.floor (this.noteLength * 100) % 100;
    
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
        message.addString ("Quarters");
        message.addInteger (quarters);
        message.addString (quarters.toString ());
        message.addBoolean (this.isKnobTouched[0]);

        message.addByte (DisplayMessage.GRID_ELEMENT_PARAMETERS);
        message.addString ("");
        message.addBoolean (false);
        message.addString ("");
        message.addString ("");
        message.addColor (0);
        message.addBoolean (false);
        message.addString ("Fine");
        message.addInteger (fine);
        message.addString (fine.toString ());
        message.addBoolean (this.isKnobTouched[1]);

        message.addByte (DisplayMessage.GRID_ELEMENT_PARAMETERS);
        message.addString ("");
        message.addBoolean (false);
        message.addString ("");
        message.addString ("");
        message.addColor (0);
        message.addBoolean (false);
        message.addString ("Velocity");
        message.addInteger (this.noteVelocity * 1023 / 127);
        message.addString (this.noteVelocity.toString ());
        message.addBoolean (this.isKnobTouched[2]);

        for (var i = 3; i < 8; i++)
            message.addOptionElement ("", "", false, "", "", false);
        message.send ();
    }
    else
    {
        d.clear ()
         .setCell (0, 0, "Quarters", Display.FORMAT_RAW)
         .setCell (1, 0, quarters.toString ())
         .setCell (0, 1, "Fine", Display.FORMAT_RAW)
         .setCell (1, 1, fine.toString ())
         .setCell (0, 2, "Velocity", Display.FORMAT_RAW)
         .setCell (1, 2, this.noteVelocity.toString ())
         .allDone ();
    }
};

NoteMode.prototype.updateFirstRow = function ()
{
    this.disableFirstRow ();
};
