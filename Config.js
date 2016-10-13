load ("framework/core/AbstractConfig.js");

// ------------------------------
// Static configurations
// ------------------------------

// Inc/Dec of knobs
Config.fractionValue     = 10;
Config.fractionMinValue  = 1;
Config.maxParameterValue = 1024;

// How fast the track and scene arrows scroll the banks/scenes
Config.trackScrollInterval = 100;
Config.sceneScrollInterval = 100;

//------------------------------
// Global stati
//------------------------------

Config.wasMuteLongPressed = false;
Config.wasSoloLongPressed = false;
Config.isMuteSoloLocked   = false;

// ------------------------------
// Editable configurations
// ------------------------------

Config.RIBBON_MODE                     = 20;
Config.RIBBON_MODE_CC_VAL              = 21;
Config.VELOCITY_CURVE                  = 22;
Config.PAD_THRESHOLD                   = 23;
Config.DEFAULT_DEVICE_MODE             = 24;
Config.FOOTSWITCH_2                    = 25;
Config.SEND_PORT                       = 26;
Config.DISPLAY_BRIGHTNESS              = 27;
Config.LED_BRIGHTNESS                  = 28;
Config.PAD_SENSITIVITY                 = 29;
Config.PAD_GAIN                        = 30;
Config.PAD_DYNAMICS                    = 31;
Config.AUTO_SELECT_DRUM                = 32;
Config.STOP_AUTOMATION_ON_KNOB_RELEASE = 33;

Config.RIBBON_MODE_PITCH = 0;
Config.RIBBON_MODE_CC    = 1;
Config.RIBBON_MODE_CC_PB = 2;
Config.RIBBON_MODE_PB_CC = 3;
Config.RIBBON_MODE_FADER = 4;

Config.FOOTSWITCH_2_TOGGLE_PLAY         = 0;
Config.FOOTSWITCH_2_TOGGLE_RECORD       = 1;
Config.FOOTSWITCH_2_STOP_ALL_CLIPS      = 2;
Config.FOOTSWITCH_2_TOGGLE_CLIP_OVERDUB = 3;
Config.FOOTSWITCH_2_UNDO                = 4;
Config.FOOTSWITCH_2_TAP_TEMPO           = 5;
Config.FOOTSWITCH_2_NEW_BUTTON          = 6;
Config.FOOTSWITCH_2_CLIP_BASED_LOOPER   = 7;

Config.AUTO_SELECT_DRUM_OFF      = 0;
Config.AUTO_SELECT_DRUM_CHANNEL  = 1;

Config.ribbonMode                  = Config.RIBBON_MODE_PITCH;    // What does the ribbon send?
Config.ribbonModeCCVal             = 1;
Config.defaultDeviceMode           = 20; /*MODE_DEVICE_PARAMS;*/
Config.footswitch2                 = Config.FOOTSWITCH_2_NEW_BUTTON;
Config.sendPort                    = 7000;
Config.autoSelectDrum              = Config.AUTO_SELECT_DRUM_OFF;
Config.stopAutomationOnKnobRelease = false;

//Push 1
Config.velocityCurve     = 1;
Config.padThreshold      = 20;

// Push 2
Config.sendsAreToggled   = false;
Config.displayBrightness = 255;
Config.ledBrightness     = 127;
Config.padSensitivity    = 5;
Config.padGain           = 5;
Config.padDynamics       = 5;

Config.DEFAULT_DEVICE_MODE_VALUES = [];

Config.initListeners (Config.STOP_AUTOMATION_ON_KNOB_RELEASE);


