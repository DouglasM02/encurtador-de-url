import { config } from "../config/Constants";
import { Request, response, Response } from "express";
import shortid from 'shortid'
import { URLModel } from "../database/model/URL";
export class URLController {
    public async shorten(req:Request, res:Response): Promise<void> {
        //Ver se a url já não existe
        //Criar o Hash para esse url
        const { originURL } = req.body
        const url = await URLModel.findOne({originURL})
        if(url) {
            res.json(url)
            return
        }

        const hash = shortid.generate()
        const shortURL = `${config.API_URL}/${hash}`
        const newURL = await URLModel.create({hash, shortURL, originURL})
        res.json(newURL)
        //Salvar a url no Banco
        //Retornar a url que a gente salvou
    }

    public async redirect(req:Request, res:Response): Promise<void> {
        //pegar o hash da url
        //econtrar a url original pelo hash pego
        //redirecionar para a url original a partir do que foi encontrado no banco de dados
        const {hash} = req.params
        const url = await URLModel.findOne({hash})

        if (url) {
            res.redirect(url.originURL)
            return
        }

        res.status(400).json({error: "URL not found"})

    }
}
