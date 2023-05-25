import {NextApiRequest, NextApiResponse} from "next";
import axios from "axios";
import fs from 'fs'
// @ts-ignore
import formidable from 'formidable'
import {Form} from "antd";
import FormData from "form-data";

export const config = {
    api: {
        bodyParser: false,
    },
};

export default async function handler(req: NextApiRequest, res: NextApiResponse){
    const server_url = process.env.NEXT_PUBLIC_BASE_URL;

    if(req.method != "POST"){
        return res.status(405).send(`Method ${req.method} not allowed`);
    }

    try {
        const form = new formidable.IncomingForm();

        // @ts-ignore
        form.parse(req, async (err, fields, files) => {
            if (err) {
                console.error(err);
                return res.status(500).json({message: 'Failed to parse form data'});
            }

            // Access the fields and files from the parsed form data
            const {username, file_name, file_type} = fields;
            const {file} = files;

            const formData = new FormData()

            formData.append("username", username)
            formData.append("file_name", file_name)
            formData.append("file_type", file_type)
            formData.append("file", fs.createReadStream(file.filepath))

            try {
                const response = await axios.post(`${server_url}/api/data/upload/`, formData, {
                    headers: {
                        "Content-Type": "multipart/form-data"
                    }
                })
                return res.status(201).json({result: 'File uploaded successfully'});
            } catch (error: unknown) {
                return res.status(500).json({result:"Fail to upload file to server"})
            }
        });
    } catch (error) {
        return res.status(500).json({ result: 'Failed to upload file' });
    }
}
