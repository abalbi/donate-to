import { Component, EventEmitter, Input, Output, TemplateRef, ViewChild } from '@angular/core';
import { AddressModel, ColumnItem, ContactModel } from 'src/app/shared/models';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { OrganizationSandbox } from '../../../organization-sandbox';
import { NzModalRef, NzModalService, NzTableQueryParams } from 'ng-zorro-antd';

@Component({
  selector: 'app-address-list',
  templateUrl: './address-list.component.html',
  styleUrls: ['./address-list.component.less'],
})
export class AddressListComponent {
  @Input() isEditOrganization: boolean;
  @Input() addresses: AddressModel[];
  @Output() deleteAddress: EventEmitter<AddressModel> = new EventEmitter<AddressModel>();
  @Output() isEditAddress = new EventEmitter();

  addressModel: AddressModel;
  contactModel: ContactModel;

  name = '';
  street = '';
  postalCode = '';
  floor = '';
  appartment = '';
  country = 0;
  state = 0;
  city = 0;
  additionalInformation = '';
  addressId = 0;
  modalIsVisible = false;
  isOkLoading = false;
  isBranchEdit = false;
  itemIndex: number;
  total = 0;
  pageSize = 10;
  pageIndex = 1;

  expandSet = new Set<number>();
  addressItemFormGroup = new FormGroup({
    itemsFormControl: new FormControl(),
  });

  listOfColumns: ColumnItem[] = [
    { name: '' },
    { name: 'Admin.Organization.OrganizationSteps.Address.Name' },
    { name: 'Admin.Organization.OrganizationSteps.Address.Street' },
    { name: 'Admin.Organization.OrganizationSteps.Address.PostalCode' },
    { name: 'Admin.Organization.OrganizationSteps.Address.Floor' },
    { name: 'Admin.Organization.OrganizationSteps.Address.Appartment' },
    { name: 'Admin.Organization.OrganizationSteps.Address.Country' },
    { name: 'Admin.Organization.OrganizationSteps.Address.State' },
    { name: 'Admin.Organization.OrganizationSteps.Address.City' },
    { name: 'Admin.Organization.OrganizationSteps.Address.AdditionalInformation' },
    { name: 'Admin.Action' },
  ];

  @ViewChild('modalContent') public modalContent: TemplateRef<any>;
  tplModal?: NzModalRef;

  constructor(
    private fb: FormBuilder,
    public organizationSandbox: OrganizationSandbox,
    private modal: NzModalService
  ) {}

  editAddress(item: AddressModel, index: number) {
    this.itemIndex = index;
    this.addressModel = item;
    this.contactModel = item.contact;
    this.isBranchEdit = true;
    this.addressId = item.id;
    this.showModal();
  }

  editedAddress(event) {
    this.hideModal();
    this.isEditAddress.emit({ editedAddress: event, itemIndex: this.itemIndex });
  }

  removeAddress(item: AddressModel) {
    this.addresses = this.addresses.filter((a) => a !== item);
    this.deleteAddress.emit(item);
  }

  onExpandChange(id: number, checked: boolean): void {
    if (checked) {
      this.expandSet.add(id);
    } else {
      this.expandSet.delete(id);
    }
  }

  handleCancel(): void {
    this.hideModal();
  }

  done() {
    this.hideModal();
  }

  showModal() {
    this.createTplModal(this.modalContent);
  }

  createTplModal(tplContent: TemplateRef<{}>): void {
    this.tplModal = this.modal.create({
      nzContent: tplContent,
      nzFooter: null,
      nzClosable: true,
      nzTitle: 'Branch',
      nzStyle: {
        top: '2em;',
      },
      nzWidth: '1000',
    });
  }

  hideModal() {
    this.tplModal?.destroy();
  }
}
