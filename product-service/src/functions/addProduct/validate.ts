import { validate } from '@libs/validate';

export const validateProduct = (body) => {
  const { title, description, price, count, image } = body;

  const validatableData = [
    {
      value: title,
      type: 'string',
      name: 'Title',
      maxLength: 32,
      isRequired: true,
    },
    {
      value: description,
      type: 'string',
      name: 'Description',
      maxLength: 64,
      isRequired: true,
    },
    {
      value: price,
      type: 'number',
      name: 'Price',
      notNegative: true,
      maxValue: 9999,
      isRequired: true,
    },
    {
      value: count,
      type: 'number',
      name: 'Count',
      notNegative: true,
      maxLength: 9999,
      isRequired: true,
    },
    {
      value: image,
      type: 'url',
      name: 'Image',
    },
  ];

  return validate(validatableData);
};