Config.init = function ()
{
    var prefs = host.getPreferences ();

    ///////////////////////////
    // Push 2 Hardware

    if (Config.isPush2)
    {
        Config.sendPortSetting = prefs.getNumberSetting ('Display Port', 'Hardware Setup', 1, 65535, 1, '', 7000);
        Config.sendPortSetting.addRawValueObserver (function (value)
        {
            Config.sendPort = Math.floor (value);
            Config.notifyListeners (Config.SEND_PORT);
        });
        
        Config.displayBrightnessSetting = prefs.getNumberSetting ('Display Brightness', 'Hardware Setup', 0, 100, 1, '%', 100);
        Config.displayBrightnessSetting.addRawValueObserver (function (value)
        {
            Config.displayBrightness = Math.floor (value);
            Config.notifyListeners (Config.DISPLAY_BRIGHTNESS);
        });
        
        Config.ledBrightnessSetting = prefs.getNumberSetting ('LED Brightness', 'Hardware Setup', 0, 100, 1, '%', 100);
        Config.ledBrightnessSetting.addRawValueObserver (function (value)
        {
            Config.ledBrightness = Math.floor (value);
            Config.notifyListeners (Config.LED_BRIGHTNESS);
        });
    }

    ///////////////////////////
    // Play and Sequence

    Config.activateAccentActiveSetting (prefs);
    Config.activateAccentValueSetting (prefs);
    Config.activateQuantizeAmountSetting (prefs);
    
    ///////////////////////////
    // Ribbon

    Config.ribbonModeSetting = prefs.getEnumSetting ("Mode", "Ribbon", [ "Pitch", "CC", "CC/Pitch", "Pitch/CC", "Fader" ], "Pitch");
    Config.ribbonModeSetting.addValueObserver (function (value)
    {
        switch (value)
        {
            case "Pitch":    Config.ribbonMode = Config.RIBBON_MODE_PITCH; break;
            case "CC":       Config.ribbonMode = Config.RIBBON_MODE_CC;    break;
            case "CC/Pitch": Config.ribbonMode = Config.RIBBON_MODE_CC_PB; break;
            case "Pitch/CC": Config.ribbonMode = Config.RIBBON_MODE_PB_CC; break;
            case "Fader":    Config.ribbonMode = Config.RIBBON_MODE_FADER; break;
        }
        Config.notifyListeners (Config.RIBBON_MODE);
    });
    
    Config.ribbonModeCCSetting = prefs.getNumberSetting ("CC", "Ribbon", 0, 127, 1, "", 1);
    Config.ribbonModeCCSetting.addRawValueObserver (function (value)
    {
        Config.ribbonModeCCVal = Math.floor (value);
        Config.notifyListeners (Config.RIBBON_MODE_CC_VAL);
    });
    
    ///////////////////////////
    // Scale

    Config.activateScaleSetting (prefs);
    Config.activateScaleBaseSetting (prefs);
    Config.activateScaleInScaleSetting (prefs);
    Config.activateScaleLayoutSetting (prefs);

    ///////////////////////////
    // Workflow

    Config.activateEnableVUMetersSetting (prefs);    
    Config.activateBehaviourOnStopSetting (prefs);
    Config.activateDisplayCrossfaderSetting (prefs);

    Config.DEFAULT_DEVICE_MODE_VALUES[MODE_DEVICE_PARAMS]   = "Device - Parameters";
    Config.DEFAULT_DEVICE_MODE_VALUES[MODE_DEVICE_COMMON]   = "Fixed - Common";
    Config.DEFAULT_DEVICE_MODE_VALUES[MODE_DEVICE_ENVELOPE] = "Fixed - Envelope";
    Config.DEFAULT_DEVICE_MODE_VALUES[MODE_DEVICE_MACRO]    = "Fixed - Macro";
    Config.DEFAULT_DEVICE_MODE_VALUES[MODE_DEVICE_USER]     = "Fixed - User";
    Config.DEFAULT_DEVICE_MODE_VALUES[MODE_DEVICE_DIRECT]   = "Direct - Parameters";
    var options = [];
    for (var i = 0; i < Config.DEFAULT_DEVICE_MODE_VALUES.length; i++)
        if (Config.DEFAULT_DEVICE_MODE_VALUES[i])
            options.push (Config.DEFAULT_DEVICE_MODE_VALUES[i]);
    
    Config.defaultDeviceModeSetting = prefs.getEnumSetting ("Default Device Mode", "Workflow", options, options[0]);
    Config.defaultDeviceModeSetting.addValueObserver (function (value)
    {
        for (var i = 0; i < Config.DEFAULT_DEVICE_MODE_VALUES.length; i++)
        {
            if (Config.DEFAULT_DEVICE_MODE_VALUES[i] == value)
            {
                Config.defaultDeviceMode = i;
                break;
            }
        }
        Config.notifyListeners (Config.DEFAULT_DEVICE_MODE);
    });
    
    Config.footswitch2Setting = prefs.getEnumSetting ("Footswitch 2", "Workflow", [ "Toggle Play", "Toggle Record", "Stop All Clips", "Toggle Clip Overdub", "Undo", "Tap Tempo", "New Button", "Clip Based Looper" ], "New Button");
    Config.footswitch2Setting.addValueObserver (function (value)
    {
        switch (value)
        {
            case "Toggle Play":         Config.footswitch2 = Config.FOOTSWITCH_2_TOGGLE_PLAY; break;
            case "Toggle Record":       Config.footswitch2 = Config.FOOTSWITCH_2_TOGGLE_RECORD; break;
            case "Stop All Clips":      Config.footswitch2 = Config.FOOTSWITCH_2_STOP_ALL_CLIPS; break;
            case "Toggle Clip Overdub": Config.footswitch2 = Config.FOOTSWITCH_2_TOGGLE_CLIP_OVERDUB; break;
            case "Undo":                Config.footswitch2 = Config.FOOTSWITCH_2_UNDO; break;
            case "Tap Tempo":           Config.footswitch2 = Config.FOOTSWITCH_2_TAP_TEMPO; break;
            case "New Button":          Config.footswitch2 = Config.FOOTSWITCH_2_NEW_BUTTON; break;
            case "Clip Based Looper":   Config.footswitch2 = Config.FOOTSWITCH_2_CLIP_BASED_LOOPER; break;
        }
        Config.notifyListeners (Config.RIBBON_MODE);
    });
    
    Config.activateFlipSessionSetting (prefs);
    
    Config.autoSelectDrumSetting = prefs.getEnumSetting ("Auto-select drum settings", "Workflow", [ "Off", "Channel" ], "Off");
    Config.autoSelectDrumSetting.addValueObserver (function (value)
    {
        switch (value)
        {
            case "Off":       Config.autoSelectDrum = Config.AUTO_SELECT_DRUM_OFF;      break;
            case "Channel":   Config.autoSelectDrum = Config.AUTO_SELECT_DRUM_CHANNEL;  break;
        }
        Config.notifyListeners (Config.AUTO_SELECT_DRUM);
    });
    
    Config.activateSelectClipOnLaunchSetting (prefs);
    
    Config.stopAutomationOnKnobReleaseSetting = prefs.getEnumSetting ("Stop automation recording on knob release", "Workflow", [ "Off", "On" ], "Off");
    Config.stopAutomationOnKnobReleaseSetting.addValueObserver (function (value)
    {
        Config.stopAutomationOnKnobRelease = value == "On";
        Config.notifyListeners (Config.STOP_AUTOMATION_ON_KNOB_RELEASE);
    });
    
    
    ///////////////////////////
    // Pad Sensitivity

    if (Config.isPush2)
    {
        Config.padSensitivitySetting = prefs.getNumberSetting ('Sensitivity', "Pads", 0, 10, 1, '', 5);
        Config.padSensitivitySetting.addRawValueObserver (function (value)
        {
            Config.padSensitivity = Math.floor (value);
            Config.notifyListeners (Config.PAD_SENSITIVITY);
        });
    
        Config.padGainSetting = prefs.getNumberSetting ('Gain', "Pads", 0, 10, 1, '', 5);
        Config.padGainSetting.addRawValueObserver (function (value)
        {
            Config.padGain = Math.floor (value);
            Config.notifyListeners (Config.PAD_GAIN);
        });
        
        Config.padDynamicsSetting = prefs.getNumberSetting ('Dynamics', "Pads", 0, 10, 1, '', 5);
        Config.padDynamicsSetting.addRawValueObserver (function (value)
        {
            Config.padDynamics = Math.floor (value);
            Config.notifyListeners (Config.PAD_DYNAMICS);
        });
    }
    else
    {
        Config.velocityCurveSetting = prefs.getEnumSetting ("Velocity Curve", "Pads", PUSH_PAD_CURVES_NAME, PUSH_PAD_CURVES_NAME[1]);
        Config.velocityCurveSetting.addValueObserver (function (value)
        {
            for (var i = 0; i < PUSH_PAD_CURVES_NAME.length; i++)
            {
                if (PUSH_PAD_CURVES_NAME[i] === value)
                {
                    Config.velocityCurve = i;
                    break;
                }
            }
            Config.notifyListeners (Config.VELOCITY_CURVE);
        });
    
        Config.padThresholdSetting = prefs.getEnumSetting ("Pad Threshold", "Pads", PUSH_PAD_THRESHOLDS_NAME, PUSH_PAD_THRESHOLDS_NAME[20]);
        Config.padThresholdSetting.addValueObserver (function (value)
        {
            for (var i = 0; i < PUSH_PAD_THRESHOLDS_NAME.length; i++)
            {
                if (PUSH_PAD_THRESHOLDS_NAME[i] === value)
                {
                    Config.padThreshold = i;
                    break;
                }
            }
            Config.notifyListeners (Config.PAD_THRESHOLD);
        });
    }
    
    Config.activateConvertAftertouchSetting (prefs);
};

