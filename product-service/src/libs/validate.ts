export interface Validatable {
  type: string;
  name: string;
  value: string | number | undefined;
  minLength?: number;
  maxLength?: number;
  minValue?: number;
  maxValue?: number;
  notNegative?: boolean;
  isRequired?: boolean;
}

export const validate = (propsData: Validatable[]) => {
  const errors = [];
  propsData.forEach((prop) => {
    const {
      isRequired,
      type,
      name,
      value,
      minLength,
      maxLength,
      notNegative,
      minValue,
      maxValue,
    } = prop;
    if (isRequired && value === undefined) {
      errors.push(`${name} must be provided`);
    }
    if (value !== undefined) {
      if (type === 'string') {
        if (typeof value !== 'string') {
          errors.push(`${name} must be a string.`);
        } else if (value.trim().length === 0) {
          errors.push(`${name} length can not be zero.`);
        } else if (minLength && value.trim().length < minLength) {
          errors.push(`${name} is too short.`);
        } else if (maxLength && value.length > maxLength) {
          errors.push(`${name} is too long.`);
        }
      }
      if (type === 'number') {
        if (typeof +value !== 'number') {
          errors.push(`${name} must be a number.`);
        } else if (isNaN(+value)) {
          errors.push(`${name} must be a valid number.`);
        } else if (notNegative && +value < 0) {
          errors.push(`${name} can not be negative.`);
        } else if (minValue && +value < minValue) {
          errors.push(`${name} must not be less than ${minValue}.`);
        } else if (maxValue && +value > maxValue) {
          errors.push(`${name} must not be greater than ${maxValue}.`);
        }
      }
      if (type === 'url') {
        if (typeof value !== 'string') {
          errors.push(`${name} must be a string.`);
        } else if (
          value.trim() !== '' &&
          !value.trim().startsWith('http://') &&
          !value.trim().startsWith('https://')
        ) {
          errors.push(`${name} has wrong url format.`);
        }
      }
    }
  });
  return errors;
};
