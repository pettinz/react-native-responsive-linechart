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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Line = void 0;
var deepmerge_1 = __importDefault(require("deepmerge"));
var React = __importStar(require("react"));
var react_native_svg_1 = require("react-native-svg");
var ChartContext_1 = __importDefault(require("./ChartContext"));
var Line_utils_1 = require("./Line.utils");
var utils_1 = require("./utils");
var Line = React.forwardRef(function Line(props, ref) {
    var _a = React.useContext(ChartContext_1.default), contextData = _a.data, dimensions = _a.dimensions, viewportDomain = _a.viewportDomain, viewportOrigin = _a.viewportOrigin, lastTouch = _a.lastTouch;
    var _b = deepmerge_1.default(defaultProps, props), _c = _b.theme, stroke = _c.stroke, scatter = _c.scatter, tooltipComponent = _b.tooltipComponent, _d = _b.data, data = _d === void 0 ? contextData : _d, tension = _b.tension, smoothing = _b.smoothing, onTooltipSelect = _b.onTooltipSelect, hideTooltipOnDragEnd = _b.hideTooltipOnDragEnd, hideTooltipAfter = _b.hideTooltipAfter, _e = _b.onTooltipSelectEnd, onTooltipSelectEnd = _e === void 0 ? function () { } : _e, tooltipIndex = _b.tooltipIndex, setTooltipIndex = _b.setTooltipIndex;
    if (!dimensions) {
        return null;
    }
    React.useImperativeHandle(ref, function () { return ({
        setTooltipIndex: function (index) {
            if (typeof index === 'number' && (index < 0 || index >= data.length)) {
                throw new Error("Range out of bounds. Tried to set tooltip index to " + index + " but there are only " + data.length + " data points.");
            }
            setTooltipIndex(index);
        },
    }); });
    React.useEffect(function () {
        var _a, _b;
        var scaledPoints = utils_1.scalePointsToDimensions(data, viewportDomain, dimensions);
        var newIndex = Line_utils_1.calculateTooltipIndex(scaledPoints, lastTouch === null || lastTouch === void 0 ? void 0 : lastTouch.position);
        var tooltipTimer;
        if ((lastTouch === null || lastTouch === void 0 ? void 0 : lastTouch.type) === 'panEnd') {
            if (setTooltipIndex !== undefined && hideTooltipOnDragEnd && Math.abs((_a = lastTouch === null || lastTouch === void 0 ? void 0 : lastTouch.translation) === null || _a === void 0 ? void 0 : _a.x) > 5) {
                setTooltipIndex(undefined);
            }
            // Hide tooltip after specified time
            else if (typeof hideTooltipAfter === 'number') {
                tooltipTimer = setTimeout(function () { return setTooltipIndex(undefined); }, hideTooltipAfter);
            }
            onTooltipSelectEnd();
        }
        else if (newIndex !== tooltipIndex && lastTouch) {
            // Hide tooltip after specified time
            if (typeof hideTooltipAfter === 'number') {
                tooltipTimer = setTimeout(function () { return setTooltipIndex(undefined); }, hideTooltipAfter);
            }
            // Necessary for Android because pan is called even when finger is not actually panning.
            // If we don't check for this, we have interference with the tap handler
            if (setTooltipIndex !== undefined && ((lastTouch === null || lastTouch === void 0 ? void 0 : lastTouch.type) !== 'pan' || Math.abs((_b = lastTouch === null || lastTouch === void 0 ? void 0 : lastTouch.translation) === null || _b === void 0 ? void 0 : _b.x)) > 5) {
                setTooltipIndex(newIndex);
            }
            if (setTooltipIndex !== undefined && typeof onTooltipSelect === 'function' && typeof newIndex === 'number' && data.length > newIndex) {
                onTooltipSelect(data[newIndex], newIndex);
            }
        }
        else if (newIndex === tooltipIndex && (lastTouch === null || lastTouch === void 0 ? void 0 : lastTouch.type) === 'tap') {
            setTooltipIndex(undefined);
        }
        return function () {
            clearTimeout(tooltipTimer);
        };
    }, [lastTouch, hideTooltipAfter]);
    var scaledPoints = utils_1.scalePointsToDimensions(data, viewportDomain, dimensions);
    var points = Line_utils_1.adjustPointsForThickStroke(scaledPoints, stroke);
    var path = utils_1.svgPath(points, smoothing, tension);
    return (React.createElement(React.Fragment, null,
        React.createElement(react_native_svg_1.G, { translateX: viewportOrigin.x, translateY: viewportOrigin.y },
            React.createElement(react_native_svg_1.Path, { d: path, fill: "none", strokeLinecap: "round", strokeDasharray: stroke.dashArray.length > 0 ? stroke.dashArray.join(',') : undefined, stroke: stroke.color, strokeWidth: stroke.width, strokeOpacity: stroke.opacity, mask: "url(#Mask)" }),
            points.map(function (p, i) {
                var shape = i === tooltipIndex ? deepmerge_1.default(scatter.default, scatter.selected) : scatter.default;
                // Don't render if point falls out of viewport
                if (data[i].x < viewportDomain.x.min || data[i].x > viewportDomain.x.max || data[i].y < viewportDomain.y.min || data[i].y > viewportDomain.y.max) {
                    return null;
                }
                // Don't render if shape has no dimensions
                if (shape.width === 0 || shape.height === 0) {
                    return null;
                }
                return (React.createElement(react_native_svg_1.Rect, { key: JSON.stringify(p), x: p.x - shape.width / 2 + shape.dx, y: p.y - shape.height / 2 - shape.dy, rx: shape.rx, fill: shape.color, opacity: shape.opacity, height: shape.height, width: shape.width, stroke: shape.border.color, strokeWidth: shape.border.width, strokeOpacity: shape.border.opacity, strokeDasharray: shape.border.dashArray, transform: { rotation: shape.rotation, originX: p.x + shape.dx, originY: p.y + shape.dy } }));
            })),
        tooltipIndex !== undefined &&
            tooltipComponent &&
            React.cloneElement(tooltipComponent, { value: data[tooltipIndex], position: scaledPoints[tooltipIndex] })));
});
exports.Line = Line;
var defaultProps = {
    theme: {
        stroke: {
            color: 'black',
            width: 1,
            opacity: 1,
            dashArray: [],
        },
        scatter: {
            default: {
                width: 0,
                height: 0,
                dx: 0,
                dy: 0,
                rx: 0,
                color: 'black',
                border: {
                    color: 'black',
                    width: 0,
                    opacity: 1,
                    dashArray: [],
                },
                rotation: 0,
            },
            selected: {},
        },
    },
    tension: 0.3,
    smoothing: 'none',
};
