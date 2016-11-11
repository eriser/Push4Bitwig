// Written by Jürgen Moßgraber - mossgrabers.de
// (c) 2014-2016
// Licensed under LGPLv3 - http://www.gnu.org/licenses/lgpl-3.0.txt

function SequencerView (model)
{
    AbstractNoteSequencerView.call (this, model);
}
SequencerView.prototype = new AbstractNoteSequencerView ();

SequencerView.prototype.usesButton = function (buttonID)
{
    switch (buttonID)
    {
        case PUSH_BUTTON_REPEAT:
        case PUSH_BUTTON_ADD_EFFECT:
            return false;
    }
    
    if (Config.isPush2 && buttonID == PUSH_BUTTON_USER_MODE)
        return false;
    
    return true;
};

SequencerView.prototype.updateArrowStates = function ()
{
    AbstractNoteSequencerView.prototype.updateArrowStates.call (this);
    this.surface.updateButton (PUSH_BUTTON_OCTAVE_UP, this.canScrollUp ? PUSH_BUTTON_STATE_ON : PUSH_BUTTON_STATE_OFF);
    this.surface.updateButton (PUSH_BUTTON_OCTAVE_DOWN, this.canScrollDown ? PUSH_BUTTON_STATE_ON : PUSH_BUTTON_STATE_OFF);
};

SequencerView.prototype.onOctaveDown = function (event)
{
    if (this.surface.isShiftPressed ())
    {
        if (event.isDown ())
            this.clip.transpose (-1);
        return;
    }

    if (this.surface.isSelectPressed ())
    {
        if (event.isDown ())
            this.clip.transpose (-12);
        return;
    }
    
    AbstractNoteSequencerView.prototype.onOctaveDown.call (this, event);
};

SequencerView.prototype.onOctaveUp = function (event)
{
    if (this.surface.isShiftPressed ())
    {
        if (event.isDown ())
            this.clip.transpose (1);
        return;
    }
    
    if (this.surface.isSelectPressed ())
    {
        if (event.isDown ())
            this.clip.transpose (12);
        return;
    }
    
    AbstractNoteSequencerView.prototype.onOctaveUp.call (this, event);
};

SequencerView.prototype.onGridNoteLongPress = function (note)
{
    if (!this.model.canSelectedTrackHoldNotes ())
        return;

    this.surface.setGridNoteConsumed (note);
    
    var index = note - 36;
    var y = Math.floor (index / 8);
    if (y >= AbstractNoteSequencerView.NUM_SEQUENCER_ROWS)
        return;

    // TODO setStep makes Bitwig hang
    //    var x = index % 8;
    //    var state = this.clip.getStep (x, this.noteMap[y]);
    //    var noteMode = this.surface.getMode (MODE_NOTE);
    //    noteMode.setValues (this.clip, x, note, state == 2 ? 1.0 : 0, 127);
    //    this.surface.setPendingMode (MODE_NOTE);
};

SequencerView.prototype.onGridNote = function (note, velocity)
{
    if (!this.model.canSelectedTrackHoldNotes ())
        return;
    var index = note - 36;
    var x = index % 8;
    var y = Math.floor (index / 8);

    if (y < AbstractNoteSequencerView.NUM_SEQUENCER_ROWS)
    {
        // Toggle the note on up, so we can intercept the long presses
        if (velocity == 0)
            this.clip.toggleStep (x, this.noteMap[y], Config.accentActive ? Config.fixedAccentValue : this.surface.gridNoteVelocities[note]);
        return;
    }
    
    AbstractNoteSequencerView.prototype.onGridNote.call (this, note, velocity);
};
