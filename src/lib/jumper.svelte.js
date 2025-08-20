import {Coordinate, BezierCubic} from './geometry.js';

const in_to_cm = 2.54;

const default_measurements = {
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
    ease: 1,
    unit: "in",
};

const measurements = $state(default_measurements);

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
const appState = $state({mobile: false, theme: "nord", dark: false});

function convert_units(new_unit) {
    let to_convert = [
        "A_c",
        "W_sl",
        "W_w",
        "H_Cap",
        "H_sl",
        "H_rib",
        "W",
        "W_s",
        "H",
        "W_n",
        "H_n",
        "H_nb",
        "neckband_width",
        "ease"
    ];
    let to_convert_inverse = [
        "st_per_inch",
        "row_per_inch",
        "row_per_inch_rib"
    ];
    if (new_unit == measurements.unit) {
        return;
    }
    if (new_unit == 'in') {
        to_convert.forEach((k) => {measurements[k] = Math.round(measurements[k] / in_to_cm * 100) / 100});
        to_convert_inverse.forEach((k) => {measurements[k] = Math.round(measurements[k] * in_to_cm * 100) / 100});
    } else if (new_unit = 'cm') {
        to_convert.forEach((k) => {measurements[k] = Math.round(measurements[k] * in_to_cm * 100) / 100});
        to_convert_inverse.forEach((k) => {measurements[k] = Math.round(measurements[k] / in_to_cm * 100) / 100});
    } else {
        console.warn(`Unexpected unit: ${new_unit}\nUnable to convert.`)
    }
}

function set_cookie(name, value, days) {
    let expires = "";
    if (days) {
        let date = new Date();
        date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
        expires = "; expires=" + date.toUTCString();
    }
    document.cookie = name + "=" + (value || "") + expires + "; path=/";
}

function get_cookie(name) {
    let nameEQ = name + "=";
    let ca = document.cookie.split(';');
    for (let i = 0; i < ca.length; i++) {
        let c = ca[i];
        while (c.charAt(0) == ' ') c = c.substring(1, c.length);
        if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length, c.length);
    }
    return null;
}

function save_state_cookie() {
    // just need measurements
    set_cookie("jumper_measurements", JSON.stringify(measurements), 30);
    set_cookie("jumper_app_state", JSON.stringify(appState), 30);
    console.log("State saved to cookie.");
}

function load_state_cookie() {
    let measurements_cookie = get_cookie("jumper_measurements");
    console.log(measurements_cookie);
    if (measurements_cookie) {
        try {
            let parsed = JSON.parse(measurements_cookie);
            console.log("Loaded state from cookie:", parsed);
            Object.keys(parsed).forEach((k) => {
                if (measurements.hasOwnProperty(k)) {
                    measurements[k] = parsed[k];
                }
            });
        } catch (e) {
            console.error("Failed to parse saved state:", e);
        }
    }
    let app_state_cookie = get_cookie("jumper_app_state");
    if (app_state_cookie) {
        try {
            let parsed = JSON.parse(app_state_cookie);
            console.log("Loaded app state from cookie:", parsed);
            Object.keys(parsed).forEach((k) => {
                if (appState.hasOwnProperty(k)) {
                    appState[k] = parsed[k];
                }
            });
        } catch (e) {
            console.error("Failed to parse app state:", e);
        }
    }
    console.log("State loaded from cookie.");
    update_derived();
}

function reset_measurements() {
    let to_reset = [
        "A_c",
        "W_sl",
        "W_w",
        "H_Cap",
        "H_sl",
        "H_rib",
        "W",
        "W_s",
        "H",
        "W_n",
        "H_n",
        "H_nb",
        "neckband_width",
        "ease"
    ];
    to_reset.forEach((k) => {
        measurements[k] = default_measurements[k];
    });
    update_derived();
    save_state_cookie();
}

function reset_settings() {
    let to_reset = [
        "st_per_inch",
        "row_per_inch",
        "row_per_inch_rib",
        "neckline",
        "neckband",
        "unit"
    ];
    to_reset.forEach((k) => {
        measurements[k] = default_measurements[k];
    });
    update_derived();
    save_state_cookie();
}

export { measurements, update_derived, appState, convert_units, save_state_cookie, load_state_cookie, reset_measurements, reset_settings };