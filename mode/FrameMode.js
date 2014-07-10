// Written by Jürgen Moßgraber - mossgrabers.de
//            Michael Schmalle - teotigraphix.com
// (c) 2014
// Licensed under GPLv3 - http://www.gnu.org/licenses/gpl.html

FrameMode.firstRowButtonColor = PUSH_COLOR_GREEN_LO - 4;


function FrameMode (model)
{
    BaseMode.call (this, model);
    this.id = MODE_FRAME;
    this.bottomItems = [];
}
FrameMode.prototype = new BaseMode ();

FrameMode.prototype.attachTo = function (push)
{
    BaseMode.prototype.attachTo.call (this, push);

    this.addFirstRowCommand ('Arrange ', doObject (this, function () { this.model.getApplication ().setPerspective ('ARRANGE'); }));
    this.addFirstRowCommand ('  Mix   ', doObject (this, function () { this.model.getApplication ().setPerspective ('MIX'); }));
    this.addFirstRowCommand ('  Edit  ', doObject (this, function () { this.model.getApplication ().setPerspective ('EDIT'); }));
    this.addFirstRowCommand ('NoteEdit', doObject (this, function () { this.model.getApplication ().toggleNoteEditor (); }));
    this.addFirstRowCommand ('Automate', doObject (this, function () { this.model.getApplication ().toggleAutomationEditor (); }));
    this.addFirstRowCommand (' Device ', doObject (this, function () { this.model.getApplication ().toggleDevices (); }));
    this.addFirstRowCommand (' Mixer  ', doObject (this, function () { this.model.getApplication ().toggleMixer (); }));
    this.addFirstRowCommand ('  Full  ', doObject (this, function () { this.model.getApplication ().toggleFullScreen (); }));
};

FrameMode.prototype.onFirstRow = function (index) 
{
    this.bottomItems[index].execute ();
};

FrameMode.prototype.onSecondRow = function (index) {};

FrameMode.prototype.updateDisplay = function () 
{
    var d = this.push.display;

    d.clear ().setBlock (0, 0, "Perspectives:").setCell (0, 3, "Panels:");
    
    for (var i = 0; i < this.bottomItems.length; i++)
        d.setCell (3, i, this.bottomItems[i].getLabel ());

    d.allDone ();
};

FrameMode.prototype.updateFirstRow = function ()
{
    for (var i = 0; i < 8; i++)
        this.push.setButton (20 + i, FrameMode.firstRowButtonColor);
};

FrameMode.prototype.updateSecondRow = function ()
{
    for (var i = 0; i < 8; i++)
        this.push.setButton (102 + i, PUSH_COLOR_BLACK);
};

FrameMode.prototype.addFirstRowCommand = function (label, command)
{
    this.bottomItems.push (new FrameToggleCommand (label, command));
};

function FrameToggleCommand (label, command)
{
    this.label = label;
    this.command = command;
}

FrameToggleCommand.prototype.getLabel = function ()
{
    return this.label;
};

FrameToggleCommand.prototype.execute = function ()
{
    this.command.call (this);
};
