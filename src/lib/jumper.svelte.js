import {Coordinate, BezierCubic} from './geometry.js';


const measurements = $state({
    A_c: 23,
    W_sl: 16,
    W_w: 9,
    H_Cap: undefined,
    H_sl: 28,
    H_rib: 2,
    W: 22.5,
    W_s: 14,
    H: 32,
    W_n: 10,
    H_n: 6,
    H_nb: 1,
    st_per_inch: 8,
    row_per_inch: 8,
    row_per_inch_rib: 8,
    neckline: "round",
    neckband: "folded",
    neckband_width: 2,
    unit: "in",
});

function calc_cap_height() {
    let upper_height = Math.sqrt(measurements.A_c ** 2 - measurements.W_sl ** 2) / 2;
    let lower_height = upper_height / 2;
    let middle_height = (upper_height + lower_height) / 2;
    let target_length = measurements.A_c / 2;
    let epsilon = 1e-6;

    function cap_length(h) {
        let p1 = new Coordinate(0,0);
        let c1 = new Coordinate(measurements.W_sl / 4, 0);
        let c2 = new Coordinate(measurements.W_sl / 4, h);
        let p2 = new Coordinate(measurements.W_sl / 2, h);
        let bezier = new BezierCubic(p1, c1, c2, p2);
        return bezier.length;
    }
    let iter = 0;
    while (Math.abs(target_length - cap_length(middle_height)) > epsilon && iter < 500) {
        middle_height = (upper_height + lower_height) / 2;
        if (cap_length(middle_height) < target_length) {
            lower_height = middle_height;
        } else {
            upper_height = middle_height;
        }
        iter++;
    }
    if (iter >= 500) {
        console.warn("calc_cap_height: Iteration limit reached, result may not be accurate.");
    }
    measurements.H_cap = middle_height;
    return middle_height;
}

function update_derived() {
    calc_cap_height();
    // we might want to update other derived measurements here in the future
}

update_derived();
const appState = $state({mobile: false});

export { measurements, update_derived, appState };