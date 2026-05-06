import { Request, Response } from "express";
import {  error, success } from "../utils/response";
import imageKitUtil from "../utils/uploader";

 export default {
    async single(req: Request, res: Response) {

        if (!req.file) {
            return error(res, "No file uploaded", "No file uploaded");
        }
        try {
            const result = await imageKitUtil.uploadSingle(req.file as Express.Multer.File, "media");
            success(res, result, "File uploaded successfully");
        } catch (err) {
            error(res, err, "File upload failed");
        }
    },

    async multiple(req: Request, res: Response) {
        if (!req.files || (req.files as Express.Multer.File[]).length === 0) {
            return error(res, "No files uploaded", "No files uploaded");
        }
        try {
            const results = await imageKitUtil.uploadMultiple(req.files as Express.Multer.File[], "media");
            success(res, results, "Files uploaded successfully");
        } catch (err) {
            error(res, err, "File upload failed");
        }
    },

    async remove(req: Request, res: Response) {
        const { fileId } = req.body;
        if (!fileId) {
            return error(res, "fileId ID is required", "fileId removal failed");
        }
        try {
            const result = await imageKitUtil.removeFile(fileId);
            success(res, result, "File removed successfully");
        } catch (err) {
            error(res, err, "File removal failed");
        }
    }
}