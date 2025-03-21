import { Store } from './models/store';
import { ChatTemp } from './models/chat_temp';
import { sequelize } from './util/database';
import { Settings } from './models/settings'
import express, { Application } from 'express'
import { socketPort, serverPort } from './util/config'
import * as SyncModels from './models/SyncModels'
import path from 'path'
import { SIO } from './util/Sockets'
import { videoRouter } from './routes/videoRouter'
import { websiteRouter } from './routes/websiteRouter'
import { adminRouter } from './routes/adminRouter'
import { storeRouter } from './routes/storeRouter'
import { memberRouter } from './routes/memberRouter'
import { backOfficeRoute } from './routes/backOfficeRoute';
import { frontOfficeRoute } from './routes/frontOfficeRoute';

import cron = require('node-cron')
import moment from 'moment'
import momentTimeZone from'moment-timezone'
import fs from 'fs'
import bodyParser from 'body-parser';

moment.locale('th');
momentTimeZone().tz('Asia/Bangkok');
 
/* เปิด SyncModels เมื่อเปลี่ยนแปลง Database Structure */
// SyncModels.OnInit()

const app: Application = express()
app.use(express.static(path.join(__dirname, './../dist/public/')))

/*  -------- converting json -------- */  
app.use(bodyParser.json({ limit: '100mb' }));
app.use(bodyParser.urlencoded({ extended: true, limit: '100mb' }));

/* Middleware */
app.use((req: any, res: any, next: any) => {
    res.setHeader('Access-Control-Allow-Origin', '*' )
    res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS, POST, PUT, PATCH, DELETE')
    res.setHeader('Access-Control-Allow-Headers',  "Origin, X-Requested-With, Content-Type, Accept, Authorization")
    next()
})
  
app.use(memberRouter) 
app.use(adminRouter) 
// app.use(storeRouter)
// app.use(websiteRouter)
app.use(videoRouter)
app.use(backOfficeRoute)
app.use(frontOfficeRoute)

app.use("/test", (req:any, res:any) => { 
    res.status(200).json({message: "ok"}) 
})

/* Socket Start */
const server = app.listen(socketPort,'0.0.0.0')
const io = SIO.init(server)

/**------------- 0 0 * * * * -------------
 * run cron-job every 1 Hour
*/
cron.schedule('0 0 * * * *', async() => {
    /** for remove folder slip old than 'cron_job_month' value */
    const cron_job = await Settings.findOne({where:{setting_name: 'cron_job_month'}})
    var public_path = path.join(__dirname, './../dist/public/')
    const folderPath = `/slip/${moment().format('YYYY')}/${moment().subtract(parseInt(cron_job.setting_value), 'months').format('MM')}`
    const folderPathSpacialimage = `/spacialImage/${moment().format('YYYY')}/${moment().subtract(parseInt(cron_job.setting_value), 'months').format('MM')}`
    const folderPathBillImage = `/bill/${moment().format('YYYY')}/${moment().subtract(parseInt(cron_job.setting_value), 'months').format('MM')}`
    if(fs.existsSync(public_path+folderPath)){
        fs.rmSync(public_path+folderPath, { recursive: true })
    }
    /** For delete spacial image old than 'cron_job_month' value */
    if(fs.existsSync(public_path+folderPathSpacialimage)){
        fs.rmSync(public_path+folderPathSpacialimage, { recursive: true })
    }
    /** For delete spacial image old than 'cron_job_month' value */
    if(fs.existsSync(public_path+folderPathBillImage)){
        fs.rmSync(public_path+folderPathBillImage, { recursive: true })
    }
    /** for delete message old than 'time_delete_message' value */
    const delete_message = await Settings.findOne({where:{setting_name: 'time_delete_message'}})
    const dateToDelete = moment().subtract(parseInt(delete_message.setting_value), 'days').format('YYYY-MM-DD')
    await ChatTemp.destroy({
        where: sequelize.where(sequelize.fn('date', sequelize.col('createdAt')), '=', dateToDelete)
    })
    const time = new Date()
    if(time.getHours() === 0 && time.getMinutes() === 0 && time.getSeconds() === 1 && time.getDate() === 1 && time.getMonth() + 1 === 1){
        const storeAll = await Store.update(
        {
            age: sequelize.literal('age + 1')
        },{
            where: {
                status: 'active'
            }
        })
    }
})

app.listen(serverPort)