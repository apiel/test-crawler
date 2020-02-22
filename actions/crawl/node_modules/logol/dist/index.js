"use strict";
var __read = (this && this.__read) || function (o, n) {
    var m = typeof Symbol === "function" && o[Symbol.iterator];
    if (!m) return o;
    var i = m.call(o), r, ar = [], e;
    try {
        while ((n === void 0 || n-- > 0) && !(r = i.next()).done) ar.push(r.value);
    }
    catch (error) { e = { error: error }; }
    finally {
        try {
            if (r && !r.done && (m = i["return"])) m.call(i);
        }
        finally { if (e) throw e.error; }
    }
    return ar;
};
var __spread = (this && this.__spread) || function () {
    for (var ar = [], i = 0; i < arguments.length; i++) ar = ar.concat(__read(arguments[i]));
    return ar;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var chalk_1 = __importDefault(require("chalk"));
exports.logol = {
    info: console.info,
    log: console.log,
    debug: console.debug,
    warn: console.warn,
    error: console.error,
};
function colorize(args, fn) {
    return args.map(function (arg) { return ['string', 'number'].includes(typeof (arg)) ? fn(arg) : arg; });
}
function info() {
    var args = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        args[_i] = arguments[_i];
    }
    exports.logol.info.apply(exports.logol, __spread([chalk_1.default.bold(chalk_1.default.blue('• info'))], args));
}
exports.info = info;
function log() {
    var args = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        args[_i] = arguments[_i];
    }
    exports.logol.log.apply(exports.logol, __spread([chalk_1.default.bold('•')], args));
}
exports.log = log;
function success() {
    var args = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        args[_i] = arguments[_i];
    }
    exports.logol.info.apply(exports.logol, __spread([chalk_1.default.bold(chalk_1.default.green('• success'))], colorize(args, chalk_1.default.green)));
}
exports.success = success;
function debug() {
    var args = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        args[_i] = arguments[_i];
    }
    exports.logol.debug.apply(exports.logol, __spread([chalk_1.default.bold(chalk_1.default.gray('• debug'))], colorize(args, chalk_1.default.gray)));
}
exports.debug = debug;
function warn() {
    var args = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        args[_i] = arguments[_i];
    }
    exports.logol.warn.apply(exports.logol, __spread([chalk_1.default.bold(chalk_1.default.yellow('• warn'))], colorize(args, chalk_1.default.yellow)));
}
exports.warn = warn;
function error() {
    var args = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        args[_i] = arguments[_i];
    }
    exports.logol.error.apply(exports.logol, __spread([chalk_1.default.bold(chalk_1.default.red('• ') + chalk_1.default.bgRed('ERR'))], colorize(args, chalk_1.default.red)));
}
exports.error = error;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi9saWIvaW5kZXgudHN4Il0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFBQSxnREFBMEI7QUFFYixRQUFBLEtBQUssR0FBRztJQUNqQixJQUFJLEVBQUUsT0FBTyxDQUFDLElBQUk7SUFDbEIsR0FBRyxFQUFFLE9BQU8sQ0FBQyxHQUFHO0lBQ2hCLEtBQUssRUFBRSxPQUFPLENBQUMsS0FBSztJQUNwQixJQUFJLEVBQUUsT0FBTyxDQUFDLElBQUk7SUFDbEIsS0FBSyxFQUFFLE9BQU8sQ0FBQyxLQUFLO0NBQ3ZCLENBQUE7QUFFRCxTQUFTLFFBQVEsQ0FBQyxJQUFXLEVBQUUsRUFBTztJQUNsQyxPQUFPLElBQUksQ0FBQyxHQUFHLENBQUMsVUFBQSxHQUFHLElBQUksT0FBQyxDQUFDLFFBQVEsRUFBRSxRQUFRLENBQVMsQ0FBQyxRQUFRLENBQUMsT0FBTSxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxFQUFuRSxDQUFtRSxDQUFFLENBQUM7QUFDakcsQ0FBQztBQUVELFNBQWdCLElBQUk7SUFBQyxjQUFZO1NBQVosVUFBWSxFQUFaLHFCQUFZLEVBQVosSUFBWTtRQUFaLHlCQUFZOztJQUM3QixhQUFLLENBQUMsSUFBSSxPQUFWLGFBQUssWUFBTSxlQUFLLENBQUMsSUFBSSxDQUFDLGVBQUssQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLENBQUMsR0FBSyxJQUFJLEdBQUU7QUFDMUQsQ0FBQztBQUZELG9CQUVDO0FBRUQsU0FBZ0IsR0FBRztJQUFDLGNBQVk7U0FBWixVQUFZLEVBQVoscUJBQVksRUFBWixJQUFZO1FBQVoseUJBQVk7O0lBQzVCLGFBQUssQ0FBQyxHQUFHLE9BQVQsYUFBSyxZQUFLLGVBQUssQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLEdBQUssSUFBSSxHQUFFO0FBQ3hDLENBQUM7QUFGRCxrQkFFQztBQUVELFNBQWdCLE9BQU87SUFBQyxjQUFZO1NBQVosVUFBWSxFQUFaLHFCQUFZLEVBQVosSUFBWTtRQUFaLHlCQUFZOztJQUNoQyxhQUFLLENBQUMsSUFBSSxPQUFWLGFBQUssWUFBTSxlQUFLLENBQUMsSUFBSSxDQUFDLGVBQUssQ0FBQyxLQUFLLENBQUMsV0FBVyxDQUFDLENBQUMsR0FBSyxRQUFRLENBQUMsSUFBSSxFQUFFLGVBQUssQ0FBQyxLQUFLLENBQUMsR0FBRTtBQUNyRixDQUFDO0FBRkQsMEJBRUM7QUFFRCxTQUFnQixLQUFLO0lBQUMsY0FBWTtTQUFaLFVBQVksRUFBWixxQkFBWSxFQUFaLElBQVk7UUFBWix5QkFBWTs7SUFDOUIsYUFBSyxDQUFDLEtBQUssT0FBWCxhQUFLLFlBQU8sZUFBSyxDQUFDLElBQUksQ0FBQyxlQUFLLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxDQUFDLEdBQUssUUFBUSxDQUFDLElBQUksRUFBRSxlQUFLLENBQUMsSUFBSSxDQUFDLEdBQUU7QUFDbEYsQ0FBQztBQUZELHNCQUVDO0FBRUQsU0FBZ0IsSUFBSTtJQUFDLGNBQVk7U0FBWixVQUFZLEVBQVoscUJBQVksRUFBWixJQUFZO1FBQVoseUJBQVk7O0lBQzdCLGFBQUssQ0FBQyxJQUFJLE9BQVYsYUFBSyxZQUFNLGVBQUssQ0FBQyxJQUFJLENBQUMsZUFBSyxDQUFDLE1BQU0sQ0FBQyxRQUFRLENBQUMsQ0FBQyxHQUFLLFFBQVEsQ0FBQyxJQUFJLEVBQUUsZUFBSyxDQUFDLE1BQU0sQ0FBQyxHQUFFO0FBQ3BGLENBQUM7QUFGRCxvQkFFQztBQUVELFNBQWdCLEtBQUs7SUFBQyxjQUFZO1NBQVosVUFBWSxFQUFaLHFCQUFZLEVBQVosSUFBWTtRQUFaLHlCQUFZOztJQUM5QixhQUFLLENBQUMsS0FBSyxPQUFYLGFBQUssWUFBTyxlQUFLLENBQUMsSUFBSSxDQUFDLGVBQUssQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLEdBQUcsZUFBSyxDQUFDLEtBQUssQ0FBQyxLQUFLLENBQUMsQ0FBQyxHQUFLLFFBQVEsQ0FBQyxJQUFJLEVBQUUsZUFBSyxDQUFDLEdBQUcsQ0FBQyxHQUFFO0FBQ2hHLENBQUM7QUFGRCxzQkFFQyJ9