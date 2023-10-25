/**
 *
 * @param {number} data
 */
// export function noise(input, routeId, index) {
//   // return input;
//   // return input;
  
//   const data = Number(input); 
//   const rounded = ~~data;
//   if (rounded % 2 === 0) {
//     var noiseValue = Number(`0.${100 % (index+1)}`) + 0.1;
//   } else {
//     var noiseValue = Number(`-0.${100 % (index+1)}`) - 0.1;
//   }
//   const percent = (data / 100) * noiseValue;

//   return Number((data + percent).toFixed(2))
// }


export function noise(input, routeId, index) {
  // return noise input;
  const data = Number(input); 
  const noise = Number((Math.random() - 0.5) * 0.1).toFixed(2);  // generate a random number between -0.05 and 0.05
  const percent = (data / 100) * noise; // calculation for percentage according to random number
  return Number((data + percent).toFixed(2)) // finally add noise value in the actual value
}



