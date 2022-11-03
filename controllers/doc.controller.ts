import { Request, Response } from "express";
import Doc from "../models/doc.model";
import { ICreate, IDoc } from "../interfaces/doc.interface";
import { pdfOptions } from "../config/doc";
import ejs from "ejs";
import pdf from "html-pdf";
import { Error } from "mongoose";
import * as fs from "fs";

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
                  const resultDoc = await newDoc.save();
                  _res.status(201).json({
                    status: 201,
                    message: "Operation successfully performed",
                    doc: resultDoc,
                  });
                } catch (err) {
                  return _res.status(501).json({
                    status: 501,
                    error: err,
                  });
                }
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

export const deleteDoc = (_req: Request, _res: Response) => {
  if (!_req.params.id)
    return _res.status(501).json({
      status: 501,
      error: "No doc id provided",
    });
  Doc.deleteOne({ _id: _req.params.id }, (err: Error, result: IDoc) => {
    if (err) {
      return _res.status(501).json({
        status: 501,
        error: "Some problems with your request",
      });
    } else {
      fs.rm(result.path as string, (err2) => {
        if (err2) {
          return _res.status(501).json({
            status: 501,
            error: "Some problems with your request",
          });
        } else {
          _res.status(201).json({
            status: 201,
            message: "Operation successfully performed",
          });
        }
      });
    }
  });
};

export const getDoc = async (_req: Request, _res: Response) => {
  if (!_req.params.id)
    return _res.status(501).json({
      status: 501,
      error: "No doc id provided",
    });
  const doc = await Doc.findOne({ _id: _req.params.id });
  if (doc) {
    _res.status(201).json({
      status: 201,
      message: "Operation successfully performed",
      doc,
    });
  } else {
    return _res.status(501).json({
      status: 501,
      error: "No doc found",
    });
  }
};

export const listDocs = async (_req: Request, _res: Response) => {
  const docs: IDoc[] = await Doc.find();
  if (docs.length) {
    _res.status(201).json({
      status: 201,
      message: "Operation successfully performed",
      docs,
    });
  } else {
    return _res.status(501).json({
      status: 501,
      error: "No docs found",
    });
  }
};
