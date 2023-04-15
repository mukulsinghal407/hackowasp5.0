const checkMissing = (list) => {
  if (list.length > 0) {
    var missing_value = 0;
    const keys = Object.keys(list[0]);
    const index = keys.indexOf("barrier");
    if (index > -1) keys.splice(index, 1);
    list.forEach((element) => {
      let missing = keys.length;

      keys.forEach((key) => {
        if (element[key].length === 0) missing -= 1;
      });

      if (missing !== keys.length) missing_value += 1;
    });
    return missing_value === 0;
  } else {
    return true;
  }
};

const checkNumber = (input)=>{
  const reg = new RegExp('^[0-9]+$');
  return reg.test(input);
};

const checkOrderID = (orderID)=>{
  return (orderID && (orderID.length < 6 || orderID <= 0 || !checkNumber(orderID)));
};

const checkPrice = (price)=>{
  return (price && ( price < 100 || !checkNumber(price)));
}

const checkQuantity = (quantity)=>{
  return (quantity && (quantity < 1 || !checkNumber(quantity)))
};

const checkVehicleNumber = (number)=>{
  let pattern1=new RegExp('^[A-Z]{2}[0-9]{2}[A-HJ-NP-Z]{1,2}[0-9]{4}$');
  return (number && !pattern1.test(number));
};

export {
    checkOrderID,
    checkPrice,
    checkQuantity,
    checkMissing,
    checkVehicleNumber
}