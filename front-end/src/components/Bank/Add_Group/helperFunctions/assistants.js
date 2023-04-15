import { liner as linerCode, range as rangeCode } from "../../../data/rules";
const convert = (linerList, rangeList) => {
  var liner = [];
  var range = [];
  linerList.forEach((e) => {
    liner.push({
      label: linerCode(e),
      quantity: e.quantity,
      price: e.price,
      designCode: e.design_no,
    });
  });
  rangeList.forEach((e) => {
    range.push({
      label: rangeCode(e),
      quantity: e.quantity,
      price: e.price,
      designCode: e.design_no,
    });
  });
  return liner.concat(range);
};

const calculateAmount = (liner) => {
  let amount = 0;
  liner.forEach((item) => {
    amount = amount + item.price * item.quantity;
  });
  return amount;
};

export{
    convert,
    calculateAmount
}