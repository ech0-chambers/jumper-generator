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

  let stitches =
    Math.round((measurements.st_per_inch * measurements.W) / 2) * 2; // Ensure an even number of stitches
  let ribbing_rows = Math.round(
    measurements.row_per_inch_rib * measurements.H_rib
  );

  let B_arm = new BezierCubic(
    X(0),
    X(-(measurements.W - measurements.W_s) / 4),
    new Coordinate(
      -(measurements.W - measurements.W_s) / 2,
      measurements.H_cap / 4
    ),
    new Coordinate(
      -(measurements.W - measurements.W_s) / 2,
      measurements.H_cap / 2
    )
  );
  let H_arm = measurements.A_c / 2 - B_arm.length;
  let B_neck = new BezierCubic(
    X(0),
    Y(-measurements.H_nb),
    new Coordinate(-measurements.W_n / 4, -measurements.H_nb),
    new Coordinate(-measurements.W_n / 2, -measurements.H_nb)
  );
  let armhole_start = Math.round(
    measurements.row_per_inch *
      (measurements.H - measurements.H_rib - H_arm - measurements.H_cap / 2)
  );
  let neckline_start = Math.round(
    measurements.row_per_inch *
      (measurements.H - measurements.H_rib - measurements.H_nb)
  );
  let arm_first = armhole_start < neckline_start;
  let straight_rows = Math.min(armhole_start, neckline_start);
  let armhole_changes = B_arm.scaleXY(
    measurements.st_per_inch,
    measurements.row_per_inch
  ).to_changes();
  let neckline_changes = B_neck.scaleXY(
    measurements.st_per_inch,
    measurements.row_per_inch
  ).to_changes();
  let armhole_end =
    armhole_start + armhole_changes[armhole_changes.length - 1].r;
  let neckline_end =
    neckline_start + neckline_changes[neckline_changes.length - 1].r;
  // add the start row to the changes
  armhole_changes = armhole_changes.map((change) => ({
    r: change.r + armhole_start,
    diff: change.diff,
  }));
  neckline_changes = neckline_changes.map((change) => ({
    r: change.r + neckline_start,
    diff: change.diff,
  }));
  let overlap = armhole_end > neckline_start;
  let initial_changes = [];
  let combined_changes = [];
  if (overlap) {
    if (arm_first) {
      // two lists; initial - armhole only (row < neckline_start), combined - armhole and neckline (row >= neckline_start), {r: row, armhole_diff: diff, neckline_diff: diff}
      initial_changes = armhole_changes.filter(
        (change) => change.r < neckline_start
      );
      combined_changes = armhole_changes
        .filter((change) => change.r >= neckline_start)
        .map((change) => ({
          r: change.r,
          armhole_diff: change.diff,
          neckline_diff: 0,
        }));
      neckline_changes.forEach((change) => {
        let existing = combined_changes.find((c) => c.r === change.r);
        if (existing) {
          existing.neckline_diff += change.diff;
        } else {
          combined_changes.push({
            r: change.r,
            armhole_diff: 0,
            neckline_diff: change.diff,
          });
        }
      });
      // sort combined_changes by row
      combined_changes.sort((a, b) => a.r - b.r);
    } else {
      // two lists; initial - neckline only (row < armhole_start), combined - armhole and neckline (row >= armhole_start), {r: row, armhole_diff: diff, neckline_diff: diff}
      initial_changes = neckline_changes.filter(
        (change) => change.r < armhole_start
      );
      combined_changes = neckline_changes
        .filter((change) => change.r >= armhole_start)
        .map((change) => ({
          r: change.r,
          armhole_diff: 0,
          neckline_diff: change.diff,
        }));
      armhole_changes.forEach((change) => {
        let existing = combined_changes.find((c) => c.r === change.r);
        if (existing) {
          existing.armhole_diff += change.diff;
        } else {
          combined_changes.push({
            r: change.r,
            armhole_diff: change.diff,
            neckline_diff: 0,
          });
        }
      });
      // sort combined_changes by row
      combined_changes.sort((a, b) => a.r - b.r);
    }
  }
</script>

<h2 class:mobile={appState.mobile}>Back</h2>

