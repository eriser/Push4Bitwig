// Written by Jürgen Moßgraber - mossgrabers.de
// (c) 2014-2016
// Licensed under LGPLv3 - http://www.gnu.org/licenses/lgpl-3.0.txt

function RaindropsView (model)
{
    AbstractRaindropsView.call (this, model);
}
RaindropsView.prototype = new AbstractRaindropsView ();

RaindropsView.prototype.usesButton = function (buttonID)
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

RaindropsView.prototype.updateArrowStates = function ()
{
    AbstractNoteSequencerView.prototype.updateArrowStates.call (this);
    this.surface.updateButton (PUSH_BUTTON_OCTAVE_UP, this.canScrollUp ? PUSH_BUTTON_STATE_ON : PUSH_BUTTON_STATE_OFF);
    this.surface.updateButton (PUSH_BUTTON_OCTAVE_DOWN, this.canScrollDown ? PUSH_BUTTON_STATE_ON : PUSH_BUTTON_STATE_OFF);
};

RaindropsView.prototype.scrollUp = function (event)
{
    AbstractRaindropsView.prototype.scrollRight.call (this);
};

RaindropsView.prototype.scrollDown = function (event)
{
    AbstractRaindropsView.prototype.scrollLeft.call (this);
};

RaindropsView.prototype.scrollLeft = AbstractView.prototype.scrollLeft;
RaindropsView.prototype.scrollRight = AbstractView.prototype.scrollRight;
