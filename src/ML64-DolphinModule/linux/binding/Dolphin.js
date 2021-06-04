"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Dolphin = exports.AddressSpace = exports.CoreState = void 0;
var path = __importStar(require("path"));
var CoreState;
(function (CoreState) {
    CoreState[CoreState["Uninitialized"] = 0] = "Uninitialized";
    CoreState[CoreState["Paused"] = 1] = "Paused";
    CoreState[CoreState["Running"] = 2] = "Running";
    CoreState[CoreState["Stopping"] = 3] = "Stopping";
    CoreState[CoreState["Starting"] = 4] = "Starting";
})(CoreState = exports.CoreState || (exports.CoreState = {}));
;
var AddressSpace;
(function (AddressSpace) {
    var Type;
    (function (Type) {
        Type[Type["Effective"] = 0] = "Effective";
        Type[Type["Auxiliary"] = 1] = "Auxiliary";
        Type[Type["Physical"] = 2] = "Physical";
        Type[Type["Mem1"] = 3] = "Mem1";
        Type[Type["Mem2"] = 4] = "Mem2";
        Type[Type["Fake"] = 5] = "Fake";
    })(Type = AddressSpace.Type || (AddressSpace.Type = {}));
})(AddressSpace = exports.AddressSpace || (exports.AddressSpace = {}));
var Dolphin = /** @class */ (function () {
    function Dolphin(createInfo) {
        this.eventHandler = undefined;
        this.mtCbHandler = undefined;
        this.numTicks = 0;
        this.coreState = -1;
        this.onTick = undefined;
        this.onImGui = undefined;
        this.onStateChanged = undefined;
        this.module = require(path.join(__dirname, 'dolphin.node'));
        this.frontend = new this.module.Frontend();
        this.createInfo = createInfo;
    }
    Dolphin.prototype.start = function (bootInfo) {
        var _this = this;
        this.frontend.initialize(this.createInfo);
        delete this.createInfo;
        this.eventHandler = setInterval((function () { return _this.frontend.processEvents(4); }).bind(this), 16);
        this.mtCbHandler = setInterval(this.handleMtCb.bind(this), 0);
        this.bindCallbacks();
        this.frontend.enableMtCallbacks();
        this.frontend.startup(bootInfo);
        this.handleStateChanged(0);
    };
    Dolphin.prototype.bindCallbacks = function () {
        this.frontend.on('state-changed', this.handleStateChanged.bind(this));
        this.frontend.on('stop-requested', this.handleStopRequested.bind(this));
        this.frontend.on('stop-complete', this.handleStopComplete.bind(this));
        this.frontend.on('exit-requested', this.handleExitRequested.bind(this));
    };
    Dolphin.prototype.handleStateChanged = function (newState) {
        if (this.coreState != newState) {
            try {
                if (this.onStateChanged)
                    this.onStateChanged(newState);
            }
            finally {
                this.coreState = newState;
            }
        }
    };
    Dolphin.prototype.handleStopRequested = function () {
        if (this.coreState == CoreState.Uninitialized)
            return true;
        if (this.numTicks < 30)
            return false;
        var v = this.frontend.requestStop();
        if (v)
            this.frontend.disableMtCallbacks();
        return v;
    };
    Dolphin.prototype.handleStopComplete = function () {
        this.numTicks = 0;
    };
    Dolphin.prototype.handleExitRequested = function () {
        if (this.eventHandler)
            clearInterval(this.eventHandler);
        this.frontend.shutdown();
        if (this.mtCbHandler)
            clearInterval(this.mtCbHandler);
    };
    Dolphin.prototype.handleMtCb = function () {
        if (this.frontend.isOnTickPending()) {
            this.frontend.signalHandlingOnTick();
            ++this.numTicks;
            try {
                if (this.onTick)
                    this.onTick();
            }
            finally {
                this.frontend.unlockOnTick();
            }
        }
        if (this.frontend.isOnImGuiPending()) {
            this.frontend.signalHandlingOnImGui();
            try {
                if (this.onImGui)
                    this.onImGui();
            }
            finally {
                this.frontend.unlockOnImGui();
            }
        }
    };
    Dolphin.prototype.displayMessage = function (text, timeMs) {
        this.frontend.displayMessage(text, timeMs);
    };
    Dolphin.prototype.button = function (text) {
        return this.frontend.button(text);
    };
    Object.defineProperty(Dolphin.prototype, "JitInterface", {
        get: function () {
            return this.module.JitInterface;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Dolphin.prototype, "Memmap", {
        get: function () {
            return this.module.Memmap;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Dolphin.prototype, "AddressSpace", {
        get: function () {
            return this.module.AddressSpace;
        },
        enumerable: false,
        configurable: true
    });
    return Dolphin;
}());
exports.Dolphin = Dolphin;
