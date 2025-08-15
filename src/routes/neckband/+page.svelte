<script>
  import { Line, BezierCubic, Coordinate, X, Y } from "$lib/geometry";
  import { appState, measurements } from "$lib/jumper.svelte.js";

  let B_neck = new BezierCubic(
    X(0),
    Y(-measurements.H_nb),
    new Coordinate(-measurements.W_n / 4, -measurements.H_nb),
    new Coordinate(-measurements.W_n / 2, -measurements.H_nb)
  );

  let C_neck;
  if (measurements.neckline == "v-neck") {
    C_neck = new Line(
      Coordinate.origin(),
      new Coordinate(measurements.W_n / 2, measurements.H_n)
    );
  } else if (measurements.neckline == "round") {
    C_neck = new BezierCubic(
      X(0),
      Y(-measurements.H_n),
      new Coordinate(-measurements.W_n / 4, -measurements.H_n),
      new Coordinate(-measurements.W_n / 2, -measurements.H_n)
    );
  } else {
    throw new Error("Unsupported neckline type: " + measurements.neckline);
  }
</script>

<h2 class:mobile={appState.mobile}>Neckband</h2>

<!-- TODO: 
    - neckline too wide for bed.
    - v-neck
    - overlap v-neck
-->

{#if measurements.neckline == "round"}
  <div>
    <ol>
      <li>Seam the right shoulder.</li>
      <li>
        Re-hang the front neckline from needle {Math.round(
          C_neck.length * measurements.st_per_inch
        ) * 2} left to needle 1 left.
      </li>
      <li>
        Re-hang the back neckline from needle 1 right to needle {Math.round(
          B_neck.length * measurements.st_per_inch
        ) * 2} right.
      </li>
      <li>
        <i
          >The purl side should be facing you. If not, you've seamed the wrong
          shoulder. Just re-hang with the front panel on the right-hand needles
          and the back panel on the left-hand needles.</i
        >
      </li>
      {#if measurements.neckband == "rib"}
        <li>
          Raise the ribber bed, and transfer every other stitch from the main
          bed to the ribber bed.
        </li>
        <li>
          Knit in 1&#xD7;1 ribbing for {Math.round(
            measurements.neckband_width * measurements.row_per_inch_rib
          )} rows.
        </li>
        <li>Cast off.</li>
      {:else if measurements.neckband == "folded"}
        <li>
          Knit for {Math.round(
            measurements.neckband_width * measurements.row_per_inch * 2
          )} rows.
        </li>
        <li>
          Re-hang the first row of the neckband. Bring all needles out to hold
          position, but do not put the carriage into hold.
        </li>
        <li>
          Knit one loose row. You may need to hand manipulate the stitches
          instead of using the carriage.
        </li>
        <li>Cast off, preferably with a chain stitch/crochet cast off.</li>
      {/if}
      <li>Seam the other shoulder, including the neckband.</li>
      <li>Seam the sleeves to the body.</li>
      <li>Seam the side seems and sleeves.</li>
    </ol>
  </div>
{:else if measurements.neckline == "v-neck"}
  <div>
    <ol>
      <li>Seam the right shoulder.</li>
      <li>
        Re-hang the front neckline from the centre front to the right shoulder,
        from needle {Math.round(C_neck.length * measurements.st_per_inch)} left to
        needle 1 left.
      </li>
      <li>
        Re-hang the back neckline from needle 1 right to needle {Math.round(
          B_neck.length * measurements.st_per_inch
        ) * 2} right.
      </li>
      <i
        >The purl side should be facing you. If not, you've seamed the wrong
        shoulder. Just re-hang with the front panel on the right-hand needles
        and the back panel on the left-hand needles.</i
      >
      {#if measurements.neckband == "rib"}
        <li>
          Raise the ribber bed, and transfer every other stitch from the main
          bed to the ribber bed.
        </li>
        <li>Knit in 1&#xD7;1 ribbing.</li>
        <li>
          Decrease 1 stitch on the left (centre front) every other row for {Math.round(
            measurements.neckband_width * measurements.row_per_inch_rib
          )} rows.
        </li>
        <li>Cast off.</li>
        <li>
          Re-hang the front neckline from the centre front to the left shoulder,
          from needle {Math.round(C_neck.length * measurements.st_per_inch)} right
          to needle 1 right.
        </li>
        <li>Knit in 1&#xD7;1 ribbing.</li>
        <li>
          Decrease 1 stitch on the right (centre front) every other row for {Math.round(
            measurements.neckband_width * measurements.row_per_inch_rib
          )} rows.
        </li>
        <li>Cast off.</li>
        <li>Seam the centre front of the neckband.</li>
      {:else if measurements.neckband == "folded"}
        <li>
          Knit for {Math.round(
            measurements.neckband_width * measurements.row_per_inch * 2
          )} rows.
        </li>
        <li>
          Re-hang the first row of the neckband. Bring all needles out to hold
          position, but do not put the carriage into hold.
        </li>
        <li>
          Knit one loose row. You may need to hand manipulate the stitches
          instead of using the carriage.
        </li>
        <li>Cast off, preferably with a chain stitch/crochet cast off.</li>
      {/if}
      <li>Seam the other shoulder, including the neckband.</li>
    </ol>
  </div>
{/if}
