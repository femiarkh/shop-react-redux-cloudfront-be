export const validate = (body) => {
  const errorMessages = [];
  const { title, description, price, count, image } = body;

  if (title === undefined) {
    errorMessages.push('Title must be provided.');
  } else if (typeof title !== 'string') {
    errorMessages.push('Title must be a string.');
  } else if (title.trim().length === 0) {
    errorMessages.push('Title length can not be zero.');
  } else if (title.length > 32) {
    errorMessages.push('Title is too long.');
  }

  if (description === undefined) {
    errorMessages.push('Description must be provided.');
  } else if (typeof description !== 'string') {
    errorMessages.push('Description must be a string.');
  } else if (title.trim().length === 0) {
    errorMessages.push('Description length can not be zero.');
  } else if (title.length > 64) {
    errorMessages.push('Description is too long.');
  }

  if (price === undefined) {
    errorMessages.push('Price must be provided.');
  } else if (typeof +price !== 'number') {
    errorMessages.push('Price must be a number.');
  } else if (isNaN(+price)) {
    errorMessages.push('Price must be a valid number.');
  } else if (+price < 0) {
    errorMessages.push('Price can not be negative.');
  } else if (+price > 9999) {
    errorMessages.push('Price is too big.');
  }

  if (count === undefined) {
    errorMessages.push('Count must be provided.');
  } else if (typeof +count !== 'number') {
    errorMessages.push('Count must be a number.');
  } else if (isNaN(+count)) {
    errorMessages.push('Count must be a valid number.');
  } else if (+count < 0) {
    errorMessages.push('Count can not be negative.');
  } else if (+count > 9999) {
    errorMessages.push('Count is too big.');
  }

  if (image !== undefined) {
    if (typeof image !== 'string') {
      errorMessages.push('Image url must be a string.');
    } else if (!image.startsWith('http://') && !image.startsWith('https://')) {
      errorMessages.push('Wrong url format.');
    }
  }

  return errorMessages;
};
