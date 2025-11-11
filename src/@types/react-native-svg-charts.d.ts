declare module 'react-native-svg-charts' {
    import { ComponentType } from 'react';

    export const BarChart: ComponentType<any>;
    export const PieChart: ComponentType<any>;
    export const Grid: ComponentType<any> & {
        Direction: {
            HORIZONTAL: 'horizontal';
            VERTICAL: 'vertical';
        };
    };
    export const YAxis: ComponentType<any>;
    export const StackedBarChart: ComponentType<any>;
    export const AreaChart: ComponentType<any>;
    export const LineChart: ComponentType<any>;
    export const XAxis: ComponentType<any>;

    export default any;
}
