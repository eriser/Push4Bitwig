// Written by Jürgen Moßgraber - mossgrabers.de
//            Michael Schmalle - teotigraphix.com
// (c) 2014-2016
// Licensed under LGPLv3 - http://www.gnu.org/licenses/lgpl-3.0.txt

MidiInput.prototype.createNoteInput = function ()
{
    return this.createNoteInputBase ("Ableton Push", 
            [ "80????",    // Note off
              "90????",    // Note on
              "B040??" ]); // Sustainpedal
};
