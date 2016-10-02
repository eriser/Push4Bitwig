// Written by Jürgen Moßgraber - mossgrabers.de
// (c) 2014-2016
// Licensed under LGPLv3 - http://www.gnu.org/licenses/lgpl-3.0.txt

function PlayView (model)
{
    if (model == null)
        return;
    
    AbstractPlayView.call (this, model);

    Config.addPropertyListener (Config.ACTIVATE_FIXED_ACCENT, doObject (this, function ()
    {
        this.initMaxVelocity ();
    }));
    Config.addPropertyListener (Config.FIXED_ACCENT_VALUE, doObject (this, function ()
    {
        this.initMaxVelocity ();
    }));
}
PlayView.prototype = new AbstractPlayView ();

PlayView.prototype.onActivate = function ()
{
    AbstractPlayView.prototype.onActivate.call (this);

    this.surface.updateButton (PUSH_BUTTON_NOTE, PUSH_BUTTON_STATE_HI);
    this.surface.updateButton (PUSH_BUTTON_SESSION, PUSH_BUTTON_STATE_ON);
    this.surface.updateButton (PUSH_BUTTON_ACCENT, Config.accentActive ? PUSH_BUTTON_STATE_HI : PUSH_BUTTON_STATE_ON);
    this.initMaxVelocity ();

    this.updateRibbonMode ();
};

PlayView.prototype.scrollUp = function (event)
{
    if (this.surface.isShiftPressed ())
        this.model.getApplication ().arrowKeyLeft ();
    else
        this.model.getApplication ().arrowKeyUp ();
};

PlayView.prototype.scrollDown = function (event)
{
    if (this.surface.isShiftPressed ())
        this.model.getApplication ().arrowKeyRight ();
    else
        this.model.getApplication ().arrowKeyDown ();
};

PlayView.prototype.usesButton = function (buttonID)
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

PlayView.prototype.initMaxVelocity = function ()
{
    this.maxVelocity = initArray (Config.fixedAccentValue, 128);
    this.maxVelocity[0] = 0;
    this.surface.setVelocityTranslationTable (Config.accentActive ? this.maxVelocity : this.defaultVelocity);
};

PlayView.prototype.onChannelAftertouch = function (value)
{
    if (Config.convertAftertouch == -2)
    {
        var keys = this.getPressedKeys ();
        for (var i = 0; i < keys.length; i++)
            this.onPolyAftertouch (keys[i], value);
    }
    else
        this.onPolyAftertouch (0, value);
};

PlayView.prototype.updateButtons = function ()
{
    AbstractPlayView.prototype.updateButtons.call (this);
    var octave = this.scales.getOctave ();
    this.surface.updateButton (PUSH_BUTTON_OCTAVE_UP, octave < Scales.OCTAVE_RANGE ? PUSH_BUTTON_STATE_ON : PUSH_BUTTON_STATE_OFF);
    this.surface.updateButton (PUSH_BUTTON_OCTAVE_DOWN, octave > -Scales.OCTAVE_RANGE ? PUSH_BUTTON_STATE_ON : PUSH_BUTTON_STATE_OFF);
};
