import { Component, OnInit } from '@angular/core';
import { HomeSandbox } from './home.sandbox';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs/internal/Subscription';
import { ConfigService } from '../app-config.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
})
export class HomeComponent implements OnInit {
  param = { value: 'world' };
  modalVisible = false;
  item: any = null;
  searchValue: string = null;

  currentPage = 1;
  pageSize = 6;
  totalItems = 0;

  constructor(public homeSandbox: HomeSandbox, protected router: Router, protected configService: ConfigService) {
    this.pageSize = this.configService.get('pageSize') || this.pageSize;
  }

  subscriptions: Subscription[] = [];

  ngOnInit(): void {}

  onSearch() {
    this.homeSandbox.loadDonationRequestsSearchPaged(this.pageSize, this.currentPage, this.searchValue);
  }

  showModal(item) {
    this.item = item;
    this.modalVisible = true;
  }

  hideModal() {
    this.item = null;
    this.modalVisible = false;
  }

  goToDonate() {
    this.homeSandbox.login();
  }
}
