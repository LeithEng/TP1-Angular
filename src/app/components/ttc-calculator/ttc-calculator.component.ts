/* ************************************************************************** */
/*                                Dependencies                                */
/* ************************************************************************** */

// Lib dependencies
import { Component, computed, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { DecimalPipe } from '@angular/common';

/* ************************************************************************** */
/*                                 Component                                  */
/* ************************************************************************** */

@Component({
  selector: 'app-ttc-calculator',
  standalone: true,
  imports: [FormsModule, DecimalPipe],
  templateUrl: './ttc-calculator.component.html',
  styleUrl: './ttc-calculator.component.css',
})
export class TtcCalculatorComponent {
  /* ********************************************************************** */
  /*                               Signals                                  */
  /* ********************************************************************** */

  unitPriceSignal = signal(0);
  quantitySignal = signal(1);
  vatSignal = signal(18);

  /* ********************************************************************** */
  /*                           Computed Signals                             */
  /* ********************************************************************** */

  priceBeforeTax = computed(() => {
    return this.unitPriceSignal() * this.quantitySignal();
  });

  discountPercentage = computed(() => {
    const qty = this.quantitySignal();
    if (qty > 15) return 30;
    if (qty >= 10) return 20;
    return 0;
  });

  discountAmount = computed(() => {
    return this.priceBeforeTax() * (this.discountPercentage() / 100);
  });

  priceAfterDiscount = computed(() => {
    return this.priceBeforeTax() - this.discountAmount();
  });

  vatAmount = computed(() => {
    return this.priceAfterDiscount() * (this.vatSignal() / 100);
  });

  finalPrice = computed(() => {
    return this.priceAfterDiscount() + this.vatAmount();
  });

  /* ********************************************************************** */
  /*                            Public Methods                              */
  /* ********************************************************************** */

  reset(): void {
    this.unitPriceSignal.set(0);
    this.quantitySignal.set(1);
    this.vatSignal.set(18);
  }
}
