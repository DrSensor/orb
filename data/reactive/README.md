<table>
<tr>
<td><th>Evaluation Model</th></td>
<td>

- Push-based by default (including *cascading*)
- **read-only** Pull-based when derived (except *cascading*)

</td></tr><tr>
<td><th>Lifting operation</th></td>
<td>

- Explicit on read operation (e.g `data + 0` or `+data` or `` `${data}` ``)
  - it can be Manual too (e.g `data.let` or `get(data)`)
- Manual on write operation (e.g `data.set(1)`)
- Semi-explicit on read/write operation (e.g `++data.let, data.let += 1`)
<!-- JS builtin properties (i.e `[Symbol.toPrimitive]()`, `.set()`, `.let=`) -->

</td></tr><tr>
<td><th>Multidirectionality</th></td>
<td>

- one direction (unidirectional) by default, including on *cascaded* variable
- either direction (multidirectional) via `link(..)` utils

</td></tr>
</table>
