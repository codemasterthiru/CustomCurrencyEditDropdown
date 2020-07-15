const objectCompare = (newObj, oldObj) => {
  return JSON.stringify(newObj) === JSON.stringify(oldObj);
};

const isNonEmptyValue = value => {
  return value !== undefined && value !== null && value !== ""; //&& !isNaN(value);
};

const isArray = props => {
  const givenType = typeof props;
  const isArrayBooleanVal = props instanceof Array;
  return givenType && isArrayBooleanVal;
};

const isEmptyArray = props => {
  const isArr = isArray(props);
  return props && props.length === 0 && isArr;
};

const isNonEmptyArray = props => {
  const isArr = isArray(props);
  return props && props.length && isArr;
};

const hasOwnProperty = (props, key) => {
  return (
    props !== undefined &&
    props !== null &&
    props instanceof Object &&
    props.hasOwnProperty(key)
  );
};
const deepCopy = obj => {
  return JSON.parse(JSON.stringify(obj));
};

export {
  objectCompare,
  isNonEmptyValue,
  isArray,
  isEmptyArray,
  isNonEmptyArray,
  hasOwnProperty,
  deepCopy
};
