import { Component, Input } from '@angular/core';
import { Invoice } from '../shared/models/invoice.model';


@Component({
  selector: 'app-modal-content',
  standalone: true,
  imports: [],
  templateUrl: './modal-content.component.html',
  styleUrl: './modal-content.component.css'
})
export class ModalContentComponent {
  @Input() selectedInvoice!: Invoice;

  constructor() { }
}
