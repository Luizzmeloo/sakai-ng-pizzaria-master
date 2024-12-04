import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CrudClienteComponent } from './crud-cliente.component';

@NgModule({
	imports: [RouterModule.forChild([
		{ path: '', component: CrudClienteComponent }
	])],
	exports: [RouterModule]
})
export class CrudClienteRoutingModule { }
