class Coordinate {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this._length = undefined;
        this._angle = undefined;
    }

    get length() {
        if (this._length === undefined) {
            this._length = Math.sqrt(this.x * this.x + this.y * this.y);
        }
        return this._length;
    }

    get angle() {
        if (this._angle === undefined) {
            this._angle = Math.atan2(this.y, this.x);
        }
        return this._angle;
    }

    static fromPolar(length, angle) {
        return new Coordinate(length * Math.cos(angle), length * Math.sin(angle));
    }

    add(other) {
        return new Coordinate(this.x + other.x, this.y + other.y);
    }

    subtract(other) {
        return new Coordinate(this.x - other.x, this.y - other.y);
    }

    multiply(scalar) {
        return new Coordinate(this.x * scalar, this.y * scalar);
    }

    scaleX(factor) {
        return new Coordinate(this.x * factor, this.y);
    }

    scaleY(factor) {
        return new Coordinate(this.x, this.y * factor);
    }

    scaleXY(factorX, factorY) {
        return new Coordinate(this.x * factorX, this.y * factorY);
    }

    rotate(angle) {
        const cos = Math.cos(angle);
        const sin = Math.sin(angle);
        return new Coordinate(
            this.x * cos - this.y * sin,
            this.x * sin + this.y * cos
        );
    }

    rotateAround(point, angle) {
        const translated = this.subtract(point);
        const rotated = translated.rotate(angle);
        return rotated.add(point);
    }

    distance(other) {
        return Math.sqrt(Math.pow(this.x - other.x, 2) + Math.pow(this.y - other.y, 2));
    }

    distanceSquared(other) {
        return Math.pow(this.x - other.x, 2) + Math.pow(this.y - other.y, 2);
    }

    get unit() {
        const length = this.length;
        if (length === 0) return new Coordinate(0, 0);
        return new Coordinate(this.x / length, this.y / length);
    }

    static origin() {
        return new Coordinate(0, 0);
    }

    copy() {
        return new Coordinate(this.x, this.y);
    }
}

function X(x) {
    return new Coordinate(x, 0);
}

function Y(y) {
    return new Coordinate(0, y);
}

class Line {
    constructor(start, end) {
        this.start = start;
        this.end = end;
        this._length = undefined;
        this._angle = undefined;
    }

    get length() {
        if (this._length === undefined) {
            this._length = this.start.distance(this.end);
        }
        return this._length;
    }

    get angle() {
        if (this._angle === undefined) {
            this._angle = Math.atan2(this.end.y - this.start.y, this.end.x - this.start.x);
        }
        return this._angle;
    }

    get midpoint() {
        return new Coordinate(
            (this.start.x + this.end.x) / 2,
            (this.start.y + this.end.y) / 2
        );
    }

    get unit() {
        return new Line(this.start.unit(), this.end.unit());
    }

    get inverse() {
        return new Line(this.end, this.start);
    }

    translate(vector) {
        return new Line(this.start.add(vector), this.end.add(vector));
    }

    scale(scalar) {
        return new Line(this.start.multiply(scalar), this.end.multiply(scalar));
    }

    scaleX(factor) {
        return new Line(this.start.scaleX(factor), this.end.scaleX(factor));
    }

    scaleY(factor) {
        return new Line(this.start.scaleY(factor), this.end.scaleY(factor));
    }

    scaleXY(factorX, factorY) {
        return new Line(this.start.scaleXY(factorX, factorY), this.end.scaleXY(factorX, factorY));
    }

    x_at_y(y) {
        if (this.start.y === this.end.y) {
            throw new Error("Line is horizontal, cannot compute x at y.");
        }
        const t = (y - this.start.y) / (this.end.y - this.start.y);
        return this.start.x + t * (this.end.x - this.start.x);
    }

    y_at_x(x) {
        if (this.start.x === this.end.x) {
            throw new Error("Line is vertical, cannot compute y at x.");
        }
        const t = (x - this.start.x) / (this.end.x - this.start.x);
        return this.start.y + t * (this.end.y - this.start.y);
    }

    rotate(angle) {
        return new Line(this.start.rotate(angle), this.end.rotate(angle));
    }

    rotateAround(point, angle) {
        return new Line(
            this.start.rotateAround(point, angle),
            this.end.rotateAround(point, angle)
        );
    }

    copy() {
        return new Line(this.start.copy(), this.end.copy());
    }

    to_changes() {
        if (this.start.y > this.end.y) {
            return this.inverse.to_changes();
        }
        if (this.start.x === this.end.x) {
            return [];
        }
        if (this.start.y === this.end.y) {
            return [{r: Math.round(this.start.y), diff: Math.round(this.end.x - this.start.x)}];
        }

        let start_y = Math.round(this.start.y);
        let last_x = Math.round(this.start.x);
        let changes = [];
        for (let r = start_y + 1; r <= Math.round(this.end.y); r++) {
            let x = Math.round(this.x_at_y(r));
            if (x !== last_x) {
                changes.push({r: r - start_y, diff: x - last_x});
                last_x = x;
            }
        }
        if (last_x !== Math.round(this.end.x)) {
            changes.push({r: Math.round(this.end.y) - start_y, diff: Math.round(this.end.x) - last_x});
        }
        return changes;
    }

}

