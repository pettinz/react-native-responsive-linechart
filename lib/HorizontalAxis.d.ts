import * as React from 'react';
import { Stroke, Label } from './types';
declare type Props = {
    theme?: {
        axis?: {
            visible?: boolean;
            stroke?: Stroke;
            dy?: number;
        };
        ticks?: {
            visible?: boolean;
            stroke?: Stroke;
            length?: number;
            dy?: number;
        };
        labels?: {
            visible?: boolean;
            label?: Label;
            formatter?: (value: number) => string;
            centered?: boolean;
        };
        grid?: {
            visible?: boolean;
            stroke?: Stroke;
        };
    };
    tickValues?: number[];
    tickCount?: number;
    labelValues?: string[];
    includeOriginTick?: boolean;
};
declare const HorizontalAxis: React.FC<Props>;
export { HorizontalAxis };
