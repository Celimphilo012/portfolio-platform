export const validate = (schema) => (req, res, next) => {
  const { error } = schema.validate(req.body, { abortEarly: false });
  if (error) {
    const messages = error.details.map((d) => d.message);
    return res.status(400).json({ errors: messages });
  }
  next();
};

export const validateExperience = (req, res, next) => {
  const { title, company, start_date } = req.body;
  const errors = [];

  if (!title || title.trim().length < 2) errors.push('Title is required (min 2 characters)');
  if (!company || company.trim().length < 2) errors.push('Company is required');
  if (!start_date) errors.push('Start date is required');
  else if (isNaN(Date.parse(start_date))) errors.push('Start date must be a valid date');
  if (req.body.end_date && isNaN(Date.parse(req.body.end_date)))
    errors.push('End date must be a valid date');
  if (
    req.body.end_date &&
    req.body.start_date &&
    new Date(req.body.end_date) < new Date(req.body.start_date)
  )
    errors.push('End date cannot be before start date');

  if (errors.length > 0) return res.status(400).json({ success: false, errors });

  next();
};
