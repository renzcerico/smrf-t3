import { ServertimeService } from './servertime.service';
import { Injectable} from '@angular/core';
import { Observable, throwError } from 'rxjs';
import * as moment from 'moment';
import { Subject } from 'rxjs';
import Material from '../classes/material.js';

@Injectable({
  providedIn: 'root'
})
export class MaterialService {
  private materialsSource = new Subject<Array<Material>>();
  materials$ = this.materialsSource.asObservable();
  materials: Array<Material>;

  defaultMaterial = [
    {
      QUANTITY: 100,
      STANDARD: 100,
      REQUIREMENTS: 100,
      USED: 0,
      ITEM_CATEGORY: 'ADAPTER',
      BOX_TYPE: null,
      MAX_QTY: 100,
      MATERIAL_CODE: 'TLBOXLADEW',
      MATERIAL_DESC: 'DEWALT (Box Label large) [TLBOXLADEW] DEWALT 紙箱標簽  大',
      },
      {
      QUANTITY: 20,
      STANDARD: 20,
      REQUIREMENTS: 500,
      USED: 0,
      ITEM_CATEGORY: 'ADAPTER',
      BOX_TYPE: null,
      MAX_QTY: 100,
      MATERIAL_CODE: 'ZTDBSAFEB&D',
      MATERIAL_DESC: 'B&D OFF,CUTTING,FLAP 說 明書',
      },
      {
      QUANTITY: 1,
      STANDARD: 1,
      REQUIREMENTS: 10000,
      USED: 0,
      ITEM_CATEGORY: 'LABELS',
      BOX_TYPE: null,
      MAX_QTY: 1,
      MATERIAL_CODE: 'UC44602DEP',
      MATERIAL_DESC: 'FLAT 180mm x 1.6mm x 22.23mm A60T-BF DW44602 (OSA) N179555 PH DEWALT (9) LA4',
      },
      {
      QUANTITY: 1,
      STANDARD: 1,
      REQUIREMENTS: 10000,
      USED: 0,
      ITEM_CATEGORY: 'CUT SKILL',
      BOX_TYPE: null,
      MAX_QTY: 1,
      MATERIAL_CODE: '20075APDEP1XF',
      MATERIAL_DESC: 'C.S 180*1.6*22 AA46T 2G(套片日期) DEWA [275APDEP]',
      },
      {
      QUANTITY: 100,
      STANDARD: 100,
      REQUIREMENTS: 100,
      USED: 0,
      MATERIAL_CODE: 'VC716BMBDP',
      ITEM_CATEGORY: 'BOX',
      BOX_TYPE: 'B',
      MAX_QTY: 200,
      MATERIAL_DESC: 'C180x1.6(正) B 100PC (20片組) DW44602 印刷 PH [VC716BMBDP]',
      },
      {
      QUANTITY: 200,
      STANDARD: 200,
      REQUIREMENTS: 50,
      USED: 0,
      MATERIAL_CODE: 'VC716CNBBB',
      ITEM_CATEGORY: 'BOX',
      BOX_TYPE: 'C',
      MAX_QTY: 200,
      MATERIAL_DESC: 'C 180 x 1.6 C 200PCS 40.6 x 20.6 x 29.4 [VC716CNBBB] | C 180 x 1.6(正) C 200PCS',
      },
      {
      QUANTITY: 20,
      STANDARD: 20,
      REQUIREMENTS: 500,
      USED: 0,
      MATERIAL_CODE: 'VC716AGBDP',
      ITEM_CATEGORY: 'BOX',
      BOX_TYPE: 'A',
      MAX_QTY: 200,
      MATERIAL_DESC: 'C180x1.6 (正) A 20PC DW44602 印刷 PH [VC716AGBDP]',
      }
  ];
  servertime: string;
  constructor(private servertimeService: ServertimeService) {
    servertimeService.time$.subscribe(
      datetime => {
          this.servertime = moment(datetime).format('DD-MMM-YYYY HH:mm:ss');
      }
    );
    this.materials$.subscribe(
      materials => {
        this.materials = materials;
      }
    );
  }

  setMaterials(materials: Array<any>) {
    const materialsArr = [];
    materials.forEach(element => {
        (element.DATE_ENTERED ? element.DATE_ENTERED = moment(element.DATE_ENTERED).format() : element.DATE_ENTERED = this.servertime);
        (element.DATE_UPDATED ? element.DATE_UPDATED = moment(element.DATE_UPDATED).format() : element.DATE_UPDATED = this.servertime);
        const material = new Material(element);
        materialsArr.push(material);
    });
    this.materialsSource.next(materialsArr);
  }

  maxBoxQty() {
    let maxBoxQty = 0;
    if ( Object.entries(this.materials).length > 0 ) {
      this.materials.forEach(material => {
        if ( material.ITEM_CATEGORY === 'BOX' && material.MAX_QTY > maxBoxQty ) {
          maxBoxQty = material.MAX_QTY;
        }
      });
    }
    return maxBoxQty;
  }

}
