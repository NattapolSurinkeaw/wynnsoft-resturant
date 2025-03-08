import { User } from "../models/users";
import { UsersPermission } from "../models/usersPermission";
import { WebInfo } from "../models/webInfo";
import { webInfoType } from "../models/webInfoType";

export class WebSettingController {
  OngetWebinfos = async (req: any, res: any) => {
    try {
      const webinfo = await WebInfo.findAll();
      const web_info_types = await webInfoType.findAll();
      return res.status(200).json({
        status: true,
        message: "ok",
        description: "get data success.",
        webinfo: webinfo,
        webinfotype: web_info_types,
      });
    } catch(error){
      return res.status(500).json({
          status: false,
          message: 'error',
          description: 'something went wrong.'
      })
    }
  }
  OnEditDataShop = async (req: any, res: any) => {
    try {
      console.log(req.body);
    } catch(error){
      return res.status(500).json({
          status: false,
          message: 'error',
          description: 'something went wrong.'
      })
    }
  }
}