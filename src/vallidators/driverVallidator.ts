import Joi from "joi";

export const driverSchema = Joi.object({
  name: Joi.string().required(),
  license: Joi.string().required(),
  contact: Joi.string().required(),
});
