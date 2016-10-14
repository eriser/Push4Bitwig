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
    if (!this.surface.isShiftPressed ())
    {
        AbstractNoteSequencerView.prototype.onOctaveDown.call (this, event);
        return;
    }
    
    if (event.isDown ())
        this.clip.transpose (-1);
};

SequencerView.prototype.onOctaveUp = function (event)
{
    if (!this.surface.isShiftPressed ())
    {
        AbstractNoteSequencerView.prototype.onOctaveUp.call (this, event);
        return;
    }
    
    if (event.isDown ())
        this.clip.transpose (1);
};