Config.setRibbonMode = function (mode)
{
    switch (mode)
    {
        case Config.RIBBON_MODE_PITCH: Config.ribbonModeSetting.set ("Pitch"); break;
        case Config.RIBBON_MODE_CC: Config.ribbonModeSetting.set ("CC"); break;
        case Config.RIBBON_MODE_CC_PB: Config.ribbonModeSetting.set ("CC/Pitch"); break;
        case Config.RIBBON_MODE_PB_CC: Config.ribbonModeSetting.set ("Pitch/CC"); break;
        case Config.RIBBON_MODE_FADER: Config.ribbonModeSetting.set ("Fader"); break;
    }
};

Config.setRibbonModeCC = function (value)
{
    Config.ribbonModeCCSetting.setRaw (value);
};

Config.setDefaultDeviceMode = function (mode)
{
    Config.defaultDeviceModeSetting.set (Config.DEFAULT_DEVICE_MODE_VALUES[mode]);
};

Config.changePadThreshold = function (control)
{
    var value = changeIntValue (control, Config.padThreshold, 1, PUSH_PAD_THRESHOLDS_NAME.length);
    Config.padThreshold = Math.max (0, Math.min (value, PUSH_PAD_THRESHOLDS_NAME.length - 1));
    Config.padThresholdSetting.set (PUSH_PAD_THRESHOLDS_NAME[Config.padThreshold]);
};