<div>
  <h3  class:mobile={appState.mobile}>Body</h3>
  <ol>
    <li>
      Cast on {stitches} stitches ({stitches / 2} left to {stitches / 2} right) for
      1&#xD7;1 ribbing.
    </li>
    <li>Knit {ribbing_rows} rows at ribbing tension.</li>
    <li>Transfer all stitches to the main bed. Change to main tension.</li>
    <li>Reset the row counter.</li>
    <li>Knit to row count {straight_rows}.</li>
    <li>Begin {arm_first ? "armhole" : "neckline"} shaping.</li>
  </ol>

  {#if !overlap}
    <h3  class:mobile={appState.mobile}>Armhole Shaping</h3>
    <Table headers={["Row Counter", "Both Edges"]}>
      {#each armhole_changes as change}
        <tr>
          <td>{change.r}</td>
          <td>{diff_to_instruction(change.diff)}</td>
        </tr>
      {/each}
    </Table>
    <ol>
      <li>Knit to row count {neckline_start}</li>
    </ol>
    <h3  class:mobile={appState.mobile}>Neckline Shaping</h3>
    <ol>
      <li>
        Bring half the stitches into hold, or take them off on waste yarn.
      </li>
    </ol>
    <Table headers={["Row Counter", "Neckline Edge"]}>
      {#each neckline_changes as change}
        <tr>
          <td>{change.r}</td>
          <td>{diff_to_instruction(-change.diff)}</td>
        </tr>
      {/each}
    </Table>
    <ol start="2">
      <li>Bind off the remaining shoulder stitches.</li>
      <li>
        Bring the held needles back into work (or re-hang from the waste yarn).
      </li>
      <li>Reset row counter to {neckline_start}.</li>
      <li>Repeat neckline shaping on the other side.</li>
      <li>Bind off the remaining stitches.</li>
    </ol>
  {:else if arm_first}
    <h3  class:mobile={appState.mobile}>Armhole Shaping</h3>
    <Table headers={["Row Counter", "Both Edges"]}>
      {#each initial_changes as change}
        <tr>
          <td>{change.r}</td>
          <td>{diff_to_instruction(change.diff)}</td>
        </tr>
      {/each}
    </Table>

    <h3  class:mobile={appState.mobile}>Neckline Shaping</h3>

    <ol>
      <li>
        Bring half the stitches into hold, or take them off on waste yarn.
      </li>
    </ol>
    <Table headers={["Row Counter", "Neckline Edge", "Armhole Edge"]}>
      {#each combined_changes as change}
        <tr>
          <td>{change.r}</td>
          <td>{diff_to_instruction(-change.neckline_diff)}</td>
          <td>{diff_to_instruction(change.armhole_diff)}</td>
        </tr>
      {/each}
    </Table>
    <ol start="2">
      <li>Bind off the remaining shoulder stitches.</li>
      <li>
        Bring the held needles back into work (or re-hang from the waste yarn).
      </li>
      <li>Reset row counter to {neckline_start}.</li>
      <li>Repeat armhole and neckline shaping on the other side.</li>
      <li>Bind off the remaining stitches.</li>
    </ol>
  {:else}
    <h3  class:mobile={appState.mobile}>Neckline Shaping</h3>
    <ol>
      <li>
        Bring half the stitches into hold, or take them off on waste yarn.
      </li>
    </ol>
    <Table headers={["Row Counter", "Neckline Edge"]}>
      {#each initial_changes as change}
        <tr>
          <td>{change.r}</td>
          <td>{diff_to_instruction(-change.diff)}</td>
        </tr>
      {/each}
    </Table>
    <h3  class:mobile={appState.mobile}>Armhole Shaping</h3>
    <Table headers={["Row Counter", "Neckline Edge", "Armhole Edge"]}>
      {#each combined_changes as change}
        <tr>
          <td>{change.r}</td>
          <td>{diff_to_instruction(change.neckline_diff)}</td>
          <td>{diff_to_instruction(change.armhole_diff)}</td>
        </tr>
      {/each}
    </Table>
    <ol start="2">
      <li>Bind off the remaining shoulder stitches.</li>
      <li>
        Bring the held needles back into work (or re-hang from the waste yarn).
      </li>
      <li>Reset row counter to {neckline_start}.</li>
      <li>Repeat armhole and neckline shaping on the other side.</li>
      <li>Bind off the remaining stitches.</li>
    </ol>
  {/if}
</div>
