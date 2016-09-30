// Written by Jürgen Moßgraber - mossgrabers.de
// (c) 2014-2016
// Licensed under LGPLv3 - http://www.gnu.org/licenses/lgpl-3.0.txt

function DrumView (model)
{
	AbstractDrumView.call (this, model, 4, 4);
}
DrumView.prototype = new AbstractDrumView ();

DrumView.prototype.handleSelectButton = function (playedPad)
{
    var primary = this.model.getTrackBank ().primaryDevice;
    if (!primary.hasDrumPads ())
        return;

    // Do not reselect
    if (primary.getDrumPad (playedPad).selected)
        return;
    
    var cd = this.model.getCursorDevice ();
    if (cd.isNested())
        cd.selectParent ();
    
    this.surface.setPendingMode (MODE_DEVICE_LAYER);
    primary.selectDrumPad (playedPad);
};

DrumView.prototype.onMute = function (event)
{
    if (event.isLong ())
        return;
    this.updateNoteMapping ();
    AbstractSequencerView.prototype.onMute.call (this, event);
};

DrumView.prototype.onSolo = function (event)
{
    if (event.isLong ())
        return;
    this.updateNoteMapping ();
    AbstractSequencerView.prototype.onSolo.call (this, event);
};

DrumView.prototype.usesButton = function (buttonID)
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

DrumView.prototype.updateArrowStates = function ()
{
    AbstractDrumView.prototype.updateArrowStates.call (this);
    this.surface.updateButton (PUSH_BUTTON_OCTAVE_UP, PUSH_BUTTON_STATE_ON);
    this.surface.updateButton (PUSH_BUTTON_OCTAVE_DOWN, PUSH_BUTTON_STATE_ON);
};

DrumView.prototype.onSolo = function (event)
{
    AbstractDrumView.prototype.onSolo.call (this, event);
    if (event.isUp ())
        this.updateNoteMapping ();
};

DrumView.prototype.onMute = function (event)
{
    AbstractDrumView.prototype.onSolo.call (this, event);
    if (event.isUp ())
        this.updateNoteMapping ();
};
