import { InvoiceService } from './../../services/invoice.service';
import { OrderService } from './../../services/order.service';
import { Component, OnInit, ViewChild } from '@angular/core';
import { OrderItemsModel } from '../../models/Order/orderitemsmodel';
import { OrderListModel, OrderListModelForOrderHistoryPage } from '../../models/Order/orderlistmodel';
import { PageRequest } from '../../models/pagerequest';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatSort, Sort } from '@angular/material/sort';
import { LiveAnnouncer } from '@angular/cdk/a11y';
import { MatTableDataSource } from '@angular/material/table';
import { forkJoin, map, merge, switchMap } from 'rxjs';

@Component({
  selector: 'app-order-history',
  templateUrl: './order-history.component.html',
  styleUrl: './order-history.component.css',
})
export class OrderHistoryComponent implements OnInit {
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  orderDataSource = new MatTableDataSource<OrderListModelForOrderHistoryPage>();
  columnsToDisplay = ['address', 'orderItems', 'invoiceFileUrl', 'createdDate'];
  expandedElement: OrderItemsModel | null;

  constructor(
    private orderService: OrderService,
    private _liveAnnouncer: LiveAnnouncer,
    private invoiceService: InvoiceService
  ) { }

  ngOnInit(): void {
    this.getAllOrders();
  }

  ngAfterViewInit() {
    this.orderDataSource.sort = this.sort;
  }

  getAllOrders() {
    var pageRequest = new PageRequest();
    let pageNumber = this.paginator ? this.paginator.pageIndex : 0;
    let pageSize = this.paginator ? this.paginator.pageSize : 4;
    pageRequest.pageNumber = pageNumber;
    pageRequest.pageSize = pageSize;
    this.orderService.getAll(pageRequest).subscribe({
      next: orderRes => {
        if (orderRes.isSuccessful) {
          this.paginator.length = orderRes.data.count;
          this.mapOrdersByInvoiceFileUrl(orderRes.data.items);
        }
      }
    });
  }

  mapOrdersByInvoiceFileUrl(orders: OrderListModel[]) {
    const orderListObservables = orders.map(order => {
      return this.invoiceService.getInvoiceFileUrl(order.id, order.buyerId).pipe(
        map(response => {
          let orderListModelForOrderHistoryPage = new OrderListModelForOrderHistoryPage();
          orderListModelForOrderHistoryPage.address = order.address;
          orderListModelForOrderHistoryPage.buyerId = order.buyerId;
          orderListModelForOrderHistoryPage.createdDate = order.createdDate;
          orderListModelForOrderHistoryPage.id = order.id;
          orderListModelForOrderHistoryPage.orderItems = order.orderItems;
          orderListModelForOrderHistoryPage.invoiceFileUrl = response.isSuccessful ? response.data.fileUrl : "";
          return orderListModelForOrderHistoryPage;
        })
      );
    });

    forkJoin(orderListObservables).subscribe({
      next: orderListModels => {
        this.orderDataSource.data = orderListModels;
      },
      error: err => {
        console.log(err);
      }
    });
  }

  announceSortChange(sortState: Sort) {
    if (sortState.direction) {
      this._liveAnnouncer.announce(`Sorted ${sortState.direction}ending`);
    } else {
      this._liveAnnouncer.announce('Sorting cleared');
    }
  }

  handlePageEvent(e: PageEvent) {
    this.getAllOrders();
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.orderDataSource.filter = filterValue.trim().toLowerCase();
  }
}
