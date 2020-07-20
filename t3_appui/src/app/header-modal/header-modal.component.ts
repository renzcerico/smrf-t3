import { HeaderService } from './../services/header.service';
import { Component, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-header-modal',
  templateUrl: './header-modal.component.html',
  styleUrls: ['./header-modal.component.css', '../app.component.css', '../material/material.component.css']
})
export class HeaderModalComponent implements OnInit {
  searchVal = '';
  currentStatus = '';
  currentStatusDesc = '';
  status: number;
  showCount: number;
  pageNumber: number;
  headerList: Array<any> = [];
  loading: boolean;
  totalCount: number;
  orderBy = '';
  orderOrder = 'ASC';

  constructor(public activeModal: NgbActiveModal, public headerService: HeaderService) { }
  ngOnInit() {
    this.loading = true;
    if (this.status === 1) {
      this.currentStatus = 'dot status-wip';
      this.currentStatusDesc = 'WIP';
    } else if (this.status === 2) {
      this.currentStatus = 'dot status-open';
      this.currentStatusDesc = 'OPEN';
    } else if (this.status === 3) {
      this.currentStatus = 'dot status-completed';
      this.currentStatusDesc = 'COMPLETED';
    } else if (this.status === 4) {
      this.currentStatus = 'dot status-closed';
      this.currentStatusDesc = 'CLOSED';
    }
    this.getHeaderbyStatus(this.paginationData);
  }

  async getHeaderbyStatus(data) {
    await this.headerService.getHeaderByStatus(data).toPromise()
    .then(
        res => {
            this.loading = false;
            this.headerList = res.data;
            this.totalCount = res.counter;
        }
    );
  }

  openHeader(barcode) {
    this.headerService.getData(barcode);
    this.activeModal.dismiss('Cross click');
  }

  refreshSource() {
    this.getHeaderbyStatus(this.paginationData);
  }

  get paginationData(): object {
    const data = {
      status_code: this.status,
      show_count: this.showCount,
      page_number: this.pageNumber,
      search_val: this.searchVal.trim(),
      order_by: this.orderBy,
      order_order: this.orderOrder
    };
    return data;
  }

  get showCountOpts(): Array<number> {
    const opts = [1];
    for (let index = 10; index <= 100; index = index + 10) {
      opts.push(index);
    }
    return opts;
  }

  toggleOrder(orderBy: string) {
    (this.orderOrder === 'DESC' ? this.orderOrder = 'ASC' : this.orderOrder = 'DESC');
    this.orderBy = orderBy;
    this.refreshSource();
  }

  get showing(): Array<number> {
    const first = (this.totalCount ? (this.showCount * (this.pageNumber - 1)) + 1 : 0);
    let second = this.pageNumber * this.showCount;
    if (second > this.totalCount) {
      second = this.totalCount;
    }
    return [first, second];
  }

}
