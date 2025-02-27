import { DBconnect } from "../util/dbconnect";
let sql: string;

export class BankService extends DBconnect {
  constructor() {
    super();
  }
  queryBankAccountAll = async (type_id: any) => {
    let where_type: string = "";
    if (type_id) {
      where_type = `WHERE bank_account.bank_type_id = ?`;
    }
    sql = `SELECT bank_account.*, 
                    bank_type.type_title as bank_type, 
                    bank_provider.name as bank_name, 
                    bank_provider.short_name as bank_shortname, 
                    bank_provider.image 
                FROM bank_account 
                JOIN bank_provider ON (bank_account.bank_provider_id = bank_provider.id)
                JOIN bank_type ON (bank_account.bank_type_id = bank_type.id)
                ${where_type};`;
    return this.findAll(sql, [type_id]);
  };
}