Config.changeVelocityCurve = function (control)
{
    var value = changeIntValue (control, Config.velocityCurve, 1, PUSH_PAD_CURVES_NAME.length);
    Config.velocityCurve = Math.max (0, Math.min (value, PUSH_PAD_CURVES_NAME.length - 1));
    Config.velocityCurveSetting.set (PUSH_PAD_CURVES_NAME[Config.velocityCurve]);
};

Config.changeDisplayBrightness = function (control)
{
    Config.displayBrightnessSetting.setRaw (changeIntValue (control, Config.displayBrightness, 1, 101));
};

Config.changeLEDBrightness = function (control)
{
    Config.ledBrightnessSetting.setRaw (changeIntValue (control, Config.ledBrightness, 1, 101));
};

Config.changePadSensitivity = function (control)
{
    Config.padSensitivitySetting.setRaw (changeIntValue (control, Config.padSensitivity, 1, 11));
};

Config.changePadGain = function (control)
{
    Config.padGainSetting.setRaw (changeIntValue (control, Config.padGain, 1, 11));
};

Config.changePadDynamics = function (control)
{
    Config.padDynamicsSetting.setRaw (changeIntValue (control, Config.padDynamics, 1, 11));
};


//------------------------------
// Value conversions
//------------------------------

Config.toMidiValue = function (value)
{
    return Math.min (Math.round (value * 127 / (Config.maxParameterValue - 1)), 127);
};

Config.toDAWValue = function (value)
{
    return Math.round (value * (Config.maxParameterValue - 1) / 127);
};

Config.toDisplayValue = function (value)
{
    // No conversion since the default value range of the script is the same as of the display application (1024)  
    return value;
};
