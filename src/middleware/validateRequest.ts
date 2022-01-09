import { NextFunction, Response } from "express";
import { Request } from "express";
import { AnySchema } from "yup";
import log from "../logger";

const validate =
  (schema: AnySchema) =>
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      await schema.validate({
        body: req.body,
        query: req.query,
        params: req.params,
      });

      return next();
    } catch (e: any | undefined) {
      log.error(e);
      return res.send(400).send(e.errors);
    }
  };
export default validate;
