// Written by Jürgen Moßgraber - mossgrabers.de
// (c) 2014-2016
// Licensed under LGPLv3 - http://www.gnu.org/licenses/lgpl-3.0.txt

DrumView4.NUM_DISPLAY_COLS = 16;
DrumView4.DRUM_START_KEY = 36;

function DrumView4 (model)
{
    BaseSequencerView.call (this, model, 128, DrumView4.NUM_DISPLAY_COLS);
    this.offsetY = DrumView4.DRUM_START_KEY;
    this.canScrollUp = false;
    this.canScrollDown = false;
    this.selectedPad = 0;
    this.pressedKeys = initArray (0, 128);
    this.noteMap = this.scales.getEmptyMatrix ();
    
    this.loopPadPressed = -1;

    var tb = model.getTrackBank ();
    tb.addNoteListener (doObject (this, function (pressed, note, velocity)
    {
        // Light notes send from the sequencer
        this.pressedKeys[note] = pressed ? velocity : 0;
    }));
    tb.addTrackSelectionListener (doObject (this, function (index, isSelected)
    {
        this.clearPressedKeys ();
    }));
}
DrumView4.prototype = new BaseSequencerView ();

DrumView4.prototype.updateArrowStates = function ()
{
    this.canScrollLeft = this.offsetX > 0;
    this.canScrollRight = true; // TODO API extension required - We do not know the number of steps
};

DrumView4.prototype.updateNoteMapping = function ()
{
    var turnOn = this.model.canSelectedTrackHoldNotes () && !this.surface.isSelectPressed () && !this.surface.isDeletePressed () && !this.surface.isPressed (PUSH_BUTTON_MUTE) && !this.surface.isPressed (PUSH_BUTTON_SOLO);
    this.noteMap = turnOn ? this.scales.getDrumMatrix () : this.scales.getEmptyMatrix ();
    this.surface.setKeyTranslationTable (this.noteMap);
};

DrumView4.prototype.usesButton = function (buttonID)
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

DrumView4.prototype.onSelect = function (event)
{
    if (!event.isLong ())
        this.updateNoteMapping ();
};

DrumView4.prototype.onDelete = function (event)
{
    if (!event.isLong ())
        this.updateNoteMapping ();
};

DrumView4.prototype.onMute = function (event)
{
    if (event.isLong ())
        return;
    this.updateNoteMapping ();
    BaseSequencerView.prototype.onMute.call (this, event);
};

DrumView4.prototype.onSolo = function (event)
{
    if (event.isLong ())
        return;
    this.updateNoteMapping ();
    BaseSequencerView.prototype.onSolo.call (this, event);
};

DrumView4.prototype.onGridNote = function (note, velocity)
{
    if (!this.model.canSelectedTrackHoldNotes ())
        return;

    if (velocity == 0)
        return;
    
    var index = note - 36;
    var x = index % 8;
    var y = Math.floor (index / 8);
    
    var sound = y % 4;
    var col = 8 * Math.floor (y / 4) + x;

    this.clip.toggleStep (col, this.offsetY + this.selectedPad + sound, Config.accentActive ? Config.fixedAccentValue : velocity);
};

DrumView4.prototype.onOctaveDown = function (event)
{
    if (!event.isDown ())
        return;
    this.clearPressedKeys ();
    this.scales.decDrumOctave ();
    this.offsetY = DrumView4.DRUM_START_KEY + this.scales.getDrumOctave () * 16;
    this.updateNoteMapping ();
    this.surface.getDisplay ().showNotification ('          ' + this.scales.getDrumRangeText ());
    this.model.getTrackBank ().primaryDevice.scrollDrumPadsPageUp ();
};

DrumView4.prototype.onOctaveUp = function (event)
{
    if (!event.isDown ())
        return;
    this.clearPressedKeys ();
    this.scales.incDrumOctave ();
    this.offsetY = DrumView4.DRUM_START_KEY + this.scales.getDrumOctave () * 16;
    this.updateNoteMapping ();
    this.surface.getDisplay ().showNotification ('          ' + this.scales.getDrumRangeText ());
    this.model.getTrackBank ().primaryDevice.scrollDrumPadsPageDown ();
};

DrumView4.prototype.drawGrid = function ()
{
    // Also update the value of the ribbon
    this.updateRibbonModeValue ();
    
    if (!this.model.canSelectedTrackHoldNotes ())
    {
        this.surface.pads.turnOff ();
        return;
    }

    // Clip length/loop area
    var step = this.clip.getCurrentStep ();
    
    // Paint the sequencer steps
    var hiStep = this.isInXRange (step) ? step % DrumView4.NUM_DISPLAY_COLS : -1;
    for (var sound = 0; sound < 4; sound++)
    {
        for (var col = 0; col < DrumView4.NUM_DISPLAY_COLS; col++)
        {
            var isSet = this.clip.getStep (col, this.offsetY + this.selectedPad + sound);
            var hilite = col == hiStep;
            var x = col % 8;
            var y = Math.floor (col / 8);
            if (col >= 8)
                y += 3;
            y += sound;
            this.surface.pads.lightEx (x, 7 - y, isSet ? (hilite ? PUSH_COLOR2_GREEN_LO : PUSH_COLOR2_BLUE_HI) : hilite ? PUSH_COLOR2_GREEN_HI : PUSH_COLOR2_BLACK, null, false);
        }
    }
};

DrumView4.prototype.getPadColor = function (index, primary, hasDrumPads, isSoloed, isRecording)
{
    // Playing note?
    if (this.pressedKeys[this.offsetY + index] > 0)
        return isRecording ? PUSH_COLOR2_RED_HI : PUSH_COLOR2_GREEN_HI;
    // Selected?
    if (this.selectedPad == index)
        return PUSH_COLOR2_BLUE_HI;
    // Exists and active?
    var drumPad = primary.getDrumPad (index);
    if (!drumPad.exists || !drumPad.activated)
        return PUSH_COLOR2_YELLOW_LO;
    // Muted or soloed?
    if (drumPad.mute || (isSoloed && !drumPad.solo))
        return PUSH_COLOR2_AMBER_LO;
    return drumPad.color ? drumPad.color : PUSH_COLOR2_YELLOW_HI;
};

DrumView4.prototype.clearPressedKeys = function ()
{
    for (var i = 0; i < 128; i++)
        this.pressedKeys[i] = 0;
};