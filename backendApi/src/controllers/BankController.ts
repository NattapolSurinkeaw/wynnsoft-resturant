import { sequelize } from './../util/database'
import { BankProvider } from './../models/bankProvider'
import { BankAccount } from './../models/bankAccount'
import { BankType } from '../models/bankType'
import { BankService } from '../services/Bank.service'
import { validationResult } from 'express-validator'
import fs from 'fs'
const sharp = require('sharp')
import path from 'path'

export class BankController extends BankService {
    OnGetBankAccount = async(req: any, res: any) => {
        const finding = await BankAccount.findAll()
        return res.status(200).json({
            status: true,
            message: 'ok',
            description: 'get data success.',
            data: finding
        })
    }
    OnCreateBankAccount = async(req: any, res: any) => {
        const errors = validationResult(req)
        if(!errors.isEmpty()){
            return res.status(400).json({
                status: false,
                message: 'error',
                errorMessage: errors.array()
            })
        }
        const finding_bank = await BankAccount.findOne({where:{bank_number: req.body.bank_number, bank_type_id: req.body.bank_type_id}})
        if(finding_bank){
            return res.status(404).json({
                status: false,
                message: 'error',
                description: 'bank number has duplicated..'
            })
        }
        const t = await sequelize.transaction()
        try {
            const bank_account = await BankAccount.create({
                name: req.body.name,
                bank_number: req.body.bank_number,
                branch: req.body.branch,
                bank_provider_id: req.body.bank_provider_id,
                bank_type_id: req.body.bank_type_id,
                status: 'active'
            }, { transaction: t })
            await t.commit()
            return res.status(201).json({
                status: true,
                message: 'ok',
                description: 'data was created.'
            })
        } catch {
            await t.rollback()
            return res.status(500).json({
                status: false,
                message: 'error',
                dscription: 'something went wrong.'
            })
        }
    }
    OnChangeStatusBank = async(req: any, res: any) => {
        const errors = validationResult(req)
        if(!errors.isEmpty()){
            return res.status(400).json({
                status: false,
                message: 'error',
                errorMessage: errors.array()
            })
        }
        const finding = await BankAccount.update(
            {
                status: req.body.status
            },{
                where: { id: req.body.bank_id }
            }
        )
        return res.status(200).json({
            status: true,
            message: 'ok',
            description: 'update bank success.'
        })
    }
    OnUpdateBankAccount = async(req: any, res: any) => {
        const errors = validationResult(req)
        if(!errors.isEmpty()){
            return res.status(400).json({
                status: false,
                message: 'error',
                errorMessage: errors.array()
            })
        }
        const finding = await BankAccount.findOne({where:{id: req.body.bank_id}})
        if(!finding){
            return res.status(404).json({
                status: false,
                message: 'error',
                description: 'data is not found.'
            })
        }
        try {
            finding.name = req.body.name
            finding.bank_number = req.body.bank_number
            finding.branch = req.body.branch
            finding.bank_provider_id = req.body.bank_provider_id
            finding.bank_type_id = req.body.bank_type_id
            finding.save()
            return res.status(201).json({
                status: true,
                message: 'ok',
                description: 'data was updated..'
            })
        } catch {
            return res.status(500).json({
                status: false,
                message: 'error',
                dscription: 'something went wrong.'
            })
        }
    }
    OnGetBankProvider = async(req: any, res: any) => {
        const finding = await BankProvider.findAll()
        const bank_type = await BankType.findAll({
            where: {
                display: true
            }
        })
        return res.status(200).json({
            status: true,
            message: 'ok',
            description: 'get data success.',
            data: finding,
            bank_type: bank_type
        })
    }
    OnGetBankAll = async(req: any, res: any) => {
        const bank_type_id = req.query.bank_type;
        const finding = await this.queryBankAccountAll(bank_type_id)

        return res.status(200).json({
            status: true,
            message: 'ok',
            description: 'get data success.',
            data: finding,
        })
    }

    OnDeleteBank = async(req: any, res: any) => {
        const errors = validationResult(req)
        if(!errors.isEmpty()){
            return res.status(400).json({
                status: false,
                message: 'error',
                errorMessage: errors.array()
            })
        }
        try {
            const finding = await BankAccount.destroy({where:{id: req.params.id}})
            return res.status(200).json({
                sttaus: true,
                message: 'ok',
                description: 'Bank has been deleted.'
            })
        } catch(error){
            console.log(error)
            return res.status(500).json({
                status: false,
                message: 'error',
                description: 'something went wrong.'
            })
        }
    }
}