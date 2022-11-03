import { Request, Response } from "express";
import Doc from "../models/doc.model";
import { ICreate } from "../interfaces/doc.interface";
import { pdfOptions } from "../config/doc";
import ejs from "ejs";
import pdf from "html-pdf";

export const routeWelcome = (_req: Request, _res: Response) => {
  _res.status(200).json({
    status: 200,
    message: "Welcome to the v1 Restfull API",
  });
};

export const createDoc = (_req: Request, _res: Response) => {
  const body: ICreate = _req.body;
  if (body) {
    ejs.renderFile(
      `templates/template_${body.type}.ejs`,
      { data: body.data },
      (err, data) => {
        if (err) {
          return _res.status(501).json({
            status: 501,
            error: err,
          });
        } else {
          let now = Date.now();
          pdf
            .create(data, pdfOptions)
            .toFile(`public/${body.type}_${now}.pdf`, async (err, result) => {
              if (err) {
                return _res.status(501).json({
                  status: 501,
                  error: err,
                });
              } else {
                try {
                  const newDoc = await new Doc({
                    createdBy: body.createdBy,
                    title: body.title,
                    path: `public/${body.type}_${now}.pdf`,
                    type: body.type,
                    name: `${body.type}_${now}.pdf`,
                  });
                  await newDoc.save();
                } catch (err) {
                  return _res.status(501).json({
                    status: 501,
                    error: err,
                  });
                }

                _res.status(201).json({
                  status: 201,
                  message: "Operation successfully performed",
                  doc: result,
                });
              }
            });
        }
      }
    );
  } else {
    return _res.status(501).json({
      status: 501,
      error: "No doc informations are provided",
    });
  }
};
