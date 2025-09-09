import { Injectable } from '@angular/core';
import { Table } from 'primeng/table';
import * as ExcelJS from 'exceljs';
import * as FileSaver from 'file-saver';
import { TranslateService } from '@ngx-translate/core';

@Injectable({
  providedIn: 'root'
})
export class SitesExcelService {

  constructor(private translate: TranslateService) {}

  exportTableToExcel(table: Table, filename: string, types: any[], dispos: any[]) {    
    
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Sites');

    const headers = table.columns?.map(col => col.header) || [
      this.translate.instant('app.profil.entreprise.sieges.table.content.header.type'),
      this.translate.instant('app.profil.entreprise.sieges.table.content.header.adresse'),
      this.translate.instant('app.profil.entreprise.sieges.table.content.header.city'),
      this.translate.instant('app.profil.entreprise.sieges.table.content.header.dispo'),
      this.translate.instant('app.profil.entreprise.sieges.table.content.header.email'),
      this.translate.instant('app.profil.entreprise.sieges.table.content.header.phone'),
      this.translate.instant('app.profil.entreprise.sieges.table.content.header.dest'),
    ];

    worksheet.addRow(headers);

    const data = table.filteredValue || table.value;

    data.forEach((row: any) => {
      worksheet.addRow([
        this.getLabelByCollectionCode(row.typeCode, types, dispos),
        row.adresse,
        row.city,
        this.getLabelByCollectionCode(row.dispoCode, types, dispos),
        row.email,
        row.phone,
        row.isDest ? this.translate.instant('app.profil.entreprise.sieges.dialog.dest-choices.dest') 
                   : this.translate.instant('app.profil.entreprise.sieges.dialog.dest-choices.fournisseur')
      ]);
    });

    worksheet.getRow(1).font = { bold: true };
    worksheet.columns.forEach(col => col.width = 20);

    workbook.xlsx.writeBuffer().then((buffer: any) => {
      const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8' });
      FileSaver.saveAs(blob, filename);
    });
    
  }

  getLabelByCollectionCode(code: string, types: any[], dispos: any[]): string {
    let subTypes = types.filter(t => t.code == code);
    if (subTypes.length != 0) {
      return subTypes[0].label;
    } else {
      return dispos.filter(t => t.code == code)[0].label;
    }
  }
}
