import { TokenLog } from './../models/tokenLog';
import { Log } from './../models/log';
import * as Config from '../util/config'
import moment from 'moment'
import bcrypt from 'bcrypt'
import fs from 'fs'
const sharp = require('sharp')
import path from 'path'
import { validationResult } from 'express-validator'
import * as jwt from 'jsonwebtoken'
import { User } from '../models/users'

import nodemailer from 'nodemailer';
import { Settings } from '../models/settings';
import { UsersPermission } from '../models/usersPermission';
const hbs = require('nodemailer-express-handlebars')

export class UserController {
    OnRegister = async(req: any, res: any) => {
        const errors = validationResult(req)
        if(!errors.isEmpty()){
            return res.status(400).json({
                status: false,
                message: 'error',
                errorMessage: errors.array()
            })
        }
        /** finding user */
        const finding = await User.findOne({where:{username: req.body.username}})
        if(finding){
            return res.status(400).json({
                status: false,
                message: 'error',
                description: 'username has already used.'
            })
        }
        /* generate access_token for user */
        const access_token = jwt.sign({
            username: req.body.username,
            at: new Date().getTime()
        }, `${Config.secretKey}`, { expiresIn: '30d' })
        /* generate refresh_token when register and no expire */
        const refresh_token = jwt.sign({
            username: req.body.username,
            at: new Date().getTime(),
            token: access_token
        }, `${Config.secretKey}`)
        /** generate user_code */
        const users_str = req.body.username+Math.random().toString().substr(2, 8)+moment().unix()
        const users_code = await bcrypt.hash(users_str, 10)
        /** hash password */
        const hashPass = await bcrypt.hash(req.body.password, 10)
        try {
            let profile_img = ''
            /** upload image */
            if(req.file){
                let upload = "/uploads"+req.file.destination.split("uploads").pop()
                let dest = req.file.destination
                var ext = path.extname(req.file.originalname);
                let originalname = path.basename(req.file.originalname, ext)
                for(let i = 1; fs.existsSync(dest+originalname+ext); i++){
                    originalname = originalname.split('(')[0]
                    originalname += '('+i+')'
                }
                const image = await sharp(req.file.path)
                .resize(500, 500)
                .withMetadata()
                .jpeg({ quality: 95})
                .toFile( path.resolve(req.file.destination, originalname+ext))
                .then((data: any) => {
                    fs.unlink( req.file.path, (err) => {
                        if(err){
                            console.log(err)
                        }
                    })
                    return upload+originalname+ext
                })
                profile_img = image
            }
            /** create user */
            const users = await User.create({
                users_code: users_code.replace(/\W/g, ""),
                access_token: access_token,
                refresh_token: refresh_token,
                username: req.body.username,
                password: hashPass,
                email: req.body.email,
                profile_img: profile_img,
                permission: 3,
                status_confirm: 'pending',
                display_name: req.body.name,
                status: 'pending'
            })
            return res.status(201).json({
                status: true,
                message: 'ok',
                description: 'data was created.'
            })
        } catch(error){
            return res.status(500).json({
                status: false,
                message: 'error',
                description: 'something went wrong.'
            })
        }
    }
    OnGetAdminAll = async(req: any, res: any) => {
        const finding = await User.findAll()
        const permissionALl = await UsersPermission.findAll()
        const filtered = await finding.map((data: any) => {
            const permission = permissionALl?.find((e: any) => e.id == data.permission)
            return {
                adminId: data.id,
                adminCode: data.users_code,
                username: data.username,
                password: data.password,
                email: data.email,
                permission: data.permission,
                permissionName: permission.user_type_th,
                statusConfirm: data.status_confirm,
                displayName: data.display_name,
                profileImg: data.profile_img,
                status: data.status,
                createTime: data.createdAt
            }
        })
        return res.status(200).json({
            status: true,
            message: 'ok',
            description: 'get user success.',
            admin: filtered,
            permission: permissionALl
        })
    }
    OnSignin = async(req: any, res: any) => {
        const errors = validationResult(req)
        if(!errors.isEmpty()){
            return res.status(400).json({
                status: false,
                message: 'error',
                errorMessage: errors.array()
            })
        }
        /** find user */
        const finding = await User.findOne({where:{username: req.body.username}})
        if(!finding){
            return res.status(404).json({
                status: false,
                message: 'error',
                description: 'username was not found.'
            })
        }
        if(finding.status !== 'active'){
            return res.status(401).json({
                status: false,
                message: 'error',
                description: 'please contract admin to approve.'
            })
        }
        try {
            /** check password is correct */
            const isPasswordCorrect = await bcrypt.compare(req.body.password, finding.password)
            if(!isPasswordCorrect){
                return res.status(401).json({
                    status: false,
                    message: 'error',
                    description: 'password was incorrect.'
                })
            }
            /* generate access_token for user */
            const access_token = jwt.sign({
                user_id: finding.id,
                section: 'admin',
                usercode: finding.users_code,
                username: req.body.username,
                psermission: finding.permission,
                at: new Date().getTime()
            }, `${Config.secretKey}`, { expiresIn: '30d' })
            /* generate refresh_token when register and no expire */
            // const refresh_token = jwt.sign({
            //     username: finding.username,
            //     gender: finding.gender,
            //     section: 'admin',
            //     at: new Date().getTime(),
            //     token: access_token
            // }, `${Config.secretKey}`)
            /** update access_token and refresh_token */
            finding.access_token = access_token
            finding.save()
            // const ip = req.ip.split(':')[3]
            const userAgent = req.headers['user-agent']
            const logging = await Log.create({
                user_code: finding.users_code,
                refresh_token: finding.refresh_token,
                details: userAgent,
                ip_address: req.ip,
                section: 'admin',
                status: 'active',
            }) 
            const tokenLogging = await TokenLog.create({
                refresh_token: finding.refresh_token,
                reset_token: '',
                section: 'admin',
                active: true,
            })
            return res.status(201).json({
                status: true,
                message: 'ok',
                description: 'password has checked.',
                access_token: access_token,
                refresh_token: finding.refresh_token,
                profileImg: finding.profile_img,
                adminName: finding.display_name
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
    OnUpdate = async(req: any, res: any) => {
        const errors = validationResult(req)
        if(!errors.isEmpty()){
            return res.status(400).json({
                status: false,
                message: 'error',
                errorMessage: errors.array()
            })
        }
        /** finding user */
        const finding = await User.findOne({where:{users_code: req.body.adminCode}})
        if(!finding){
            return res.status(400).json({
                status: false,
                message: 'error',
                description: 'admin was not found.'
            })
        }
        try {
            /** upload image */
            if(req.file){
                let upload = "/uploads"+req.file.destination.split("uploads").pop()
                let dest = req.file.destination
                var ext = path.extname(req.file.originalname)
                let originalname = path.basename(req.file.originalname, ext)
                for(let i = 1; fs.existsSync(dest+originalname+ext); i++){
                    originalname = originalname.split('(')[0]
                    originalname += '('+i+')'
                }
                const image = await sharp(req.file.path)
                .resize(500, 500)
                .withMetadata()
                .jpeg({ quality: 95})
                .toFile( path.resolve(req.file.destination, originalname+ext))
                .then((data: any) => {
                    fs.unlink( req.file.path, (err) => {
                        if(err){
                            console.log(err)
                        }
                    })
                    return upload+originalname+ext
                })
                finding.profile_img = image
            }
            /** update data user */
            finding.email = req.body.email
            finding.permission = req.body.permission
            finding.display_name = req.body.name
            finding.save()
            return res.status(200).json({
                status: true,
                message: 'ok',
                description: 'data was updated.'
            })
        } catch(error){
            return res.status(500).json({
                status: false,
                message: 'error',
                description: 'something went wrong.'
            })
        }
    }
    OnDelete = async(req: any, res: any) => {
        const errors = validationResult(req)
        if(!errors.isEmpty()){
            return res.status(400).json({
                status: false,
                message: 'erorr',
                errorMessage: errors.array()
            })
        }
        /** find user account */
        const user = await User.findOne({where:{users_code: req.params.code}})
        if(!user){
            return res.status(404).json({
                status: false,
                message: 'error',
                description: 'user was not found.'
            })
        }
        try {
            /** delete user account */
            user.destroy()
            return res.status(200).json({
                status: true,
                message: 'ok',
                description: 'data was deleted.'
            })
        } catch (error){
            return res.status(500).json({
                status: false,
                message: 'error',
                description: 'something went wrong.'
            })
        }
    }
    OnGetAccessToken = async(req: any, res: any) => {
        const finding = await User.findOne({where:{refresh_token: req.body.token}})
        if(!finding){
            return res.status(404).json({
                status: false,
                message: 'error',
                description: 'user was not found.'
            })
        }
        const token = await TokenLog.findOne({where:{refresh_token: finding.refresh_token}})
        if(!token){
            return res.status(400).json({
                status: false,
                message: 'error',
                description: 'token has been revoked.'
            })
        }
        try {
            /* generate new access_token */
            const access_token = jwt.sign({
                user_id: finding.id,
                section: 'admin',
                usercode: finding.users_code,
                username: finding.username,
                at: new Date().getTime()
            }, `${Config.secretKey}`, {expiresIn: '30d'})
            finding.access_token = access_token
            finding.save()
            return res.status(200).json({
                status: true,
                message: 'ok',
                description: 'generated new access token.',
                token: access_token
            })
        } catch(error){
            return res.status(500).json({
                status: false,
                message: 'error',
                description: 'Something went wrong.'
            })
        }
    }
    OnChangeStatus = async(req: any, res: any) => {
        const errors = validationResult(req)
        if(!errors.isEmpty()){
            return res.status(400).json({
                status: false,
                messageL: 'error',
                errorMessage: errors.array()
            })
        }
        const admin = await User.findOne({where: {users_code: req.body.adminCode} })
        if(!admin){
            return res.status(404).json({
                status: false,
                message: 'error',
                description: 'admin was not found.'
            })
        }
        try {
            admin.status = req.body.status
            admin.save()
            return res.status(200).json({
                status: true,
                message: 'ok',
                description: 'status was changed.'
            })
        } catch(error){
            return res.status(500).json({
                status: false,
                message: 'error',
                description: 'something went wrong.'
            })
        }
    }
    OnConfirmRegister = async(req: any, res: any) => {
        const errors = validationResult(req)
        if(!errors.isEmpty()){
            return res.status(400).json({
                status: false,
                messageL: 'error',
                errorMessage: errors.array()
            })
        }
        const admin = await User.findOne({where: {users_code: req.body.adminCode} })
        if(!admin){
            return res.status(404).json({
                status: false,
                message: 'error',
                description: 'admin was not found.'
            })
        }
        try {
            admin.status_confirm = "confirm"
            admin.save()
            return res.status(200).json({
                status: true,
                message: 'ok',
                description: 'confirm was changed.'
            })
        } catch(error){
            return res.status(500).json({
                status: false,
                message: 'error',
                description: 'something went wrong.'
            })
        }
    }
    OnResetPassword = async(req: any, res: any) => {
        const errors = validationResult(req)
        if(!errors.isEmpty()){
            return res.status(400).json({
                status: false,
                message: 'error',
                errorMessage: errors.array()
            })
        }
        const mailSenderUser = await Settings.findOne({where:{setting_name: 'email_user'}})
        const mailSenderPwd = await Settings.findOne({where:{setting_name: 'email_password'}})
        var transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: mailSenderUser.setting_value,
                pass: mailSenderPwd.setting_value
            }
        });
        // point to the template folder
        const handlebarOptions = {
            viewEngine: {
                partialsDir: path.resolve('./dist/views/'),
                defaultLayout: false,
            },
            viewPath: path.resolve('./dist/views/'),
        };
        // use a template file with nodemailer
        transporter.use('compile', hbs(handlebarOptions))
        const users_reset = Math.random().toString().substr(2, 8)+moment().unix()
        try{
            const finding = await User.findOne({where:{username: req.body.username}})
            if(!finding){
                return res.status(404).json({
                    status: false,
                    message: 'error',
                    description: 'admin was not found.'
                })
            }
            const tokenLogging = await TokenLog.create({
                refresh_token: '',
                reset_token: finding.users_code,
                section: 'resetpassword',
                active: true,
            })
            var mailOptions = {
                from: '"Wynnsoft Support" <foo@example.com>', // sender address
                to: req.body.email, // list of receivers
                subject: "Reset password",
                template: 'email', // the name of the template file i.e email.handlebars
                context:{
                    name: finding.username, // replace {{name}} with Adebola
                    company: 'Fillfiin', // replace {{company}} with My Company
                    linkUrl: `https://backoffice.fillfin.com/forgetPassword?token=${finding.users_code}`
                }
            };
            // trigger the sending of the E-mail
            transporter.sendMail(mailOptions, function(error){
                if(error){
                    console.log(error)
                }
            });
            return res.status(200).json({
                status: true,
                message: 'ok',
                description: 'sending mail success.'
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
    OnCheckResetToken = async(req: any, res: any) => {
        const errors = validationResult(req)
        if(!errors.isEmpty()){
            return res.status(400).json({
                status: false,
                message: 'error',
                errorMessage: errors.array()
            })
        }
        try {
            const finding = await TokenLog.findOne({where: {reset_token: req.params.token, section: 'resetpassword'}})
            if(!finding){
                return res.status(400).json({
                    status: false,
                    message: 'error',
                    description: 'can not reset password.'
                })
            }
            return res.status(200).json({
                status: true,
                message: 'ok',
                description: 'reset token has correct.'
            })
        } catch(error){
            return res.status(500).json({
                status: false,
                message: 'error',
                description: 'something went wrong..'
            })
        }
        
    }
    OnUpdateNewPassword = async(req: any, res: any) => {
        const errors = validationResult(req)
        if(!errors.isEmpty()){
            return res.status(400).json({
                status: false,
                message: 'error',
                errorMessage: errors.array()
            })
        }
        const finding = await User.findOne({where:{users_code: req.body.token}})
        if(!finding){
            return res.status(404).json({
                status: false,
                message: 'error',
                description: 'admin was not found.'
            })
        }
        try {
            const hashPass = await bcrypt.hash(req.body.newPassword, 10)
            finding.password = hashPass
            finding.save()
            return res.status(200).json({
                status: true,
                message: 'ok',
                description: 'password has changed.'
            })
        } catch(error){
            return res.status(500).json({
                status: false,
                message: 'error',
                description: 'something went wrong.'
            })    
        }
    }
    OnGetAdminPermission = async(req: any, res: any) => {
        try {
            const adminToken = req.authAdmin
            const user = await User.findOne({where: {id: adminToken.user_id}})
            const permission = await UsersPermission.findOne({where: {id: user.permission}})
            return res.status(200).json({
                status: true,
                message: 'ok',
                description: 'get user success.',
                permission: permission.permission
            })
        } catch (error) {
            return res.status(500).json({
                status: false,
                message: 'error',
                description: 'something went wrong.'
            })
        }
    }
}