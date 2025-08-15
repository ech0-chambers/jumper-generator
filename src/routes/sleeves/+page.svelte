<script>
  import { BezierCubic, Coordinate, X, Y, Line } from "$lib/geometry";
  import { appState, measurements } from "$lib/jumper.svelte.js";
  import Table from "$lib/components/Table.svelte";

  function diff_to_instruction(diff) {
    if (diff == 0) {
      return "";
    }
    if (diff > 0) {
      return `Increase ${diff}`;
    }
    if (diff < -2) {
      return `Bind off ${-diff}`;
    }
    return `Decrease ${-diff}`;
  }

  let B_arm = new BezierCubic(
    new Coordinate(0, 0),
    new Coordinate(-measurements.W_sl / 4, 0),
    new Coordinate(-measurements.W_sl / 4, measurements.H_cap),
    new Coordinate(-measurements.W_sl / 2, measurements.H_cap)
  );

  let stitches = Math.round(measurements.W_w * measurements.st_per_inch);
  let ribbing_rows = Math.round(
    measurements.H_rib * measurements.row_per_inch_rib
  );
  let sleeve_main = new Line(
    X(measurements.W_w / 2),
    new Coordinate(
      measurements.W_sl / 2,
      measurements.H_sl - measurements.H_rib - measurements.H_cap
    )
  ).scaleXY(measurements.st_per_inch, measurements.row_per_inch);
  let increases = sleeve_main.to_changes();

  B_arm = B_arm.scaleXY(measurements.st_per_inch, measurements.row_per_inch);
  let sleeve_cap_instructions = B_arm.to_changes();
  let increase_rows = Math.round((measurements.H_sl - measurements.H_rib - measurements.H_cap) * measurements.row_per_inch);
</script>

<h2 class:mobile={appState.mobile}>Sleeves</h2>

<div>
  <ol>
    <li>
      Cast on {stitches} stitches ({stitches / 2} left to {stitches / 2} right) for
      1&#xD7;1 ribbing. You will need a total of {Math.round(
        measurements.W_sl * measurements.st_per_inch
      )} needles.
    </li>
    <li>Knit {ribbing_rows} rows at ribbing tension.</li>
    <li>Transfer all stitches to the main bed. Change to main tension.</li>
    <li>Reset the row counter.</li>
  </ol>
  <Table headers={["Row Counter", "Both Edges"]}>
    {#each increases as instruction}
      <tr>
        <td>{instruction.r}</td>
        <td>{diff_to_instruction(instruction.diff)}</td>
      </tr>
    {/each}
  </Table>
  {#if increase_rows != increases[increases.length - 1].r}
  <ol>
    <li>Knit to row count {increase_rows}</li>
  </ol>
  {/if}
    <Table headers={["Row Counter", "Both Edges"]}>
        {#each sleeve_cap_instructions as instruction}
        <tr>
            <td>{instruction.r + increase_rows}</td>
            <td>{diff_to_instruction(instruction.diff)}</td>
        </tr>
        {/each}
    </Table>
  <ol>
    <li>Bind off any remaining stitches.</li>
    <li>Knit a second sleeve.</li>
  </ol>
</div>