class BezierCubic {
    constructor(start, c1, c2, end) {
        this.start = start;
        this.c1 = c1;
        if (c2 === undefined) {
            this.c2 = c1.copy(); // If c2 is not provided, use c1 as c2
        } else {
            this.c2 = c2;
        }
        this.end = end;        
        this._length = undefined;
    }

    x(t) {
        return (1 - t) ** 3 * this.start.x +
               3 * (1 - t) ** 2 * t * this.c1.x +
               3 * (1 - t) * t ** 2 * this.c2.x +
               t ** 3 * this.end.x;
    }

    y(t) {
        return (1 - t) ** 3 * this.start.y +
               3 * (1 - t) ** 2 * t * this.c1.y +
               3 * (1 - t) * t ** 2 * this.c2.y +
               t ** 3 * this.end.y;
    }

    point(t) {
        return new Coordinate(this.x(t), this.y(t));
    }

    x_at_y(y) {
        if (y < this.start.y || y > this.end.y) {
            throw new Error(`y = ${y} is out of bounds for the Bezier curve between y = ${this.start.y} and y = ${this.end.y}.`);
            // This is not true for Bezier curves in general, but for our use case it is.
        }
        if (y == this.start.y) {
            return this.start.x;
        }
        if (y == this.end.y) {
            return this.end.x;
        }
        for (let step = 0.1; step >= 0.0001; step /= 10) {
            let t = 0;
            // let step = 0.001;
            let last_y = this.y(0);
            // find an upper and lower bound for t such that y(t_lower) <= y <= y(t_upper)
            // then, linearly interpolate to find the "exact" t
            while (t < 1) {
                let current_y = this.y(t);
                if (current_y >= y) {
                    let t_lower = t - step;
                    let t_upper = t;
                    let y_lower = this.y(t_lower);
                    let y_upper = current_y;

                    // Linear interpolation to find the exact t
                    if (y_upper === y_lower) {
                        return this.x(t_lower); // Avoid division by zero
                    }
                    let t_exact = t_lower + (y - y_lower) / (y_upper - y_lower) * step;
                    return this.x(t_exact);
                }
                last_y = current_y;
                t += step;
            }
        }
        // If we reach here, we didn't find a suitable t
        console.error({y, curve: this})
        throw new Error(`No x found for given y in Bezier curve.`);
    }

    get length() {
        if (this._length !== undefined) {
            return this._length;
        }
        let length = 0;
        let n_points = 500;
        for (let i = 0; i < n_points; i++) {
            let t1 = i / n_points;
            let t2 = (i + 1) / n_points;
            let p1 = this.point(t1);
            let p2 = this.point(t2);
            length += p1.distance(p2);
        }
        this._length = length;
        return length;
    }

    get inverse() {
        return new BezierCubic(this.end, this.c2, this.c1, this.start);
    }

    translate(vector) {
        return new BezierCubic(
            this.start.add(vector),
            this.c1.add(vector),
            this.c2.add(vector),
            this.end.add(vector)
        );
    }

    scale(scalar) {
        return new BezierCubic(
            this.start.multiply(scalar),
            this.c1.multiply(scalar),
            this.c2.multiply(scalar),
            this.end.multiply(scalar)
        );
    }

    scaleX(factor) {
        return new BezierCubic(
            this.start.scaleX(factor),
            this.c1.scaleX(factor),
            this.c2.scaleX(factor),
            this.end.scaleX(factor)
        );
    }

    scaleY(factor) {
        return new BezierCubic(
            this.start.scaleY(factor),
            this.c1.scaleY(factor),
            this.c2.scaleY(factor),
            this.end.scaleY(factor)
        );
    }

    scaleXY(factorX, factorY) {
        return new BezierCubic(
            this.start.scaleXY(factorX, factorY),
            this.c1.scaleXY(factorX, factorY),
            this.c2.scaleXY(factorX, factorY),
            this.end.scaleXY(factorX, factorY)
        );
    }

    to_changes() {
        if (this.start.y > this.end.y) {
            return this.inverse.to_changes();
        }

        let start_y = Math.round(this.start.y);
        let changes = [];
        let last_x = Math.round(this.start.x);
        for (let r = start_y + 1; r <= Math.round(this.end.y); r++) {
            let x = Math.round(this.x_at_y(r > this.end.y ? this.end.y : r));
            if (x !== last_x) {
                changes.push({r: r - start_y, diff: x - last_x});
                last_x = x;
            }
        }
        if (last_x !== Math.round(this.end.x)) {
            changes.push({r: Math.round(this.end.y) - start_y, diff: Math.round(this.end.x) - last_x});
        }
        return changes;
    }
}


export {
    Coordinate,
    X,
    Y,
    Line,
    BezierCubic
};