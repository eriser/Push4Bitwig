// Written by Jürgen Moßgraber - mossgrabers.de
// (c) 2014-2016
// Licensed under LGPLv3 - http://www.gnu.org/licenses/lgpl-3.0.txt

function BaseSequencerView (model, rows, cols)
{
    if (!model) // Called on first prototype creation
        return;
    AbstractSequencerView.call (this, model, rows, cols);
}
BaseSequencerView.prototype = new AbstractSequencerView ();

BaseSequencerView.prototype.onActivate = function ()
{
    AbstractSequencerView.prototype.onActivate.call (this);

    this.surface.updateButton (PUSH_BUTTON_NOTE, PUSH_BUTTON_STATE_HI);
    this.surface.updateButton (PUSH_BUTTON_SESSION, PUSH_BUTTON_STATE_ON);
    this.surface.updateButton (PUSH_BUTTON_ACCENT, Config.accentActive ? PUSH_BUTTON_STATE_HI : PUSH_BUTTON_STATE_ON);
    this.model.getCurrentTrackBank ().setIndication (false);

    this.updateRibbonMode ();
};

BaseSequencerView.prototype.updateSceneButtons = function ()
{
    if (this.model.canSelectedTrackHoldNotes ())
    {
        for (var i = PUSH_BUTTON_SCENE1; i <= PUSH_BUTTON_SCENE8; i++)
            this.surface.updateButton (i, i == PUSH_BUTTON_SCENE1 + this.selectedIndex ? PUSH_COLOR_SCENE_YELLOW : PUSH_COLOR_SCENE_GREEN);
        return;
    }
    AbstractSequencerView.prototype.updateSceneButtons.call (this);
};
