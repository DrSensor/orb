import "@orb-runtime/core";

const [$1] = 1;
console.log("$1");
console.log($1.initial, ++$1.value);
const [$2] = $1;
console.log("$2");
console.log($1.initial, ++$1.value);
console.log($2.initial, ++$2.value);
const [$3] = $2;
console.log("$3");
console.log($1.initial, ++$1.value);
console.log($2.initial, ++$2.value);
console.log($3.initial, ++$3.value);
const [$4] = $3;
console.log("$4");
console.log($4.initial, ++$4.value);
console.log($3.initial, ++$3.value);
console.log($2.initial, ++$2.value);
console.log($1.initial, ++$1.value);
